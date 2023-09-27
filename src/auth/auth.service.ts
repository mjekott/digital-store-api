import { HashingService } from '@app/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { UserRepository } from 'src/user/user.respository';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ResetPasswordDto,
  SendResetPasswordDto,
} from './dto/reset-password.dto';
import {
  SendEmailVerificationDto,
  VerifyEmailDto,
} from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRedis() private readonly redis: Redis,
    @InjectQueue('auth-email') private readonly emailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Registers a new user account and sends a verification email.
   * @param registerDto - The registration data.
   * @returns An object containing the registered user and a message.
   */
  async registerUser(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    await this.sendVerificationToken(user.email);
    return {
      user,
      message: 'Please verify your email',
    };
  }

  /**
   * Validates a user's credentials and generates an access token.
   * @param loginDto - The login data.
   * @returns An object containing the access token and the user.
   * @throws UnprocessableEntityException if the credentials are invalid or the email is not verified.
   */
  async loginUser(loginDto: LoginDto) {
    const user = await this.userService.validateUser(loginDto);
    if (!user) {
      throw new UnprocessableEntityException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnprocessableEntityException('Please verify your email');
    }
    const accessToken = await this.jwtService.signAsync(
      { email: user.email, sub: user._id, role: user.type },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY'),
      },
    );

    delete user.password;

    return { accessToken, user };
  }

  /**
   * Verifies a user's email address using a verification code.
   * @param verifyEmailDto - The verification data.
   * @returns An object containing a success message.
   * @throws UnprocessableEntityException if the verification code is invalid.
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const verificationCode = await this.redis.get(
      `verification_otp:${verifyEmailDto.email}`,
    );

    if (!verificationCode || verifyEmailDto.code !== verificationCode) {
      throw new UnprocessableEntityException('Invalid Code');
    }

    await this.userRepository.findOneAndUpdate(
      {
        email: verifyEmailDto.email,
      },
      {
        $set: {
          isVerified: true,
        },
      },
    );
    await this.redis.del(`verification_otp:${verifyEmailDto.email}`);
    this.emailQueue.add(
      'verify-email-success',
      {
        email: verifyEmailDto.email,
      },
      { removeOnComplete: true },
    );

    return { message: 'Account verified successfully' };
  }

  /**
   * Sends a verification email to a user.
   * @param sendEmailVerificationDto - The email data.
   * @returns An object containing a success message.
   * @throws UnprocessableEntityException if no user account is found with the provided email.
   */
  async sendEmailVerification(
    sendEmailVerificationDto: SendEmailVerificationDto,
  ) {
    const user = await this.userRepository.findOne({
      email: sendEmailVerificationDto.email,
    });
    if (!user) {
      throw new UnprocessableEntityException(
        'No user account found with such email',
      );
    }
    await this.sendVerificationToken(user.email);

    return { message: 'A code has been sent to your email' };
  }

  /**
   * Sends a reset password code to a user's email.
   * @param sendResetPasswordDto - The data containing the user's email.
   * @returns An object containing a success message.
   * @throws NotFoundException if no user account is found with the provided email.
   */
  async sendResetPasswordCode(sendResetPasswordDto: SendResetPasswordDto) {
    const user = await this.userRepository.findOne({
      email: sendResetPasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException('Account not found');
    }
    await this.sendResetPasswordToken(sendResetPasswordDto.email);
    return { message: 'A reset password code has been sent to your account' };
  }

  /**
   * Resets a user's password using a verification code.
   * @param resetPasswordDto - The data containing the user's email, new password, and verification code.
   * @returns An object containing a success message.
   * @throws UnprocessableEntityException if the verification code is invalid.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const validatedCode = await this.redis.get(
      `reset_password_otp:${resetPasswordDto.email}`,
    );
    if (!validatedCode || resetPasswordDto.code !== validatedCode) {
      throw new UnprocessableEntityException('Code Invalid');
    }

    await this.userRepository.findOneAndUpdate(
      { email: resetPasswordDto.email },
      {
        $set: {
          password: await this.hashingService.hash(resetPasswordDto.password),
        },
      },
    );

    await this.redis.del(`reset_password_otp:${resetPasswordDto.email}`);

    this.emailQueue.add(
      'reset-password-email-success',
      {
        email: resetPasswordDto.email,
      },
      { removeOnComplete: true },
    );

    return { message: 'Password reset successfully' };
  }

  private async sendVerificationToken(email: string) {
    const verificationOtp = this.generateRandomCode();
    await this.redis.setex(`verification_otp:${email}`, 600, verificationOtp);

    this.emailQueue.add(
      'verify-email',
      {
        email,
        otp: verificationOtp,
      },
      { removeOnComplete: true },
    );
  }

  private async sendResetPasswordToken(email: string) {
    const code = this.generateRandomCode();
    await this.redis.setex(`reset_password_otp:${email}`, 600, code);

    this.emailQueue.add(
      'reset-password-mail',
      {
        email,
        code,
      },
      { removeOnComplete: true },
    );
  }

  private generateRandomCode() {
    return Math.floor(Math.random() * 999999) + 100000;
  }
}
