const registry = new Map();
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const base = ['#041627', '#3b6934', '#7c3aed', '#ba1a1a', '#2563eb', '#d97706'];
export function destroyChart(id) { if (registry.has(id)) { registry.get(id).destroy(); registry.delete(id); } }
function mount(id, config) { destroyChart(id); const el = document.getElementById(id); if (!el || !window.Chart) return null; const chart = new Chart(el, config); registry.set(id, chart); return chart; }
export function donutAccounts(id, accounts, onClick) {
  const data = accounts.map(account => account.positions.reduce((sum, p) => sum + p.qty * p.currentPrice, 0));
  return mount(id, { type: 'doughnut', data: { labels: accounts.map(a => a.name), datasets: [{ data, backgroundColor: accounts.map((a, i) => a.color || base[i]), borderWidth: 0 }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } }, onClick: (_, items) => { if (items.length && onClick) onClick(accounts[items[0].index]); } } });
}
export function allocationBars(id, labels, current, target, totalValue) {
  return mount(id, { type: 'bar', data: { labels, datasets: [{ label: 'Actuel', data: current, backgroundColor: '#041627' }, { label: 'Cible', data: target, backgroundColor: '#3b6934' }] }, options: { indexAxis: 'y', scales: { x: { max: 100, ticks: { callback: v => `${v}%` } } }, plugins: { tooltip: { callbacks: { afterLabel: context => { const delta = current[context.dataIndex] - target[context.dataIndex]; const amount = Math.abs(delta) / 100 * totalValue; return delta > 0 ? `Réduire de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}` : `Renforcer de ${amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}`; } } } } } });
}
export function projectionLine(id, labels, median, optimistic, pessimistic) {
  return mount(id, { type: 'line', data: { labels, datasets: [{ label: 'Médiane', data: median, borderColor: '#041627', tension: .35 }, { label: 'Optimiste', data: optimistic, borderColor: '#3b6934', borderDash: [6, 4], tension: .35 }, { label: 'Pessimiste', data: pessimistic, borderColor: '#ba1a1a', borderDash: [6, 4], tension: .35 }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => `${Math.round(v / 1000)}k€` } } } } });
}
export function depositsBar(id, labels, deposits, ceiling) {
  return mount(id, { type: 'bar', data: { labels, datasets: [{ label: 'Versements cumulés', data: deposits, backgroundColor: '#3b6934' }, { label: 'Plafond PEA', data: labels.map(() => ceiling), type: 'line', borderColor: '#ba1a1a', pointRadius: 0 }] }, options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => `${Math.round(v / 1000)}k€` } } } } });
}
export function sparkline(id, values) { return mount(id, { type: 'line', data: { labels: values.map((_, i) => i + 1), datasets: [{ data: values, borderColor: css('--secondary') || '#3b6934', pointRadius: 0, fill: false, tension: .3 }] }, options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } } }); }
