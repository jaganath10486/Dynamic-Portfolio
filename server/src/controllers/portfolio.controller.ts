import { Request, Response, NextFunction } from 'express';
import PortfolioService from '@services/portfolio.service';

class PortfolioController {
  private readonly portfolioService: PortfolioService;

  constructor() {
    this.portfolioService = PortfolioService.getInstance();
    this.getHoldings = this.getHoldings.bind(this);
    this.getSummary = this.getSummary.bind(this);
  }

  public async getHoldings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.portfolioService.getPortfolioHoldings();
      res.json({ data, message: 'Portfolio holdings fetched successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.portfolioService.getPortfolioSummary();
      res.json({ data, message: 'Portfolio summary fetched successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default PortfolioController;
