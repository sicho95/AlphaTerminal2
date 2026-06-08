import { addAlert, markAlertsRead, state, money } from './store.js';
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
}
export function notify(alert) {
  const saved = addAlert(alert);
  if ('Notification' in window && Notification.permission === 'granted') new Notification(alert.title, { body: alert.message, icon: './icons/icon-192.png', tag: saved.id });
  return saved;
}
export function evaluateAlerts(portfolios, technicalSignals = []) {
  const emitted = [];
  portfolios.forEach(account => {
    if (account.type === 'PEA' && (account.versements || 0) > 140000) emitted.push(notify({ type: 'warning', title: 'Plafond PEA proche', message: `${account.name} atteint ${money(account.versements)} de versements.` }));
    account.positions.forEach(position => {
      const distance = (position.currentPrice - position.stopLevel) / position.currentPrice * 100;
      if (position.currentPrice < position.stopLevel) emitted.push(notify({ type: 'error', title: `Stop déclenché — ${position.ticker}`, message: `${position.name} cote sous le stop ${money(position.stopLevel)}.` }));
      else if (distance < 3) emitted.push(notify({ type: 'error', title: `Stop proche — ${position.ticker}`, message: `Distance au stop: ${distance.toFixed(1)}%.` }));
      const perf = (position.currentPrice - position.pru) / position.pru * 100;
      if (perf > 12) emitted.push(notify({ type: 'success', title: `Objectif annuel atteint — ${position.ticker}`, message: `Performance latente de ${perf.toFixed(1)}%.` }));
    });
  });
  technicalSignals.filter(s => s.rsi < 25 || s.rsi > 75).forEach(signal => emitted.push(notify({ type: 'warning', title: `RSI extrême — ${signal.ticker}`, message: `RSI(14) à ${signal.rsi.toFixed(1)}: ${signal.rsiLabel}.` })));
  return emitted;
}
export function renderNotificationPanel() {
  const list = document.getElementById('notification-list');
  const badge = document.getElementById('alert-badge');
  if (!list || !badge) return;
  const unread = state.alerts.filter(a => !a.read).length;
  badge.textContent = unread;
  badge.classList.toggle('hidden', unread === 0);
  list.innerHTML = state.alerts.length ? state.alerts.map(alert => `<article class="rounded-xl border border-outline-variant p-3 dark:border-slate-700"><div class="flex items-start gap-3"><span class="material-symbols-outlined ${alert.type === 'error' ? 'text-error' : alert.type === 'success' ? 'text-secondary' : 'text-amber-600'}">${alert.type === 'error' ? 'warning' : 'notifications'}</span><div><h3 class="font-bold">${alert.title}</h3><p class="body-sm text-muted dark:text-slate-300">${alert.message}</p><time class="label-caps text-muted">${new Date(alert.timestamp).toLocaleString('fr-FR')}</time></div></div></article>`).join('') : '<p class="body-sm text-muted">Aucune alerte active.</p>';
}
export function openNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  panel.classList.remove('hidden'); requestAnimationFrame(() => panel.classList.remove('translate-x-full')); markAlertsRead(); renderNotificationPanel();
}
export function closeNotificationPanel() { const panel = document.getElementById('notification-panel'); panel.classList.add('translate-x-full'); setTimeout(() => panel.classList.add('hidden'), 180); }
