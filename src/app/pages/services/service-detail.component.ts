import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServicesService } from '../../core/services/service.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';
import { CATEGORIES } from '../../core/models/service.model';
import { buildWhatsAppLink } from '../../core/utils/whatsapp.util';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule, MatChipsModule,
    MatTooltipModule, MatSnackBarModule
  ],
  template: `
    @if (service(); as s) {
      <article class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section class="md:col-span-2">
          <div class="aspect-[4/3] bg-cream-200 rounded-2xl overflow-hidden mb-3 shadow-soft">
            <img [src]="activePhoto() || s.photos[0] || 'https://placehold.co/800x600/f5e3df/874539?text=Pipin'"
                 class="w-full h-full object-cover">
          </div>
          @if (s.photos.length > 1) {
            <div class="flex gap-2 overflow-x-auto pb-2">
              @for (p of s.photos; track p) {
                <button (click)="activePhoto.set(p)"
                        class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 transition"
                        [class.ring-rose-500]="(activePhoto() || s.photos[0]) === p"
                        [class.ring-transparent]="(activePhoto() || s.photos[0]) !== p">
                  <img [src]="p" class="w-full h-full object-cover">
                </button>
              }
            </div>
          }

          <div class="mt-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              <span class="text-xs uppercase tracking-wider bg-rose-100 text-rose-700 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <mat-icon class="!text-base !w-4 !h-4">{{ categoryIcon(s.category) }}</mat-icon>
                {{ categoryLabel(s.category) }}
              </span>
              @if (s.city) {
                <span class="text-xs text-ink-400 inline-flex items-center gap-1">
                  <mat-icon class="!text-base !w-4 !h-4">place</mat-icon>{{ s.city }}
                </span>
              }
              @if (s.durationMinutes) {
                <span class="text-xs text-ink-400 inline-flex items-center gap-1">
                  <mat-icon class="!text-base !w-4 !h-4">schedule</mat-icon>{{ s.durationMinutes }} min
                </span>
              }
            </div>
            <div class="flex items-start justify-between gap-3">
              <h1 class="font-serif text-4xl md:text-5xl text-ink-800 leading-tight">{{ s.title }}</h1>
              <button (click)="toggleFav(s.id!)"
                      class="flex-shrink-0 w-11 h-11 rounded-full bg-cream-100 hover:bg-rose-100 transition flex items-center justify-center"
                      [matTooltip]="isFav(s.id!) ? 'Quitar de favoritos' : 'Guardar en favoritos'">
                <mat-icon [class.text-rose-600]="isFav(s.id!)" [class.text-ink-400]="!isFav(s.id!)">
                  {{ isFav(s.id!) ? 'favorite' : 'favorite_border' }}
                </mat-icon>
              </button>
            </div>
            <div class="h-px w-16 bg-rose-300 my-5"></div>
            <p class="text-ink-600 whitespace-pre-line leading-relaxed text-[15px]">{{ s.description }}</p>
          </div>
        </section>

        <aside class="md:col-span-1">
          <div class="bg-cream-50 rounded-2xl shadow-soft p-6 sticky top-20 border border-cream-300/40">
            <p class="text-xs uppercase tracking-wider text-sage-600 mb-1">Tarifa</p>
            <div class="font-serif text-4xl text-clay-600">
              {{ s.price | number }}
              <span class="text-base text-ink-400 align-baseline">{{ s.currency }}</span>
            </div>

            <a mat-flat-button
               class="!bg-[#25D366] !text-white w-full !mt-5 !py-1"
               [href]="waLink()"
               target="_blank" rel="noopener">
              <mat-icon>chat</mat-icon> Contactar por WhatsApp
            </a>

            <p class="text-[11px] text-ink-400 text-center mt-2">
              Te llevará a una conversación directa con quien ofrece el servicio.
            </p>

            <a [routerLink]="['/u', s.ownerUid]"
               class="flex items-center gap-3 mt-6 pt-5 border-t border-cream-300/60 group hover:bg-cream-100/40 -mx-2 px-2 py-2 rounded-lg transition">
              <img
                [src]="s.ownerAvatar || 'https://api.dicebear.com/9.x/initials/svg?seed=' + (s.ownerName || 'P') + '&backgroundColor=ecc7c0'"
                referrerpolicy="no-referrer"
                (error)="onAvatarError($event, s.ownerName)"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-rose-200">
              <div class="flex-1 min-w-0">
                <p class="font-serif text-lg text-ink-800 leading-tight inline-flex items-center gap-1 group-hover:text-rose-700 transition">
                  {{ s.ownerName || 'Anónimo' }}
                  @if (s.ownerVerified) {
                    <mat-icon class="!text-base !w-5 !h-5 text-sage-600" matTooltip="Perfil verificado">verified</mat-icon>
                  }
                </p>
                <p class="text-[11px] text-ink-400 uppercase tracking-wider">Ver perfil completo</p>
              </div>
              <mat-icon class="!text-base !w-5 !h-5 text-ink-300 group-hover:text-rose-600 transition">chevron_right</mat-icon>
            </a>
          </div>
        </aside>
      </article>
    } @else {
      <p class="text-center text-ink-400 py-16">Cargando...</p>
    }
  `
})
export class ServiceDetailComponent {
  private svc = inject(ServicesService);
  private favorites = inject(FavoritesService);
  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);

  id = input.required<string>();
  activePhoto = signal<string | null>(null);

  isFav(id: string) { return this.favorites.has(id); }

  async toggleFav(id: string) {
    if (!this.auth.user()) {
      this.snack.open('Inicia sesión para guardar favoritos', 'OK', { duration: 2500 });
      return;
    }
    try {
      const added = await this.favorites.toggle(id);
      this.snack.open(added ? 'Guardado en favoritos' : 'Quitado de favoritos', 'OK', { duration: 1800 });
    } catch (err: any) {
      this.snack.open(err.message || 'Error', 'OK', { duration: 2500 });
    }
  }

  service = toSignal(
    toObservable(this.id).pipe(switchMap(id => this.svc.get(id))),
    { initialValue: undefined }
  );

  waLink = computed(() => {
    const s = this.service();
    if (!s) return '#';
    return buildWhatsAppLink(
      s.whatsapp,
      s.whatsappMessage || `Hola, vi tu servicio "${s.title}" en Pipin y me interesa.`
    );
  });

  categoryLabel(v: string) {
    return CATEGORIES.find(c => c.value === v)?.label ?? v;
  }
  categoryIcon(v: string) {
    return CATEGORIES.find(c => c.value === v)?.icon ?? 'circle';
  }
  onAvatarError(e: Event, name?: string) {
    const seed = encodeURIComponent(name || 'P');
    (e.target as HTMLImageElement).src =
      `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=ecc7c0`;
  }
}
