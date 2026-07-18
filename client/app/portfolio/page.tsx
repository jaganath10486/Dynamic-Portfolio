import type { Metadata } from "next";
import PortfolioClient from "./components";
import PortfolioService from "@services/portfolio.service";
import type {
  PortfolioHoldingsInterface,
  PortfolioSummaryInterface,
} from "@interfaces/portfolio.interface";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Track your investment portfolio in real-time. View holdings, present value, gain/loss performance, and fundamental metrics like P/E ratio and EPS across all sectors.",
  openGraph: {
    title: "Portfolio Dashboard",
    description:
      "Track your investment portfolio in real-time. View holdings, present value, gain/loss performance, and fundamental metrics like P/E ratio and EPS across all sectors.",
    type: "website",
  },
};

export default async function PortfolioPage() {
  const service = new PortfolioService();

  let initialHoldings: PortfolioHoldingsInterface | null = null;
  let initialSummary: PortfolioSummaryInterface | null = null;
  let initialError: string | null = null;

  try {
    const [holdingsRes, summaryRes] = await Promise.all([
      service.getPortfolioHoldings(),
      service.getPortfolioSummary(),
    ]);

    if (holdingsRes.success) {
      initialHoldings = holdingsRes.data;
    } else if (!holdingsRes.success) {
      initialError = holdingsRes.message;
    }
    if (summaryRes.success) {
      initialSummary = summaryRes.data;
    }
  } catch (err) {
    initialError =
      err instanceof Error ? err.message : "Unexpected error loading portfolio";
  }
  console.log("PortfolioPage initialError:", initialError);
  console.log("PortfolioPage initialHoldings:", initialHoldings);
  console.log("PortfolioPage initialSummary:", initialSummary);
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <PortfolioClient
          initialHoldings={initialHoldings}
          initialSummary={initialSummary}
          initialError={initialError}
        />
      </div>
    </main>
  );
}
