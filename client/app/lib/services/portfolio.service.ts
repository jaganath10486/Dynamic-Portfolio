import FetchClient from "@services/fetch.service";
import { BASE_URL } from "@configs/common.config";
import {
  PORTFOLIO_ENDPOINTS,
  PORTFOLIO_REVALIDATE_SECONDS,
} from "@constants/portfolio.constants";
import type { ApiResponse } from "@interfaces/http.interface";
import type {
  PortfolioHoldingsInterface,
  PortfolioSummaryInterface,
} from "@interfaces/portfolio.interface";

class PortfolioService {
  private readonly client: FetchClient;

  constructor() {
    this.client = new FetchClient(BASE_URL);
  }

  async getPortfolioHoldings(
    params?: Record<string, string>,
  ): Promise<ApiResponse<PortfolioHoldingsInterface>> {
    try {
      const response = await this.client.executeRequest<
        ApiResponse<PortfolioHoldingsInterface>
      >({
        method: "GET",
        url: PORTFOLIO_ENDPOINTS.HOLDINGS,
        params,
        nextOptions: { revalidate: PORTFOLIO_REVALIDATE_SECONDS },
      });
      console.log("response:", response);
      return response.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "Failed to fetch portfolio holdings",
      );
    }
  }

  async getPortfolioSummary(): Promise<ApiResponse<PortfolioSummaryInterface>> {
    try {
      const response = await this.client.executeRequest<
        ApiResponse<PortfolioSummaryInterface>
      >({
        method: "GET",
        url: PORTFOLIO_ENDPOINTS.SUMMARY,
        nextOptions: { revalidate: PORTFOLIO_REVALIDATE_SECONDS },
      });
      return response.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "Failed to fetch portfolio summary",
      );
    }
  }
}

export default PortfolioService;
