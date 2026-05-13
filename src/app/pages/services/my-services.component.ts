import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { ServicesService } from '../../core/services/service.service';
import { CATEGORIES, ServiceItem } from '../../core/models/service.model';

@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-brand-700">Mis servicios</h1>
          <p class="text-gray-500">Administra y publica tus servicios</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/services/new">
          <mat-icon>add</mat-icon> Nuevo servicio
        </a>
      </div>

      @if (services(); as list) {
        @if (list.length === 0) {
          <div class="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <mat-icon class="!text-5xl !w-12 !h-12 text-gray-300">inventory_2</mat-icon>
            <p class="mt-3 text-gray-500">Aún no tienes servicios publicados</p>
            <a mat-stroked-button color="primary" routerLink="/services/new" class="mt-4">Crear el primero</a>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (s of list; track s.id) {
              <div class="bg-white rounded-2xl shadow p-4 flex gap-4">
                <img
                  [src]="s.photos[0] || 'https://placehold.co/120x120/f5e3df/874539?text=Pipin'"
                  referrerpolicy="no-referrer"
                  (error)="onImgError($event)"
                  class="w-24 h-24 rounded-xl object-cover flex-shrink-0">
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="font-semibold text-gray-800 truncate">{{ s.title }}</h3>
                    @if (s.published) {
                      <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Publicado</span>
                    } @else {
                      <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Borrador</span>
                    }
                  </div>
                  <p class="text-xs text-gray-500 mb-1">{{ categoryLabel(s.category) }}</p>
                  <p class="text-sm text-gray-600 line-clamp-2">{{ s.description }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-brand-700 font-bold">{{ s.price | number }} {{ s.currency }}</span>
                    <span class="flex-1"></span>
                    <a mat-icon-button [routerLink]="['/services', s.id, 'edit']" matTooltip="Editar"><mat-icon>edit</mat-icon></a>
                    <button mat-icon-button (click)="togglePublish(s)" [matTooltip]="s.published ? 'Despublicar' : 'Publicar'">
                      <mat-icon>{{ s.published ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="remove(s.id!)" matTooltip="Eliminar"><mat-icon>delete</mat-icon></button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class MyServicesComponent implements OnInit {
  private auth = inject(AuthService);
  private svc = inject(ServicesService);
  private snack = inject(MatSnackBar);

  ngOnInit() {
    const u = this.auth.user();
    this.snack.open(
      u ? `Hola ${u.displayName || u.email || ''} — estás en tus servicios` : 'Listo, entraste',
      'OK',
      { duration: 2500 }
    );
  }

  services = toSignal(
    of(null).pipe(
      switchMap(() => {
        const u = this.auth.user();
        return u ? this.svc.listByOwner(u.uid) : of<ServiceItem[]>([]);
      })
    ),
    { initialValue: [] as ServiceItem[] }
  );

  categoryLabel(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'https://placehold.co/120x120/f5e3df/874539?text=Pipin';
  }

  async togglePublish(s: ServiceItem) {
    try {
      await this.svc.update(s.id!, { published: !s.published });
      this.snack.open(s.published ? 'Despublicado' : 'Publicado', 'OK', { duration: 2000 });
    } catch {
      this.snack.open('Error', 'OK', { duration: 2000 });
    }
  }

  async remove(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return;
    try {
      await this.svc.remove(id);
      this.snack.open('Eliminado', 'OK', { duration: 2000 });
    } catch {
      this.snack.open('Error', 'OK', { duration: 2000 });
    }
  }
}
