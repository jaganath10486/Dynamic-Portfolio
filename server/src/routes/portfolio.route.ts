import { Router } from 'express';
import { IRoute } from '@interfaces/route.interface';
import PortfolioController from '@controllers/portfolio.controller';

class PortfolioRoute implements IRoute {
  public path = '/portfolio';
  public router: Router;
  private readonly portfolioController: PortfolioController;

  constructor() {
    this.router = Router();
    this.portfolioController = new PortfolioController();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get('/holdings', this.portfolioController.getHoldings);
    this.router.get('/summary', this.portfolioController.getSummary);
  }
}

export default PortfolioRoute;
