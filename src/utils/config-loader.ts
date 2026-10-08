import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

export interface FrameworkConfig {
  baseUrl: string;
  timeout: number;
  stepDelay: number;
}

/** Blank or invalid values (including below `min`) fall back to the default. */
const toNumber = (value: string | undefined, fallback: number, min = 0): number => {
  if (value === undefined || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
};

export const config: FrameworkConfig = {
  baseUrl: process.env.BASE_URL || 'https://blazedemo.com',
  timeout: toNumber(process.env.TIMEOUT, 60000, 1),
  stepDelay: toNumber(process.env.STEP_DELAY, 1000),
};
