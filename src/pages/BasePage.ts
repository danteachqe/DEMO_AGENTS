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
    await this.pace();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  protected exactText(text: string): RegExp {
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${escaped}$`);
  }

  protected async pace(): Promise<void> {
    if (config.stepDelay > 0) {
      await this.page.waitForTimeout(config.stepDelay);
    }
  }
}
