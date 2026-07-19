// Minimal inline icon set — no external font/icon CDN needed, works fully offline.
const ICONS = {
  flame: '<path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.5-2-1-3 1 4-1 6-3 6s-3-2-3-4c0-2 1-3 1-6z"/><path d="M8 14a4 4 0 0 0 8 0c0-3-2-4-2-7"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 16h13a3 3 0 1 1-3 3"/><path d="M3 12h16a2.5 2.5 0 1 0-2.5-2.5"/>',
  activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  brain: '<path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/>',
  car: '<path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM3 17V11l2-5h14l2 5v6"/>',
  flask: '<path d="M9 2v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-11V2"/><path d="M8 2h8"/>',
  droplet: '<path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/>',
  heart: '<path d="M12 21s-8-5-10-10a5 5 0 0 1 10-3 5 5 0 0 1 10 3c-2 5-10 10-10 10z"/>',
  waves: '<path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"/><path d="M2 18c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10.1a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.6 2z"/>',
  hospital: '<path d="M12 6v8M8 10h8M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18"/><path d="M2 22h20"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10a7 7 0 0 1-14 0M12 19v3"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
};

function icon(name, cls = "") {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}
