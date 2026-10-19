import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DEFAULTS = {
  BASE_URL: 'https://blazedemo.com',
  TIMEOUT: 60000,
  STEP_DELAY: 1000,
} as const;

function readString(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw && raw.trim() !== '' ? raw.trim() : fallback;
}

function readNumber(name: string, fallback: number, isValid: (n: number) => boolean): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw.trim());
  return Number.isFinite(parsed) && isValid(parsed) ? parsed : fallback;
}

export interface Config {
  baseUrl: string;
  timeout: number;
  stepDelay: number;
}

export const config: Config = {
  baseUrl: readString('BASE_URL', DEFAULTS.BASE_URL),
  timeout: readNumber('TIMEOUT', DEFAULTS.TIMEOUT, (n) => n > 0),
  stepDelay: readNumber('STEP_DELAY', DEFAULTS.STEP_DELAY, (n) => n >= 0),
};
