import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServicesService } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { CATEGORIES, ServiceCategory } from '../../core/models/service.model';

interface CatBanner {
  value: ServiceCategory;
  label: string;
  icon: string;
  blurb: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, MatSnackBarModule
  ],
  template: `
    <!-- ═════════════════════════ HERO ═════════════════════════ -->
    <section class="relative hero-bg min-h-[78vh] flex items-center justify-center overflow-hidden">
      <!-- blobs decorativos -->
      <div class="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-rose-300/30 blur-3xl animate-float"></div>
      <div class="absolute -bottom-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-sage-300/30 blur-3xl animate-float slow"></div>
      <div class="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-clay-200/40 blur-2xl animate-float"></div>

      <div class="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p class="animate-fade-up text-sage-700 uppercase tracking-[0.3em] text-xs mb-5">
          — espacios con calma —
        </p>
        <h1 class="animate-fade-up delay-1 font-serif text-5xl md:text-7xl text-ink-800 leading-[1.05] font-medium">
          Un espacio para
          <span class="italic text-rose-600">encontrarte</span>.
        </h1>
        <p class="animate-fade-up delay-2 mt-8 text-ink-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          Conversaciones, terapia, masajes y compañía consciente.
          <span class="block mt-1 text-ink-400 italic">Contacto directo por WhatsApp.</span>
        </p>
        <!-- Notas: copy en 2da persona para mantener neutralidad de género. -->

        <div class="animate-fade-up delay-3 mt-10 flex gap-3 justify-center flex-wrap">
          <a mat-flat-button color="primary" [routerLink]="publishLink()" class="!px-7 !py-2 !text-base">
            <mat-icon>edit</mat-icon> {{ publishLabel() }}
          </a>
          <a class="inline-flex items-center gap-1 px-7 py-3 rounded-full text-sm font-medium border border-sage-400 text-sage-700 hover:bg-sage-50 transition"
             href="#explorar">
            <mat-icon class="!text-base !w-5 !h-5">south</mat-icon> Explorar
          </a>
        </div>

        <!-- mini badge de prueba social -->
        <div class="animate-fade-up delay-4 mt-12 inline-flex items-center gap-3 text-xs text-ink-400">
          <div class="flex -space-x-2">
            <img referrerpolicy="no-referrer" src="https://api.dicebear.com/9.x/initials/svg?seed=A&backgroundColor=ecc7c0" class="w-7 h-7 rounded-full ring-2 ring-cream-50">
            <img referrerpolicy="no-referrer" src="https://api.dicebear.com/9.x/initials/svg?seed=M&backgroundColor=c8d3bf" class="w-7 h-7 rounded-full ring-2 ring-cream-50">
            <img referrerpolicy="no-referrer" src="https://api.dicebear.com/9.x/initials/svg?seed=V&backgroundColor=f4dfd0" class="w-7 h-7 rounded-full ring-2 ring-cream-50">
          </div>
          <span>Más de 100 personas escuchando</span>
        </div>
      </div>
    </section>

    <!-- ═════════════════════════ CATEGORÍAS VISUALES ═════════════════════════ -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="text-center mb-10 animate-fade-up">
        <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Categorías</p>
        <h2 class="font-serif text-4xl text-ink-800 mt-2">¿Qué necesitas hoy?</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        @for (b of banners; track b.value; let i = $index) {
          <a (click)="selectCategory(b.value)"
             href="#explorar"
             class="group relative aspect-[5/6] rounded-2xl overflow-hidden cursor-pointer animate-fade-up shadow-soft"
             [class.delay-1]="i === 1"
             [class.delay-2]="i === 2"
             [class.delay-3]="i === 3"
             [class.delay-4]="i >= 4">
            <img
              [src]="b.image"
              [alt]="b.label"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent"></div>
            <div class="absolute inset-0 p-5 flex flex-col justify-end text-cream-50">
              <mat-icon class="!text-3xl !w-8 !h-8 mb-2 text-rose-200">{{ b.icon }}</mat-icon>
              <h3 class="font-serif text-2xl leading-tight">{{ b.label }}</h3>
              <p class="text-xs text-cream-200/90 mt-1 leading-snug">{{ b.blurb }}</p>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- ═════════════════════════ CTA BANNER ═════════════════════════ -->
    <section class="relative overflow-hidden mx-4 md:mx-8 rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-clay-500 my-12">
      <div class="absolute top-0 right-0 w-64 h-64 bg-rose-300/30 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-clay-300/40 rounded-full blur-3xl"></div>
      <div class="relative max-w-5xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-8 items-center">
        <div class="text-cream-50">
          <p class="text-xs uppercase tracking-[0.25em] text-rose-100">Para quien ofrece</p>
          <h3 class="font-serif text-4xl md:text-5xl leading-tight mt-2">
            Tu espacio, <span class="italic">a tu manera</span>.
          </h3>
          <p class="mt-4 text-rose-50/90 text-base leading-relaxed">
            Publica gratis. Sube tus fotos, escribe a tu ritmo y recibe contactos por WhatsApp.
            Tú decides cuándo aparecer y cuándo descansar.
          </p>
          <a [routerLink]="publishLink()"
             class="inline-flex items-center gap-1 mt-6 px-6 py-3 rounded-full bg-cream-50 text-rose-700 font-medium hover:bg-cream-100 transition">
            <mat-icon>arrow_forward</mat-icon> {{ ctaBannerLabel() }}
          </a>
        </div>
        <div class="hidden md:flex items-center justify-center">
          <div class="relative">
            <div class="absolute -top-4 -left-4 w-44 h-60 rounded-2xl overflow-hidden shadow-warm rotate-[-6deg] animate-float">
              <img referrerpolicy="no-referrer"
                   src="https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600&q=80"
                   class="w-full h-full object-cover">
            </div>
            <div class="w-56 h-72 rounded-2xl overflow-hidden shadow-warm rotate-[4deg] animate-float slow">
              <img referrerpolicy="no-referrer"
                   src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80"
                   class="w-full h-full object-cover">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═════════════════════════ LISTADO ═════════════════════════ -->
    <section id="explorar" class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-sage-600">Servicios disponibles</p>
          <h2 class="font-serif text-3xl text-ink-800 mt-1">Encuentra tu espacio</h2>
        </div>
        <span class="text-sm text-ink-400">{{ filtered()?.length ?? 0 }} publicaciones</span>
      </div>

      <div class="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border"
          [class.bg-ink-700]="!selected()"
          [class.text-cream-50]="!selected()"
          [class.border-ink-700]="!selected()"
          [class.bg-cream-50]="selected()"
          [class.text-ink-700]="selected()"
          [class.border-cream-300]="selected()"
          (click)="selected.set(null)">
          Todos
        </button>
        @for (c of categories; track c.value) {
          <button
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border inline-flex items-center gap-1.5"
            [class.bg-rose-600]="selected() === c.value"
            [class.text-white]="selected() === c.value"
            [class.border-rose-600]="selected() === c.value"
            [class.bg-cream-50]="selected() !== c.value"
            [class.text-ink-700]="selected() !== c.value"
            [class.border-cream-300]="selected() !== c.value"
            (click)="selected.set(c.value)">
            <mat-icon class="!text-base !w-4 !h-4">{{ c.icon }}</mat-icon> {{ c.label }}
          </button>
        }
      </div>

      @if (filtered(); as list) {
        @if (list.length === 0) {
          <div class="text-center text-ink-400 py-20 animate-fade-in">
            <mat-icon class="!text-5xl !w-12 !h-12 text-rose-200">spa</mat-icon>
            <p class="mt-3 font-serif text-2xl text-ink-700">Aún no hay publicaciones aquí.</p>
            <p class="text-sm mt-1">Sé el primero en compartir tu servicio.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (s of list; track s.id; let i = $index) {
              <div class="relative group animate-fade-up"
                   [class.delay-1]="i % 3 === 1"
                   [class.delay-2]="i % 3 === 2">
                <a [routerLink]="['/s', s.id]"
                   class="bg-cream-50 rounded-2xl shadow-soft hover:shadow-warm hover:-translate-y-1 transition-all duration-300 overflow-hidden block border border-cream-300/40">
                  <div class="aspect-[4/5] bg-cream-200 relative overflow-hidden">
                    <img
                      [src]="s.photos[0] || 'https://placehold.co/400x500/f5e3df/874539?text=Pipin'"
                      [alt]="s.title"
                      referrerpolicy="no-referrer"
                      (error)="onImgError($event)"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-ink-800/40 via-transparent to-transparent"></div>
                    <span class="absolute top-3 left-3 bg-cream-50/95 text-rose-700 text-[10px] uppercase tracking-wider font-medium px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <mat-icon class="!text-sm !w-3.5 !h-3.5">{{ categoryIcon(s.category) }}</mat-icon>
                      {{ categoryLabel(s.category) }}
                    </span>
                    @if (s.featured) {
                      <span class="absolute top-3 right-12 bg-clay-500 text-white text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        <mat-icon class="!text-sm !w-3.5 !h-3.5">star</mat-icon> Destacado
                      </span>
                    }
                    @if (s.city) {
                      <span class="absolute bottom-3 left-3 text-cream-50 text-xs inline-flex items-center gap-1 drop-shadow">
                        <mat-icon class="!text-base !w-4 !h-4">place</mat-icon>{{ s.city }}
                      </span>
                    }
                  </div>
                  <div class="p-5">
                    <h3 class="font-serif text-xl text-ink-800 leading-tight line-clamp-2 group-hover:text-rose-700 transition">
                      {{ s.title }}
                    </h3>
                    <p class="text-sm text-ink-400 line-clamp-2 mt-2">{{ s.description }}</p>
                    <div class="flex items-center justify-between mt-4 pt-3 border-t border-cream-300/60">
                      <div class="flex items-center gap-2 min-w-0">
                        <img
                          [src]="s.ownerAvatar || 'https://api.dicebear.com/9.x/initials/svg?seed=' + (s.ownerName || 'P') + '&backgroundColor=ecc7c0'"
                          referrerpolicy="no-referrer"
                          (error)="onAvatarError($event, s.ownerName)"
                          class="w-7 h-7 rounded-full object-cover ring-1 ring-rose-100 flex-shrink-0">
                        <span class="text-xs text-ink-400 truncate">{{ s.ownerName || 'Anónimo' }}</span>
                        @if (s.ownerVerified) {
                          <mat-icon class="!text-sm !w-4 !h-4 text-sage-600" matTooltip="Perfil verificado">verified</mat-icon>
                        }
                      </div>
                      <span class="font-medium text-clay-600 flex-shrink-0">
                        {{ s.price | number }} <span class="text-xs text-ink-400">{{ s.currency }}</span>
                      </span>
                    </div>
                  </div>
                </a>

                <!-- Botón favorito flotante (fuera del <a> para no navegar) -->
                <button (click)="toggleFav(s.id!, $event)"
                        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-cream-50/95 flex items-center justify-center shadow-soft hover:scale-110 transition"
                        [attr.aria-label]="isFav(s.id!) ? 'Quitar de favoritos' : 'Guardar en favoritos'">
                  <mat-icon class="!text-xl"
                            [class.text-rose-600]="isFav(s.id!)"
                            [class.text-ink-400]="!isFav(s.id!)">
                    {{ isFav(s.id!) ? 'favorite' : 'favorite_border' }}
                  </mat-icon>
                </button>
              </div>
            }
          </div>
        }
      } @else {
        <p class="text-center text-ink-400 py-10">Cargando...</p>
      }
    </section>

    <!-- ═════════════════════════ CÓMO FUNCIONA ═════════════════════════ -->
    <section id="como-funciona" class="bg-cream-100/60 border-y border-cream-300/60 py-16 mt-12">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Así de simple</p>
        <h2 class="font-serif text-4xl text-ink-800 mt-2 mb-12">Cómo funciona</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (step of steps; track step.n; let i = $index) {
            <div class="animate-fade-up"
                 [class.delay-1]="i === 1"
                 [class.delay-2]="i === 2">
              <div class="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <mat-icon class="!text-3xl !w-8 !h-8">{{ step.icon }}</mat-icon>
              </div>
              <p class="font-serif text-xl text-ink-800">{{ step.title }}</p>
              <p class="text-sm text-ink-400 mt-1 leading-relaxed max-w-xs mx-auto">{{ step.body }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ═════════════════════════ PLANES ═════════════════════════ -->
    <section id="planes" class="max-w-6xl mx-auto px-4 py-20">
      <div class="text-center mb-12 animate-fade-up">
        <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Planes</p>
        <h2 class="font-serif text-4xl md:text-5xl text-ink-800 mt-2">
          Publicar es <span class="italic text-rose-600">gratis</span>.
        </h2>
        <p class="text-ink-400 mt-3 max-w-xl mx-auto">
          Empieza sin pagar nada. Si quieres más visibilidad y un perfil verificado, pasa a Premium.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <!-- FREE -->
        <div class="bg-cream-50 border border-cream-300 rounded-3xl p-8 animate-fade-up">
          <p class="text-xs uppercase tracking-wider text-sage-600">Gratuito</p>
          <h3 class="font-serif text-4xl text-ink-800 mt-1">Esencial</h3>
          <p class="text-ink-400 text-sm mt-1">Para arrancar y probar el espacio.</p>

          <div class="mt-6">
            <span class="font-serif text-5xl text-ink-800">$0</span>
            <span class="text-ink-400 text-sm">/ siempre</span>
          </div>

          <ul class="mt-6 space-y-3 text-sm text-ink-600">
            @for (f of freeFeatures; track f) {
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-sage-600 mt-0.5">check_circle</mat-icon>
                <span>{{ f }}</span>
              </li>
            }
          </ul>

          <a mat-stroked-button [routerLink]="publishLink()" class="!w-full !mt-8 !border-ink-700 !text-ink-700">
            Empezar gratis
          </a>
        </div>

        <!-- PREMIUM -->
        <div class="relative bg-gradient-to-br from-rose-700 via-rose-600 to-clay-500 text-cream-50 rounded-3xl p-8 shadow-warm animate-fade-up delay-1">
          <span class="absolute top-4 right-4 bg-cream-50 text-rose-700 text-[10px] uppercase tracking-wider font-medium px-3 py-1 rounded-full">
            Recomendado
          </span>
          <p class="text-xs uppercase tracking-wider text-rose-100">Premium</p>
          <h3 class="font-serif text-4xl mt-1">Verificada</h3>
          <p class="text-rose-50/90 text-sm mt-1">Más visibilidad, más confianza.</p>

          <div class="mt-6">
            <span class="font-serif text-5xl">$8.990</span>
            <span class="text-rose-100 text-sm">CLP / mes</span>
          </div>

          <ul class="mt-6 space-y-3 text-sm">
            @for (f of premiumFeatures; track f.text) {
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-cream-50 mt-0.5">{{ f.icon }}</mat-icon>
                <span>{{ f.text }}</span>
              </li>
            }
          </ul>

          <button mat-flat-button class="!w-full !mt-8 !bg-cream-50 !text-rose-700"
                  (click)="goPremium()">
            Quiero ser Premium
          </button>
        </div>
      </div>

      <p class="text-center text-xs text-ink-400 mt-6">
        Sin permanencia · Cancelas cuando quieras · Pago con tarjeta o transferencia
      </p>
    </section>

    <!-- ═════════════════════════ FAQ ═════════════════════════ -->
    <section id="faq" class="bg-cream-100/60 border-y border-cream-300/60 py-20">
      <div class="max-w-3xl mx-auto px-4">
        <div class="text-center mb-10 animate-fade-up">
          <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Dudas frecuentes</p>
          <h2 class="font-serif text-4xl text-ink-800 mt-2">Preguntas</h2>
        </div>

        <div class="space-y-3">
          @for (q of faqs; track q.q; let i = $index) {
            <details class="bg-cream-50 border border-cream-300/60 rounded-2xl px-5 py-4 group animate-fade-up"
                     [class.delay-1]="i === 1"
                     [class.delay-2]="i === 2"
                     [class.delay-3]="i === 3"
                     [class.delay-4]="i >= 4">
              <summary class="font-serif text-lg text-ink-800 cursor-pointer flex items-center justify-between list-none">
                {{ q.q }}
                <mat-icon class="text-rose-600 transition-transform group-open:rotate-45">add</mat-icon>
              </summary>
              <p class="text-sm text-ink-600 mt-3 leading-relaxed">{{ q.a }}</p>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- ═════════════════════════ CIERRE ═════════════════════════ -->
    <section class="max-w-3xl mx-auto px-4 py-20 text-center">
      <p class="text-xs uppercase tracking-[0.25em] text-sage-600 animate-fade-up">¿Listo?</p>
      <h2 class="font-serif text-4xl md:text-5xl text-ink-800 mt-2 animate-fade-up delay-1">
        Crea tu espacio en <span class="italic text-rose-600">minutos</span>.
      </h2>
      <a mat-flat-button color="primary" [routerLink]="publishLink()" class="!px-7 !py-2 !mt-6 !text-base animate-fade-up delay-2">
        <mat-icon>arrow_forward</mat-icon> {{ publishLabel() }}
      </a>
    </section>
  `
})
export class HomeComponent {
  private svc = inject(ServicesService);
  private auth = inject(AuthService);
  private favorites = inject(FavoritesService);
  private snack = inject(MatSnackBar);
  categories = CATEGORIES;
  selected = signal<ServiceCategory | null>(null);

  isFav(id: string) { return this.favorites.has(id); }

  async toggleFav(id: string, e: Event) {
    e.preventDefault();
    e.stopPropagation();
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

  private all = toSignal(this.svc.listPublished(), { initialValue: undefined });

  filtered = computed(() => {
    const list = this.all();
    if (!list) return undefined;
    const cat = this.selected();
    return cat ? list.filter(s => s.category === cat) : list;
  });

  // CTAs cambian según haya sesión o no.
  publishLink    = computed(() => this.auth.user() ? '/services/new' : '/auth/register');
  publishLabel   = computed(() => this.auth.user() ? 'Publicar mi servicio' : 'Publicar mi servicio');
  ctaBannerLabel = computed(() => this.auth.user() ? 'Crear servicio' : 'Crear mi cuenta');

  banners: CatBanner[] = [
    {
      value: 'conversacion',
      label: 'Conversación',
      icon: 'chat_bubble',
      blurb: 'Hablar sin filtros con alguien que escucha.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80'
    },
    {
      value: 'psicologia',
      label: 'Psicología',
      icon: 'psychology',
      blurb: 'Acompañamiento clínico, online o presencial.',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80'
    },
    {
      value: 'masajes',
      label: 'Masajes',
      icon: 'spa',
      blurb: 'Relax, aromaterapia y descontractura.',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80'
    },
    {
      value: 'compania',
      label: 'Compañía',
      icon: 'favorite',
      blurb: 'Presencia discreta y elegante para tus momentos.',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80'
    },
    {
      value: 'coaching',
      label: 'Coaching',
      icon: 'self_improvement',
      blurb: 'Orden, foco y avance en tus metas.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
    },
    {
      value: 'otros',
      label: 'Otros',
      icon: 'auto_awesome',
      blurb: 'Rituales, lectura, sanación y más.',
      image: 'https://images.unsplash.com/photo-1532926381893-7542290edf1d?w=800&q=80'
    }
  ];

  steps = [
    { n: 1, icon: 'search',  title: 'Explora',     body: 'Recorre los perfiles. Filtra por categoría y encuentra el espacio que necesitas.' },
    { n: 2, icon: 'chat',    title: 'Contacta',    body: 'Un clic en WhatsApp te conecta directo con la persona. Sin intermediarios.' },
    { n: 3, icon: 'favorite',title: 'Encuéntrate', body: 'Acuerden tiempo, lugar y tarifa. Pipin sólo es el puente.' }
  ];

  freeFeatures = [
    'Hasta 1 servicio publicado',
    'Perfil con foto, bio y contacto WhatsApp',
    'Subida de fotos (hasta 5 por servicio)',
    'Aparece en el listado público',
    'Sin costo, para siempre'
  ];

  premiumFeatures = [
    { icon: 'verified',       text: 'Badge "Verificad@" en tu perfil y publicaciones' },
    { icon: 'star',           text: 'Tus servicios marcados como "Destacado"' },
    { icon: 'unfold_more',    text: 'Hasta 10 servicios publicados simultáneamente' },
    { icon: 'auto_awesome',   text: 'Posición preferente en la home' },
    { icon: 'insights',       text: 'Estadísticas de visitas y favoritos' },
    { icon: 'support_agent',  text: 'Soporte prioritario por WhatsApp' }
  ];

  faqs = [
    { q: '¿Publicar es realmente gratis?',
      a: 'Sí. El plan Esencial es gratuito para siempre y te permite tener 1 servicio activo, recibir contactos por WhatsApp y aparecer en el listado público.' },
    { q: '¿Qué incluye Premium y por qué pagarlo?',
      a: 'Premium suma un badge de verificación visible en tu perfil, posición preferente, servicios destacados, más espacios publicados, estadísticas y soporte prioritario. Pensado para quien hace de esto su trabajo.' },
    { q: '¿Cómo se cobra el servicio entre usuarios?',
      a: 'Pipin no procesa pagos entre quien ofrece y quien contrata. Lo acuerdan directo por WhatsApp con los medios que prefieran (transferencia, efectivo, etc.). Pipin sólo conecta.' },
    { q: '¿Mis fotos y datos son privados?',
      a: 'Tu nombre, foto y bio son visibles a quien visite tu publicación. Tu email queda privado. El WhatsApp se usa sólo para el CTA y nunca se muestra como número en pantalla.' },
    { q: '¿Puedo despublicar o pausar mis servicios?',
      a: 'Sí, en "Mis servicios" puedes despublicar con un clic. Los datos quedan guardados y puedes volver a activarlos cuando quieras.' },
    { q: '¿Cómo cancelo Premium?',
      a: 'Sin permanencia. Cancelas desde tu perfil en cualquier momento y mantienes tus beneficios hasta el fin del período pagado.' }
  ];

  selectCategory(v: ServiceCategory) {
    this.selected.set(v);
  }

  goPremium() {
    this.snack.open('Pronto: pasarela de pago. Te avisaremos por email.', 'OK', { duration: 3500 });
  }

  categoryLabel(v: string) {
    return CATEGORIES.find(c => c.value === v)?.label ?? v;
  }
  categoryIcon(v: string) {
    return CATEGORIES.find(c => c.value === v)?.icon ?? 'circle';
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/f5e3df/874539?text=Pipin';
  }
  onAvatarError(e: Event, name?: string) {
    const seed = encodeURIComponent(name || 'P');
    (e.target as HTMLImageElement).src =
      `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=ecc7c0`;
  }
}
