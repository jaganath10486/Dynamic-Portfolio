import { Router } from 'express';
import PortfolioRoute from '@routes/portfolio.route';

const router = Router();

const portfolioRoute = new PortfolioRoute();
router.use(portfolioRoute.path, portfolioRoute.router);

export default router;
