import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-16 border-t border-cream-300/60 bg-cream-50/50">
      <div class="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <p class="font-serif text-2xl text-rose-700">Pipin</p>
          <p class="text-ink-400 mt-1 italic">encuentros con calma</p>
        </div>
        <div class="text-ink-400">
          <p class="text-ink-700 font-medium mb-2">Sobre el espacio</p>
          <p>Un lugar para conectar con quien escucha. Conversaciones, terapia, cuidado del cuerpo y compañía consciente.</p>
        </div>
        <div class="text-ink-400 md:text-right">
          <p>© {{ year }} · Hecho con cuidado.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
