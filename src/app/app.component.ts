import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="min-h-[calc(100vh-3.5rem)]">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent {}
