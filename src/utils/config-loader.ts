import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

const DEFAULT_BASE_URL = 'https://blazedemo.com';
const DEFAULT_TIMEOUT = 60000;
const DEFAULT_STEP_DELAY = 1000;

function readString(name: string, fallback: string): string {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  return raw.trim();
}

function readNumber(name: string, fallback: number, isValid: (value: number) => boolean): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  const value = Number(raw.trim());
  return Number.isFinite(value) && isValid(value) ? value : fallback;
}

export interface FrameworkConfig {
  baseUrl: string;
  timeout: number;
  stepDelay: number;
}

export const config: FrameworkConfig = {
  baseUrl: readString('BASE_URL', DEFAULT_BASE_URL),
  timeout: readNumber('TIMEOUT', DEFAULT_TIMEOUT, (v) => v > 0),
  stepDelay: readNumber('STEP_DELAY', DEFAULT_STEP_DELAY, (v) => v >= 0),
};
