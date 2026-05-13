import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../core/services/auth.service';
import { ProfileService } from '../core/services/profile.service';
import { FavoritesService } from '../core/services/favorites.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, MatTooltipModule
  ],
  template: `
    <header class="sticky top-0 z-30 bg-cream-100/80 backdrop-blur border-b border-cream-300/60">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <a routerLink="/" class="flex items-baseline gap-1 group">
          <span class="font-serif text-3xl font-medium text-rose-700 leading-none">Pipin</span>
          <span class="text-[10px] uppercase tracking-[0.2em] text-sage-600 hidden sm:inline">
            · espacios con calma
          </span>
        </a>
        <nav class="hidden md:flex items-center gap-1 ml-6">
          <a mat-button routerLink="/" routerLinkActive="!text-rose-700" [routerLinkActiveOptions]="{exact:true}">Explorar</a>
          <a mat-button [routerLink]="['/']" fragment="planes">Planes</a>
          <a mat-button [routerLink]="['/']" fragment="faq">FAQ</a>
        </nav>

        <span class="flex-1"></span>

        @if (auth.user(); as u) {
          <!-- Favoritos -->
          <a mat-icon-button routerLink="/me/favorites" matTooltip="Mis favoritos"
             [matBadge]="favCount() > 0 ? favCount() : null"
             matBadgeColor="warn" matBadgeSize="small">
            <mat-icon>favorite_border</mat-icon>
          </a>

          <!-- Avatar / menú -->
          <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Mi cuenta">
            <span class="relative inline-block">
              <img
                [src]="(u.photoURL) || 'https://api.dicebear.com/9.x/initials/svg?seed=' + (u.displayName || u.email || 'U') + '&backgroundColor=ecc7c0'"
                referrerpolicy="no-referrer"
                (error)="onAvatarError($event, u)"
                class="w-9 h-9 rounded-full object-cover ring-2"
                [class.ring-clay-500]="profile()?.isPremium"
                [class.ring-rose-200]="!profile()?.isPremium">
              @if (profile()?.isVerified) {
                <mat-icon class="absolute -bottom-1 -right-1 !text-base !w-4 !h-4 bg-cream-50 rounded-full text-sage-600"
                          matTooltip="Verificad@">verified</mat-icon>
              }
            </span>
          </button>

          <mat-menu #menu="matMenu">
            <div class="px-4 py-3 border-b border-cream-200">
              <p class="font-medium text-ink-800 leading-tight inline-flex items-center gap-1">
                {{ u.displayName || u.email }}
                @if (profile()?.isVerified) {
                  <mat-icon class="!text-base !w-4 !h-4 text-sage-600">verified</mat-icon>
                }
              </p>
              @if (profile()?.isPremium) {
                <p class="text-[10px] uppercase tracking-wider text-clay-600 mt-1 inline-flex items-center gap-1">
                  <mat-icon class="!text-xs !w-3 !h-3">star</mat-icon> Premium activo
                </p>
              } @else {
                <p class="text-[10px] uppercase tracking-wider text-ink-400 mt-1">Plan gratuito</p>
              }
            </div>

            <a mat-menu-item routerLink="/profile"><mat-icon>person</mat-icon> Mi perfil</a>
            <a mat-menu-item routerLink="/me/services"><mat-icon>storefront</mat-icon> Mis servicios</a>
            <a mat-menu-item routerLink="/me/favorites">
              <mat-icon>favorite</mat-icon> Mis favoritos
              @if (favCount() > 0) {
                <span class="ml-1 text-xs bg-rose-100 text-rose-700 px-1.5 rounded-full">{{ favCount() }}</span>
              }
            </a>
            <a mat-menu-item routerLink="/services/new"><mat-icon>add_circle</mat-icon> Nuevo servicio</a>
            <div class="border-t border-cream-200 my-1"></div>
            @if (!profile()?.isPremium) {
              <a mat-menu-item [routerLink]="['/']" fragment="planes" class="!text-clay-600">
                <mat-icon>workspace_premium</mat-icon> Hacerme Premium
              </a>
            }
            <button mat-menu-item (click)="logout()"><mat-icon>logout</mat-icon> Cerrar sesión</button>
          </mat-menu>
        } @else {
          <a mat-button routerLink="/auth/login" class="!text-ink-700">Entrar</a>
          <a mat-flat-button color="primary" routerLink="/auth/register">Crear cuenta</a>
        }
      </div>
    </header>
  `
})
export class HeaderComponent {
  auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private favorites = inject(FavoritesService);
  private router = inject(Router);

  // Perfil del usuario logueado (reactivo, para badges verificado/premium en el header)
  profile = toSignal(
    of(null).pipe(
      switchMap(() => {
        const u = this.auth.user();
        return u ? this.profiles.get(u.uid) : of(undefined);
      })
    ),
    { initialValue: undefined }
  );

  favCount = computed(() => this.favorites.idSet().size);

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/');
  }

  onAvatarError(e: Event, u: { displayName?: string | null; email?: string | null }) {
    const seed = encodeURIComponent(u.displayName || u.email || 'U');
    (e.target as HTMLImageElement).src =
      `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=ecc7c0`;
  }
}
