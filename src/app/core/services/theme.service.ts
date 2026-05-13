import { effect, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'pipin.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Modo actual. Inicializa desde localStorage o preferencia del SO.
  readonly mode = signal<ThemeMode>(this.detectInitial());

  constructor() {
    // Cada vez que cambia el modo, sincroniza <html class="dark"> y localStorage.
    effect(() => {
      const m = this.mode();
      const html = document.documentElement;
      if (m === 'dark') html.classList.add('dark');
      else html.classList.remove('dark');
      try {
        localStorage.setItem(STORAGE_KEY, m);
      } catch {}
    });
  }

  toggle() {
    this.mode.update(m => (m === 'dark' ? 'light' : 'dark'));
  }

  set(mode: ThemeMode) {
    this.mode.set(mode);
  }

  private detectInitial(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
