import { CorsOptions } from 'cors';
import { CORS_ORIGIN } from '@config/app.config';

export const corsOptions: CorsOptions = {
  origin: CORS_ORIGIN,
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
};
