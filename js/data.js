import { getPortfolios, savePortfolios, totals } from './store.js';
export const DEMO_PORTFOLIOS = [
  { id: 'jean-pea', name: 'Jean — PEA', type: 'PEA', owner: 'Jean', versements: 85000, color: '#3b6934', deposits: [
    { date: '2025-01-05', amount: 5000 }, { date: '2025-04-05', amount: 4000 }, { date: '2025-09-05', amount: 3500 }, { date: '2026-01-05', amount: 5000 }, { date: '2026-05-05', amount: 3000 }
  ], positions: [
    { ticker: 'DCAM', isin: 'FR0010655688', name: 'Amundi MSCI World', assetClass: 'Actions', sector: 'World', qty: 320, pru: 105.20, currentPrice: 145.30, stopLevel: 125.0 },
    { ticker: 'PUST', isin: 'LU1681049109', name: 'Amundi Nasdaq-100', assetClass: 'Actions', sector: 'Tech', qty: 85, pru: 210.0, currentPrice: 258.40, stopLevel: 230.0 },
    { ticker: 'ETZ', isin: 'FR0010296061', name: 'BNP Paribas Easy Stoxx Eur 600', assetClass: 'Actions', sector: 'Europe', qty: 200, pru: 88.5, currentPrice: 96.1, stopLevel: 85.0 },
    { ticker: 'MMS', isin: 'FR0010149120', name: 'Lyxor MSCI World', assetClass: 'Actions', sector: 'World', qty: 110, pru: 195.0, currentPrice: 218.0, stopLevel: 190.0 },
    { ticker: 'PAEEM', isin: 'LU1681045370', name: 'Amundi MSCI Em Markets', assetClass: 'Actions', sector: 'Emerging', qty: 150, pru: 62.0, currentPrice: 68.5, stopLevel: 58.0 },
    { ticker: 'EXX1', isin: 'DE0005933931', name: 'iShares Core DAX', assetClass: 'Actions', sector: 'Europe', qty: 45, pru: 136.0, currentPrice: 152.0, stopLevel: 130.0 }
  ]},
  { id: 'jean-cto', name: 'Jean — CTO', type: 'CTO', owner: 'Jean', versements: 0, color: '#041627', deposits: [{ date: '2025-02-10', amount: 3000 }, { date: '2025-11-10', amount: 2000 }, { date: '2026-03-10', amount: 2500 }], positions: [
    { ticker: 'AAPL', isin: 'US0378331005', name: 'Apple Inc.', assetClass: 'Actions', sector: 'Tech', qty: 35, pru: 165.0, currentPrice: 189.5, stopLevel: 170.0 },
    { ticker: 'TSLA', isin: 'US88160R1014', name: 'Tesla Inc.', assetClass: 'Actions', sector: 'Auto', qty: 12, pru: 210.0, currentPrice: 168.0, stopLevel: 155.0 },
    { ticker: 'ENGI', isin: 'FR0010208488', name: 'Engie SA', assetClass: 'Actions', sector: 'Energy', qty: 200, pru: 14.5, currentPrice: 16.2, stopLevel: 13.8 }
  ]},
  { id: 'marie-cto', name: 'Marie — CTO', type: 'CTO', owner: 'Marie', versements: 0, color: '#7c3aed', deposits: [{ date: '2025-06-15', amount: 2500 }, { date: '2026-02-15', amount: 3000 }], positions: [
    { ticker: 'AIR', isin: 'NL0000235190', name: 'Airbus SE', assetClass: 'Actions', sector: 'Industry', qty: 30, pru: 126.0, currentPrice: 154.2, stopLevel: 141.0 },
    { ticker: 'OR', isin: 'FR0000120321', name: "L'Oréal", assetClass: 'Actions', sector: 'Consumer', qty: 14, pru: 382.0, currentPrice: 418.0, stopLevel: 390.0 },
    { ticker: 'CASH', isin: 'FR0000000000', name: 'Fonds monétaire EUR', assetClass: 'Liquidités', sector: 'Cash', qty: 1, pru: 7200, currentPrice: 7200, stopLevel: 7000 }
  ]}
];
export const INVESTOR_PROFILES = {
  prudent: { label: 'Prudent', objective: '3-5%/an', horizon: '< 3 ans', rate: 0.04, target: { Actions: 30, Obligations: 50, Liquidités: 20, Crypto: 0 }, etf: 'CW8 / fonds obligataire court terme' },
  equilibre: { label: 'Équilibré', objective: '5-8%/an', horizon: '3-7 ans', rate: 0.065, target: { Actions: 50, Obligations: 35, Liquidités: 15, Crypto: 0 }, etf: 'ETF MSCI World + obligations EUR' },
  dynamique: { label: 'Dynamique', objective: '8-12%/an', horizon: '5-10 ans', rate: 0.10, target: { Actions: 70, Obligations: 15, Liquidités: 15, Crypto: 0 }, etf: 'DCAM / PUST via PEA' },
  offensif: { label: 'Offensif', objective: '12-20%/an', horizon: '> 7 ans', rate: 0.15, target: { Actions: 90, Obligations: 0, Liquidités: 10, Crypto: 0 }, etf: 'Nasdaq-100 + MSCI World' },
  dca: { label: 'DCA Automatique', objective: 'cumulatif configurable', horizon: 'régulier', rate: 0.08, target: { Actions: 75, Obligations: 10, Liquidités: 15, Crypto: 0 }, etf: 'Plan DCA MSCI World' }
};
export const MACRO_EVENTS = [
  { title: 'Taux Fed/BCE', sentiment: 'Neutre', summary: 'Les banques centrales maintiennent un biais restrictif mais la volatilité des taux baisse.', tags: ['Finance', 'Obligations', 'World'], impact: { World: 1, Tech: -1 } },
  { title: 'Énergie', sentiment: 'Positif', summary: 'Prix du gaz normalisés en Europe, soutien aux marges industrielles et utilities.', tags: ['Energy', 'Europe'], impact: { Energy: 2, Europe: 1 } },
  { title: 'Géopolitique', sentiment: 'Négatif', summary: 'Tensions commerciales persistantes sur semi-conducteurs et chaînes logistiques.', tags: ['Tech', 'Emerging'], impact: { Tech: -2, Emerging: -1 } },
  { title: 'Devise EUR/USD', sentiment: 'Neutre', summary: 'Euro stable contre dollar, impact limité sur ETF monde non couverts.', tags: ['World', 'Devise'], impact: { World: 0 } }
];
const proxy = 'https://api.allorigins.win/raw?url=';
const yahooUrl = ticker => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1y&interval=1d`;
export async function fetchYahooChart(ticker) {
  const response = await fetch(proxy + encodeURIComponent(yahooUrl(ticker)));
  if (!response.ok) throw new Error(`Cours indisponible pour ${ticker}`);
  const json = await response.json();
  const result = json.chart?.result?.[0];
  if (!result) throw new Error(`Réponse Yahoo invalide pour ${ticker}`);
  return { closes: result.indicators.quote[0].close.filter(Number.isFinite), highs: result.indicators.quote[0].high.filter(Number.isFinite), lows: result.indicators.quote[0].low.filter(Number.isFinite), price: result.meta.regularMarketPrice || result.meta.previousClose };
}
export async function refreshQuotes(onProgress = () => {}) {
  const portfolios = getPortfolios();
  const next = [];
  for (const account of portfolios) {
    const positions = [];
    for (const position of account.positions) {
      try {
        const chart = await fetchYahooChart(position.ticker);
        positions.push({ ...position, currentPrice: Number(chart.price.toFixed(2)), history: chart, lastUpdate: new Date().toISOString() });
        onProgress(position.ticker, true);
      } catch {
        positions.push({ ...position, lastUpdate: new Date().toISOString() });
        onProgress(position.ticker, false);
      }
    }
    next.push({ ...account, positions });
  }
  savePortfolios(next);
  return totals(next);
}
