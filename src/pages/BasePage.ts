import { Page } from '@playwright/test';
import { config } from '../utils/config-loader';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Anchored, regex-escaped matcher for an exact cell/label text. */
  protected exactText(text: string): RegExp {
    return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  }

  /** Visible pause between steps (STEP_DELAY, default 1000ms) so execution can be watched. */
  protected async pace(): Promise<void> {
    await this.page.waitForTimeout(config.stepDelay);
  }
}
