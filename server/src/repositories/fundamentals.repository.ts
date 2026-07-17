import axios from 'axios';
import * as cheerio from 'cheerio';
import { ExternalApiError } from '@errors/external-api.error';

const GOOGLE_FINANCE_BASE = 'https://www.google.com/finance/quote';

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

class FundamentalsRepository {
  private static instance: FundamentalsRepository;

  private constructor() {}

  public static getInstance(): FundamentalsRepository {
    if (!FundamentalsRepository.instance) {
      FundamentalsRepository.instance = new FundamentalsRepository();
    }
    return FundamentalsRepository.instance;
  }

  public async scrape(googleFinancePath: string): Promise<{ peRatio: number | null; latestEarnings: number | null }> {
    const url = `${GOOGLE_FINANCE_BASE}/${googleFinancePath}`;
    let html: string;

    try {
      const response = await axios.get<string>(url, { headers: REQUEST_HEADERS, timeout: 8000 });
      html = response.data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? `HTTP ${err.response?.status ?? 'timeout'} — ${err.message}`
        : err instanceof Error ? err.message : 'Error';
      throw new ExternalApiError(`Google Finance scrape failed for ${googleFinancePath}: ${message}`);
    }

    return this.parseHtml(html);
  }

  private parseHtml(html: string): { peRatio: number | null; latestEarnings: number | null } {
    const data = cheerio.load(html);
    let peRatio: number | null = null;
    let latestEarnings: number | null = null;

    data('div').each((_, el) => {
      const labelText = data(el).text().trim();

      if (labelText === 'P/E ratio' && peRatio === null) {
        const raw = data(el).next('div').text().trim();
        const parsed = this.toFloat(raw);
        if (parsed !== null) peRatio = parsed;
      }

      if ((labelText === 'EPS' || labelText === 'Earnings per share') && latestEarnings === null) {
        const raw = data(el).next('div').text().trim();
        const parsed = this.toFloat(raw);
        if (parsed !== null) latestEarnings = parsed;
      }
    });

    return { peRatio, latestEarnings };
  }

  private toFloat(raw: string): number | null {
    const cleaned = raw.replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
}

export default FundamentalsRepository;
