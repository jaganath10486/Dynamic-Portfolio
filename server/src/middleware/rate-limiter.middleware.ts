import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEDED',
      message: 'Too many requests. Please try again in a minute.',
    },
  },
});
