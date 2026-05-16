import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ServicesService } from '../../core/services/service.service';
import { SEED_SERVICES } from '../../core/data/seed-services';
import { SEED_OWNERS, ownerBySlug } from '../../core/data/seed-owners';
import { SEED_PROFILE } from '../../core/data/seed-profile';

type TaskKind = 'all' | 'owners' | 'services' | 'me' | 'wipe' | null;

@Component({
  selector: 'app-seed',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-brand-700 mb-1">Seed de datos</h1>
      <p class="text-gray-500 mb-6">
        Pobla Firestore con perfiles y publicaciones de muestra.
        Los owners falsos tienen UID sintético <code>seed-*</code> y se
        crean junto a sus servicios.
      </p>

      <!-- Acción principal: crear TODO -->
      <div class="bg-gradient-to-br from-rose-50 to-cream-50 border border-rose-200/60 rounded-2xl shadow-soft p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <mat-icon class="text-rose-600">auto_awesome</mat-icon>
          <div>
            <p class="font-medium text-ink-800">Crear todo de una vez</p>
            <p class="text-sm text-ink-400">
              {{ SEED_OWNERS.length }} perfiles + {{ SEED_SERVICES.length }} publicaciones + tu perfil.
            </p>
          </div>
        </div>

        <button mat-flat-button color="primary" class="w-full !py-1"
                (click)="seedAll()" [disabled]="loading()">
          @if (loadingTask() === 'all') { <mat-spinner diameter="20"></mat-spinner> }
          @else { <ng-container><mat-icon>rocket_launch</mat-icon> Crear todo</ng-container> }
        </button>
        <p class="text-[11px] text-ink-400 mt-2 italic">
          Requiere reglas Firestore permisivas en /profiles y /services (modo dev).
        </p>
      </div>

      <!-- Acciones granulares -->
      <div class="bg-white rounded-2xl shadow p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <mat-icon class="text-brand-500">tune</mat-icon>
          <p class="font-medium">Acciones individuales</p>
        </div>

        <div class="flex gap-2 flex-wrap">
          <button mat-stroked-button (click)="seedOwners()" [disabled]="loading()">
            @if (loadingTask() === 'owners') { <mat-spinner diameter="18"></mat-spinner> }
            @else { <ng-container><mat-icon>group</mat-icon> Crear {{ SEED_OWNERS.length }} perfiles</ng-container> }
          </button>
          <button mat-stroked-button (click)="seedServices()" [disabled]="loading()">
            @if (loadingTask() === 'services') { <mat-spinner diameter="18"></mat-spinner> }
            @else { <ng-container><mat-icon>storefront</mat-icon> Crear {{ SEED_SERVICES.length }} servicios</ng-container> }
          </button>
          <button mat-stroked-button (click)="seedMyProfile()" [disabled]="loading()">
            @if (loadingTask() === 'me') { <mat-spinner diameter="18"></mat-spinner> }
            @else { <ng-container><mat-icon>person</mat-icon> Seedear mi perfil</ng-container> }
          </button>
        </div>
      </div>

      <!-- Limpieza -->
      <div class="bg-white rounded-2xl shadow p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <mat-icon class="text-red-600">delete_sweep</mat-icon>
          <div>
            <p class="font-medium">Borrar datos de muestra</p>
            <p class="text-sm text-gray-500">
              Elimina todos los servicios cuyo <code>ownerUid</code> empieza con <code>seed-</code>
              y los tuyos.
            </p>
          </div>
        </div>
        <button mat-stroked-button color="warn" (click)="wipeAll()" [disabled]="loading()">
          @if (loadingTask() === 'wipe') { <mat-spinner diameter="18"></mat-spinner> }
          @else { <ng-container><mat-icon>delete</mat-icon> Borrar todo</ng-container> }
        </button>
      </div>

      @if (result(); as r) {
        <div class="text-sm rounded p-3 whitespace-pre-line"
             [class.bg-green-50]="r.ok"
             [class.text-green-700]="r.ok"
             [class.bg-red-50]="!r.ok"
             [class.text-red-700]="!r.ok">
          {{ r.msg }}
        </div>
      }

      <p class="text-xs text-gray-400 mt-4">
        Esta página es sólo para desarrollo. Quita la ruta <code>/admin/seed</code> antes de producción.
      </p>
    </div>
  `
})
export class SeedComponent {
  private auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private services = inject(ServicesService);
  private snack = inject(MatSnackBar);

  loadingTask = signal<TaskKind>(null);
  result = signal<{ ok: boolean; msg: string } | null>(null);

  SEED_SERVICES = SEED_SERVICES;
  SEED_OWNERS = SEED_OWNERS;

  loading() { return this.loadingTask() !== null; }

  /** Botón maestro: perfiles + servicios + mi perfil. */
  async seedAll() {
    if (!this.requireAuth()) return;
    this.start('all');
    const o = await this.runOwners();
    const s = await this.runServices();
    const me = await this.runMyProfile();
    this.end({
      ok: o.fail === 0 && s.fail === 0 && me.ok,
      msg: [
        `Perfiles: ${o.ok} creados, ${o.fail} fallaron.`,
        `Servicios: ${s.ok} creados, ${s.fail} fallaron.`,
        `Tu perfil: ${me.ok ? 'OK' : 'falló'}.`
      ].join('\n')
    });
  }

  async seedOwners() {
    if (!this.requireAuth()) return;
    this.start('owners');
    const r = await this.runOwners();
    this.end({
      ok: r.fail === 0,
      msg: `Perfiles seed: ${r.ok} creados, ${r.fail} fallaron.`
    });
  }

  async seedServices() {
    if (!this.requireAuth()) return;
    this.start('services');
    const r = await this.runServices();
    this.end({
      ok: r.fail === 0,
      msg: `Servicios: ${r.ok} creados, ${r.fail} fallaron.`
    });
  }

  async seedMyProfile() {
    if (!this.requireAuth()) return;
    this.start('me');
    const r = await this.runMyProfile();
    this.end({
      ok: r.ok,
      msg: r.ok ? 'Tu perfil fue actualizado.' : 'Falló al actualizar tu perfil.'
    });
  }

  async wipeAll() {
    if (!this.requireAuth()) return;
    if (!confirm('Esto borrará TODOS los servicios de muestra y los tuyos. ¿Continuar?')) return;
    this.start('wipe');
    const u = this.auth.user()!;
    let removed = 0, fail = 0;
    try {
      // Borrar míos
      const mine = await firstValueFrom(this.services.listByOwner(u.uid));
      for (const s of mine) {
        if (!s.id) continue;
        try { await this.services.remove(s.id); removed++; } catch { fail++; }
      }
      // Borrar de cada owner seed
      for (const o of SEED_OWNERS) {
        const list = await firstValueFrom(this.services.listByOwner(o.uid));
        for (const s of list) {
          if (!s.id) continue;
          try { await this.services.remove(s.id); removed++; } catch { fail++; }
        }
      }
      this.end({
        ok: fail === 0,
        msg: `Borrados ${removed} servicios. Fallaron ${fail}.`
      });
    } catch (e) {
      console.error('wipe error', e);
      this.end({ ok: false, msg: 'Error al borrar.' });
    }
  }

  // ────────────────── helpers ──────────────────

  private async runOwners(): Promise<{ ok: number; fail: number }> {
    let ok = 0, fail = 0;
    for (const o of SEED_OWNERS) {
      try {
        await this.profiles.upsert(o.uid, {
          displayName: o.displayName,
          bio: o.bio,
          city: o.city,
          age: o.age,
          whatsapp: o.whatsapp,
          avatarUrl: o.avatarUrl,
          photos: o.photos,
          isVerified: o.isVerified,
          isPremium: o.isPremium
        });
        ok++;
      } catch (e) {
        console.error('Seed owner error', o.slug, e);
        fail++;
      }
    }
    return { ok, fail };
  }

  private async runServices(): Promise<{ ok: number; fail: number }> {
    let ok = 0, fail = 0;
    for (const s of SEED_SERVICES) {
      const owner = ownerBySlug(s.ownerSlug);
      if (!owner) { fail++; continue; }
      try {
        await this.services.create({
          ownerUid: owner.uid,
          ownerName: owner.displayName,
          ownerAvatar: owner.avatarUrl ?? '',
          ownerVerified: owner.isVerified ?? false,
          featured: owner.isPremium ?? false,
          title: s.title,
          description: s.description,
          category: s.category,
          price: s.price,
          currency: s.currency,
          durationMinutes: s.durationMinutes,
          city: s.city,
          photos: s.photos,
          whatsapp: s.whatsapp,
          whatsappMessage: s.whatsappMessage,
          published: s.published
        });
        ok++;
      } catch (e) {
        console.error('Seed service error', s.title, e);
        fail++;
      }
    }
    return { ok, fail };
  }

  private async runMyProfile(): Promise<{ ok: boolean }> {
    const u = this.auth.user()!;
    try {
      await this.profiles.upsert(u.uid, {
        ...SEED_PROFILE,
        email: u.email ?? undefined
      });
      return { ok: true };
    } catch (e) {
      console.error('Seed my profile error', e);
      return { ok: false };
    }
  }

  private requireAuth(): boolean {
    if (!this.auth.user()) {
      this.result.set({ ok: false, msg: 'Debes iniciar sesión primero.' });
      return false;
    }
    return true;
  }

  private start(t: TaskKind) {
    this.loadingTask.set(t);
    this.result.set(null);
  }

  private end(r: { ok: boolean; msg: string }) {
    this.loadingTask.set(null);
    this.result.set(r);
    this.snack.open(r.ok ? 'Listo ✓' : 'Con errores', 'OK', { duration: 3000 });
  }
}
