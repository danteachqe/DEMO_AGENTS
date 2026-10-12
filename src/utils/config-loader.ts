import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

export interface FrameworkConfig {
  baseUrl: string;
  timeout: number;
  stepDelay: number;
}

const DEFAULT_BASE_URL = 'https://blazedemo.com';
const DEFAULT_TIMEOUT = 60000;
const DEFAULT_STEP_DELAY = 1000;

function readString(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw === undefined || raw.trim() === '' ? fallback : raw.trim();
}

function readNumber(name: string, fallback: number, isValid: (n: number) => boolean): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw.trim());
  return Number.isFinite(parsed) && isValid(parsed) ? parsed : fallback;
}

export const config: FrameworkConfig = {
  baseUrl: readString('BASE_URL', DEFAULT_BASE_URL),
  timeout: readNumber('TIMEOUT', DEFAULT_TIMEOUT, (n) => n > 0),
  stepDelay: readNumber('STEP_DELAY', DEFAULT_STEP_DELAY, (n) => n >= 0),
};
