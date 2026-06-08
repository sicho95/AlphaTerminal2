export const KEYS = {
  portfolios: 'alphaTerm_portfolios', alerts: 'alphaTerm_alerts', darkMode: 'alphaTerm_darkMode', selectedAccount: 'alphaTerm_selectedAccount', orderBasket: 'alphaTerm_orderBasket'
};
export const readJSON = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};
export const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const state = {
  selectedAccount: localStorage.getItem(KEYS.selectedAccount) || 'global',
  portfolios: [], alerts: [], listeners: new Set()
};
export function initStore(defaultPortfolios) {
  state.portfolios = readJSON(KEYS.portfolios, defaultPortfolios);
  state.alerts = readJSON(KEYS.alerts, []);
  writeJSON(KEYS.portfolios, state.portfolios);
  writeJSON(KEYS.alerts, state.alerts);
  return state;
}
export function subscribe(listener) { state.listeners.add(listener); return () => state.listeners.delete(listener); }
export function emit() { state.listeners.forEach(listener => listener(state)); }
export function setSelectedAccount(id) { state.selectedAccount = id; localStorage.setItem(KEYS.selectedAccount, id); emit(); }
export function getPortfolios() { return state.portfolios; }
export function savePortfolios(portfolios) { state.portfolios = portfolios; writeJSON(KEYS.portfolios, portfolios); emit(); }
export function getPortfolio(id) { return state.portfolios.find(portfolio => portfolio.id === id); }
export function getVisiblePortfolios() { return state.selectedAccount === 'global' ? state.portfolios : state.portfolios.filter(portfolio => portfolio.id === state.selectedAccount); }
export function flattenPositions(portfolios = getVisiblePortfolios()) {
  return portfolios.flatMap(portfolio => portfolio.positions.map(position => ({ ...position, accountId: portfolio.id, accountName: portfolio.name, accountType: portfolio.type, owner: portfolio.owner || portfolio.name.split(' ')[0], versements: portfolio.versements || 0 })));
}
export function totals(portfolios = getVisiblePortfolios()) {
  const positions = flattenPositions(portfolios);
  const invested = positions.reduce((sum, p) => sum + p.qty * p.pru, 0);
  const value = positions.reduce((sum, p) => sum + p.qty * p.currentPrice, 0);
  const gain = value - invested;
  return { positions, invested, value, gain, perf: invested ? gain / invested * 100 : 0, peaVersements: portfolios.filter(p => p.type === 'PEA').reduce((s, p) => s + (p.versements || 0), 0) };
}
export function updatePosition(accountId, ticker, patch) {
  savePortfolios(state.portfolios.map(account => account.id !== accountId ? account : { ...account, positions: account.positions.map(position => position.ticker === ticker ? { ...position, ...patch } : position) }));
}
export function addPosition(accountId, position) {
  savePortfolios(state.portfolios.map(account => account.id !== accountId ? account : { ...account, positions: [...account.positions, position] }));
}
export function addAlert(alert) {
  const item = { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, timestamp: new Date().toISOString(), read: false, ...alert };
  state.alerts = [item, ...state.alerts].slice(0, 50);
  writeJSON(KEYS.alerts, state.alerts);
  emit();
  return item;
}
export function markAlertsRead() { state.alerts = state.alerts.map(alert => ({ ...alert, read: true })); writeJSON(KEYS.alerts, state.alerts); emit(); }
export const money = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0);
export const pct = value => `${(value || 0).toLocaleString('fr-FR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`;
