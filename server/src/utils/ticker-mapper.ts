interface TickerMapping {
  yahooSymbol: string;
  googleFinancePath: string;
}

const tickerMap: Readonly<Record<string, TickerMapping>> = {
  HDFCBANK:   { yahooSymbol: 'HDFCBANK.NS',   googleFinancePath: 'HDFCBANK:NSE' },
  BAJFINANCE: { yahooSymbol: 'BAJFINANCE.NS',  googleFinancePath: 'BAJFINANCE:NSE' },
  '532174':   { yahooSymbol: '532174.NS',      googleFinancePath: 'ICICIBANK:NSE' },
  '544252':   { yahooSymbol: '544252.NS',      googleFinancePath: 'BAJAJHFL:NSE' },
  '511577':   { yahooSymbol: '511577.NS',      googleFinancePath: '511577:NSE' },
  AFFLE:      { yahooSymbol: 'AFFLE.NS',       googleFinancePath: 'AFFLE:NSE' },
  LTIM:       { yahooSymbol: 'LTIM.NS',        googleFinancePath: 'LTIM:NSE' },
  '542651':   { yahooSymbol: '542651.NS',      googleFinancePath: 'KPITTECH:NSE' },
  '544028':   { yahooSymbol: '544028.NS',      googleFinancePath: 'TATATECH:NSE' },
  '544107':   { yahooSymbol: '544107.NS',      googleFinancePath: 'BLS:NSE' },
  '532790':   { yahooSymbol: '532790.NS',      googleFinancePath: 'TANLA:NSE' },
  DMART:      { yahooSymbol: 'DMART.NS',       googleFinancePath: 'DMART:NSE' },
  '532540':   { yahooSymbol: '532540.NS',      googleFinancePath: 'TATACONSUM:NSE' },
  '500331':   { yahooSymbol: '500331.NS',      googleFinancePath: 'PIDILITIND:NSE' },
  '500400':   { yahooSymbol: '500400.NS',      googleFinancePath: 'TATAPOWER:NSE' },
  '542323':   { yahooSymbol: '542323.NS',      googleFinancePath: 'KPIGREEN:NSE' },
  '532667':   { yahooSymbol: '532667.NS',      googleFinancePath: 'SUZLON:NSE' },
  '542851':   { yahooSymbol: '542851.NS',      googleFinancePath: 'GENSOL:NSE' },
  '543517':   { yahooSymbol: '543517.NS',      googleFinancePath: 'HARIOMPIPE:NSE' },
  ASTRAL:     { yahooSymbol: 'ASTRAL.NS',      googleFinancePath: 'ASTRAL:NSE' },
  '542652':   { yahooSymbol: '542652.NS',      googleFinancePath: 'POLYCAB:NSE' },
  '543318':   { yahooSymbol: '543318.NS',      googleFinancePath: 'CLEAN:NSE' },
  '506401':   { yahooSymbol: '506401.NS',      googleFinancePath: 'DEEPAKNTR:NSE' },
  '541557':   { yahooSymbol: '541557.NS',      googleFinancePath: 'FINEORG:NSE' },
  '533282':   { yahooSymbol: '533282.NS',      googleFinancePath: 'GRAVITA:NSE' },
  '540719':   { yahooSymbol: '540719.NS',      googleFinancePath: 'SBILIFE:NSE' },
};

export const getYahooSymbol = (nseCode: string): string | null => {
  return tickerMap[nseCode]?.yahooSymbol ?? null;
};

export const getGoogleFinancePath = (nseCode: string): string | null => {
  return tickerMap[nseCode]?.googleFinancePath ?? null;
};

export const getAllYahooSymbols = (): string[] => {
  return Object.values(tickerMap).map((m) => m.yahooSymbol);
};

export const getNseCodeByYahooSymbol = (yahooSymbol: string): string | null => {
  const entry = Object.entries(tickerMap).find(([, m]) => m.yahooSymbol === yahooSymbol);
  return entry ? entry[0] : null;
};
