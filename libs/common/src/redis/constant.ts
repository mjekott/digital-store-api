export const REDIS_KEY = {
  VERIFICATION_OTP: (userId: string | number) =>
    `verification-otp-user-${userId}`,
};
