import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

export interface FrameworkConfig {
  baseUrl: string;
  timeout: number;
  stepDelay: number;
}

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export const config: FrameworkConfig = {
  baseUrl: process.env.BASE_URL || 'https://blazedemo.com',
  timeout: toNumber(process.env.TIMEOUT, 60000),
  stepDelay: toNumber(process.env.STEP_DELAY, 1000),
};
