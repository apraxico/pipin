import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, combineLatest, map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FavoritesService } from '../../core/services/favorites.service';
import { ServicesService } from '../../core/services/service.service';
import { ServiceItem, CATEGORIES } from '../../core/models/service.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatButtonModule, MatIconModule, MatTooltipModule, MatSnackBarModule
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <div class="mb-8">
        <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Tu colección</p>
        <h1 class="font-serif text-4xl text-ink-800 mt-1">Favoritos</h1>
        <p class="text-ink-400 mt-1">Los servicios que has guardado para volver a mirarlos.</p>
      </div>

      @if (favoriteServices(); as list) {
        @if (list.length === 0) {
          <div class="bg-cream-50 rounded-2xl border-2 border-dashed border-cream-300 p-16 text-center">
            <mat-icon class="!text-6xl !w-16 !h-16 text-rose-200">favorite_border</mat-icon>
            <p class="font-serif text-2xl text-ink-700 mt-4">Aún no guardas favoritos.</p>
            <p class="text-sm text-ink-400 mt-1 mb-5">Cuando veas un servicio que te guste, toca el corazón para guardarlo aquí.</p>
            <a mat-flat-button color="primary" routerLink="/">
              <mat-icon>search</mat-icon> Explorar servicios
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (s of list; track s.id) {
              <div class="relative group">
                <a [routerLink]="['/s', s.id]"
                   class="block bg-cream-50 rounded-2xl shadow-soft hover:shadow-warm hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-cream-300/40">
                  <div class="aspect-[4/5] bg-cream-200 relative overflow-hidden">
                    <img [src]="s.photos[0] || 'https://placehold.co/400x500/f5e3df/874539?text=Pipin'"
                         referrerpolicy="no-referrer"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-ink-800/40 via-transparent to-transparent"></div>
                    <span class="absolute top-3 left-3 bg-cream-50/95 text-rose-700 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                      {{ categoryLabel(s.category) }}
                    </span>
                  </div>
                  <div class="p-5">
                    <h3 class="font-serif text-xl text-ink-800 leading-tight line-clamp-2">{{ s.title }}</h3>
                    <p class="text-sm text-ink-400 line-clamp-2 mt-2">{{ s.description }}</p>
                    <div class="flex items-center justify-between mt-4 pt-3 border-t border-cream-300/60">
                      <span class="text-xs text-ink-400 inline-flex items-center gap-1">
                        {{ s.ownerName || 'Anónimo' }}
                        @if (s.ownerVerified) {
                          <mat-icon class="!text-sm !w-4 !h-4 text-sage-600">verified</mat-icon>
                        }
                      </span>
                      <span class="font-medium text-clay-600">
                        {{ s.price | number }} <span class="text-xs text-ink-400">{{ s.currency }}</span>
                      </span>
                    </div>
                  </div>
                </a>
                <button (click)="remove(s.id!)"
                        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-cream-50/95 flex items-center justify-center shadow-soft hover:scale-110 transition"
                        matTooltip="Quitar de favoritos">
                  <mat-icon class="!text-xl text-rose-600">favorite</mat-icon>
                </button>
              </div>
            }
          </div>
        }
      } @else {
        <p class="text-center text-ink-400 py-12">Cargando...</p>
      }
    </div>
  `
})
export class FavoritesComponent {
  private favorites = inject(FavoritesService);
  private services = inject(ServicesService);
  private snack = inject(MatSnackBar);

  // Resuelve los ids → ServiceItems de forma reactiva.
  favoriteServices = toSignal<ServiceItem[] | undefined>(
    toObservable(this.favorites.idSet).pipe(
      switchMap(set => {
        const arr = Array.from(set);
        if (arr.length === 0) return of([] as ServiceItem[]);
        return combineLatest(arr.map(id => this.services.get(id))).pipe(
          map(list => list.filter((s): s is ServiceItem => !!s))
        );
      })
    ),
    { initialValue: undefined }
  );

  categoryLabel(v: string) {
    return CATEGORIES.find(c => c.value === v)?.label ?? v;
  }

  async remove(id: string) {
    try {
      await this.favorites.toggle(id);
      this.snack.open('Quitado de favoritos', 'OK', { duration: 1800 });
    } catch (e: any) {
      this.snack.open(e.message || 'Error', 'OK', { duration: 2500 });
    }
  }
}
