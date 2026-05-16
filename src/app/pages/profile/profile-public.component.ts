import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { ProfileService } from '../../core/services/profile.service';
import { ServicesService } from '../../core/services/service.service';
import { CATEGORIES } from '../../core/models/service.model';
import { buildWhatsAppLink } from '../../core/utils/whatsapp.util';

@Component({
  selector: 'app-profile-public',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatButtonModule, MatIconModule,
    MatTooltipModule, MatChipsModule
  ],
  template: `
    @if (profile(); as p) {
      <article class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- ──────── Columna principal: galería + bio ──────── -->
        <section class="md:col-span-2">
          <!-- Hero photo -->
          <div class="aspect-[4/3] bg-cream-200 rounded-2xl overflow-hidden mb-3 shadow-soft">
            <img [src]="heroPhoto() || avatarFallback(p.displayName)"
                 referrerpolicy="no-referrer"
                 (error)="onImgError($event, p.displayName)"
                 class="w-full h-full object-cover">
          </div>

          @if (gallery().length > 1) {
            <div class="flex gap-2 overflow-x-auto pb-2">
              @for (url of gallery(); track url) {
                <button (click)="activePhoto.set(url)"
                        class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 transition"
                        [class.ring-rose-500]="(activePhoto() || gallery()[0]) === url"
                        [class.ring-transparent]="(activePhoto() || gallery()[0]) !== url">
                  <img [src]="url" referrerpolicy="no-referrer" class="w-full h-full object-cover">
                </button>
              }
            </div>
          }

          <div class="mt-6">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
              @if (p.city) {
                <span class="text-xs text-ink-400 inline-flex items-center gap-1">
                  <mat-icon class="!text-base !w-4 !h-4">place</mat-icon>{{ p.city }}
                </span>
              }
              @if (p.age) {
                <span class="text-xs text-ink-400 inline-flex items-center gap-1">
                  <mat-icon class="!text-base !w-4 !h-4">cake</mat-icon>{{ p.age }} años
                </span>
              }
              @if (memberSince()) {
                <span class="text-xs text-ink-400 inline-flex items-center gap-1">
                  <mat-icon class="!text-base !w-4 !h-4">verified_user</mat-icon>Miembro desde {{ memberSince() }}
                </span>
              }
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="font-serif text-4xl md:text-5xl text-ink-800 leading-tight">
                {{ p.displayName }}
              </h1>
              @if (p.isVerified) {
                <mat-icon class="!text-2xl !w-7 !h-7 text-sage-600" matTooltip="Perfil verificado">verified</mat-icon>
              }
              @if (p.isPremium) {
                <span class="text-[10px] uppercase tracking-wider bg-clay-500 text-white px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                  <mat-icon class="!text-sm !w-3.5 !h-3.5">star</mat-icon> Premium
                </span>
              }
            </div>

            <div class="h-px w-16 bg-rose-300 my-5"></div>

            @if (p.bio) {
              <p class="text-ink-600 whitespace-pre-line leading-relaxed text-[15px]">{{ p.bio }}</p>
            } @else {
              <p class="text-ink-400 italic text-sm">Este perfil aún no tiene una descripción.</p>
            }
          </div>

          <!-- ──────── Servicios del owner ──────── -->
          <div class="mt-10">
            <h2 class="font-serif text-2xl text-ink-800 mb-1">Servicios publicados</h2>
            <p class="text-sm text-ink-400 mb-4">Lo que {{ p.displayName }} ofrece a través de Pipin</p>

            @if (services(); as ss) {
              @if (ss.length === 0) {
                <p class="text-ink-400 italic text-sm">Aún no hay servicios publicados.</p>
              } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (s of ss; track s.id) {
                    <a [routerLink]="['/s', s.id]"
                       class="group block bg-cream-50 border border-cream-300/60 rounded-2xl overflow-hidden shadow-soft hover:shadow-warm transition">
                      <div class="aspect-[4/3] bg-cream-200 overflow-hidden">
                        <img [src]="s.photos?.[0] || 'https://placehold.co/600x450/f5e3df/874539?text=Pipin'"
                             referrerpolicy="no-referrer"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                      </div>
                      <div class="p-4">
                        <span class="text-[10px] uppercase tracking-wider text-rose-700 inline-flex items-center gap-1">
                          <mat-icon class="!text-sm !w-3.5 !h-3.5">{{ categoryIcon(s.category) }}</mat-icon>
                          {{ categoryLabel(s.category) }}
                        </span>
                        <h3 class="font-serif text-lg text-ink-800 leading-tight line-clamp-2 mt-1 group-hover:text-rose-700 transition">
                          {{ s.title }}
                        </h3>
                        <p class="font-medium text-clay-600 mt-2">
                          {{ s.price | number }} <span class="text-xs text-ink-400">{{ s.currency }}</span>
                        </p>
                      </div>
                    </a>
                  }
                </div>
              }
            } @else {
              <p class="text-ink-400 text-sm">Cargando servicios...</p>
            }
          </div>
        </section>

        <!-- ──────── Sidebar: tarjeta de contacto ──────── -->
        <aside class="md:col-span-1">
          <div class="bg-cream-50 rounded-2xl shadow-soft p-6 sticky top-20 border border-cream-300/40">
            <div class="flex flex-col items-center text-center">
              <img
                [src]="p.avatarUrl || avatarFallback(p.displayName)"
                referrerpolicy="no-referrer"
                (error)="onImgError($event, p.displayName)"
                class="w-24 h-24 rounded-full object-cover ring-2 ring-rose-200 shadow-soft">
              <p class="font-serif text-xl text-ink-800 mt-3 inline-flex items-center gap-1">
                {{ p.displayName }}
                @if (p.isVerified) {
                  <mat-icon class="!text-base !w-5 !h-5 text-sage-600" matTooltip="Perfil verificado">verified</mat-icon>
                }
              </p>
              <p class="text-[11px] text-ink-400 uppercase tracking-wider">
                {{ servicesCount() }} servicio(s) publicado(s)
              </p>
            </div>

            @if (p.whatsapp) {
              <a mat-flat-button
                 class="!bg-[#25D366] !text-white w-full !mt-5 !py-1"
                 [href]="waLink()"
                 target="_blank" rel="noopener">
                <mat-icon>chat</mat-icon> Contactar por WhatsApp
              </a>
              <p class="text-[11px] text-ink-400 text-center mt-2">
                Te llevará a una conversación directa.
              </p>
            } @else {
              <p class="text-[12px] text-ink-400 text-center mt-5 italic">
                Este perfil no tiene un WhatsApp público. Contáctalo desde alguno de sus servicios.
              </p>
            }
          </div>
        </aside>
      </article>
    } @else if (notFound()) {
      <div class="max-w-md mx-auto px-4 py-20 text-center">
        <mat-icon class="!text-5xl !w-12 !h-12 text-ink-300">person_off</mat-icon>
        <h1 class="font-serif text-2xl text-ink-800 mt-3">Perfil no encontrado</h1>
        <p class="text-sm text-ink-400 mt-2">No pudimos encontrar este perfil. Puede que haya sido eliminado o aún no exista.</p>
        <a mat-stroked-button routerLink="/" class="!mt-5">Volver al inicio</a>
      </div>
    } @else {
      <p class="text-center text-ink-400 py-16">Cargando...</p>
    }
  `
})
export class ProfilePublicComponent {
  private profiles = inject(ProfileService);
  private servicesSvc = inject(ServicesService);

  uid = input.required<string>();
  activePhoto = signal<string | null>(null);

  profile = toSignal(
    toObservable(this.uid).pipe(switchMap(uid => this.profiles.get(uid))),
    { initialValue: undefined }
  );

  services = toSignal(
    toObservable(this.uid).pipe(switchMap(uid => this.servicesSvc.listByOwner(uid))),
    { initialValue: undefined }
  );

  // Mostrar "no encontrado" sólo después de que la query haya emitido al menos una vez.
  loaded = signal(false);
  notFound = computed(() => {
    // profile() es undefined mientras carga o cuando no existe.
    // Para distinguir, usamos un flag que se enciende al primer emit.
    return this.loaded() && !this.profile();
  });

  constructor() {
    // Marcar como "loaded" cuando llega cualquier emit (incluido undefined si no existe el doc).
    toObservable(this.uid).pipe(switchMap(uid => this.profiles.get(uid)))
      .subscribe(() => this.loaded.set(true));
  }

  /** Galería visible: photos[] del profile, capada a 4. */
  gallery = computed(() => (this.profile()?.photos ?? []).slice(0, 4));

  heroPhoto = computed(() => {
    const g = this.gallery();
    if (g.length > 0) return this.activePhoto() || g[0];
    return this.profile()?.avatarUrl ?? null;
  });

  servicesCount = computed(() => {
    const ss = this.services();
    if (!ss) return 0;
    return ss.filter(s => s.published).length;
  });

  memberSince = computed(() => {
    const ts: any = this.profile()?.createdAt;
    if (!ts?.toDate) return null;
    const d: Date = ts.toDate();
    return d.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  });

  waLink = computed(() => {
    const p = this.profile();
    if (!p?.whatsapp) return '#';
    return buildWhatsAppLink(p.whatsapp, `Hola ${p.displayName}, te escribo desde Pipin.`);
  });

  avatarFallback(name?: string): string {
    const seed = encodeURIComponent(name || 'P');
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=ecc7c0`;
  }

  onImgError(e: Event, name?: string) {
    (e.target as HTMLImageElement).src = this.avatarFallback(name);
  }

  categoryLabel(v: string) {
    return CATEGORIES.find(c => c.value === v)?.label ?? v;
  }
  categoryIcon(v: string) {
    return CATEGORIES.find(c => c.value === v)?.icon ?? 'circle';
  }
}
