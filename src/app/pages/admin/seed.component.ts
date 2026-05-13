import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ServicesService } from '../../core/services/service.service';
import { SEED_SERVICES } from '../../core/data/seed-services';
import { SEED_PROFILE } from '../../core/data/seed-profile';

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
        Pobla Firestore con datos de muestra. Todo queda con tu uid como dueño
        para cumplir las reglas de seguridad.
      </p>

      <!-- Servicios -->
      <div class="bg-white rounded-2xl shadow p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <mat-icon class="text-brand-500">storefront</mat-icon>
          <div>
            <p class="font-medium">{{ SEED_SERVICES.length }} servicios de muestra</p>
            <p class="text-sm text-gray-500">Conversación, psicología, masajes, compañía, coaching</p>
          </div>
        </div>

        <div class="flex gap-2 flex-wrap">
          <button mat-flat-button color="primary" (click)="seedServices()" [disabled]="loading()">
            @if (loadingTask() === 'services') { <mat-spinner diameter="20"></mat-spinner> }
            @else { <ng-container><mat-icon>play_arrow</mat-icon> Crear servicios</ng-container> }
          </button>
          <button mat-stroked-button color="warn" (click)="wipeServices()" [disabled]="loading()">
            <mat-icon>delete_sweep</mat-icon> Borrar mis servicios
          </button>
        </div>
      </div>

      <!-- Perfil -->
      <div class="bg-white rounded-2xl shadow p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <mat-icon class="text-brand-500">person</mat-icon>
          <div>
            <p class="font-medium">Tu perfil</p>
            <p class="text-sm text-gray-500">
              Llena tu doc en <code>profiles/{{ '{' }}tu-uid{{ '}' }}</code> con datos de prueba
            </p>
          </div>
        </div>

        <div class="bg-gray-50 rounded p-3 text-xs text-gray-600 mb-3 font-mono">
          <div><strong>displayName:</strong> {{ SEED_PROFILE.displayName }}</div>
          <div><strong>city:</strong> {{ SEED_PROFILE.city }}</div>
          <div><strong>whatsapp:</strong> {{ SEED_PROFILE.whatsapp }}</div>
        </div>

        <button mat-flat-button color="primary" (click)="seedProfile()" [disabled]="loading()">
          @if (loadingTask() === 'profile') { <mat-spinner diameter="20"></mat-spinner> }
          @else { <ng-container><mat-icon>auto_fix_high</mat-icon> Seedear mi perfil</ng-container> }
        </button>
      </div>

      @if (result(); as r) {
        <div class="text-sm rounded p-3"
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

  loadingTask = signal<'services' | 'profile' | 'wipe' | null>(null);
  result = signal<{ ok: boolean; msg: string } | null>(null);

  SEED_SERVICES = SEED_SERVICES;
  SEED_PROFILE = SEED_PROFILE;

  loading() { return this.loadingTask() !== null; }

  async seedServices() {
    const u = this.auth.user();
    if (!u) return this.fail('Debes iniciar sesión primero.');
    this.start('services');
    let ok = 0, fail = 0;
    for (const s of SEED_SERVICES) {
      try {
        await this.services.create({ ...s, ownerUid: u.uid });
        ok++;
      } catch (e) {
        console.error('Seed service error', e);
        fail++;
      }
    }
    this.end({
      ok: fail === 0,
      msg: fail === 0
        ? `Listo: ${ok} servicios creados.`
        : `Creados ${ok}, fallaron ${fail}. Revisa la consola.`
    });
  }

  async seedProfile() {
    const u = this.auth.user();
    if (!u) return this.fail('Debes iniciar sesión primero.');
    this.start('profile');
    try {
      await this.profiles.upsert(u.uid, {
        ...SEED_PROFILE,
        email: u.email ?? undefined
      });
      this.end({ ok: true, msg: `Perfil actualizado para uid ${u.uid}.` });
    } catch (e) {
      console.error('Seed profile error', e);
      this.end({ ok: false, msg: 'Error al seedear el perfil.' });
    }
  }

  async wipeServices() {
    const u = this.auth.user();
    if (!u) return this.fail('Debes iniciar sesión primero.');
    if (!confirm('Esto borrará TODOS tus servicios. ¿Continuar?')) return;
    this.start('wipe');
    const sub = this.services.listByOwner(u.uid).subscribe(async list => {
      sub.unsubscribe();
      try {
        for (const s of list) {
          if (s.id) await this.services.remove(s.id);
        }
        this.end({ ok: true, msg: `Borrados ${list.length} servicios.` });
      } catch {
        this.end({ ok: false, msg: 'Error al borrar.' });
      }
    });
  }

  private start(t: 'services' | 'profile' | 'wipe') {
    this.loadingTask.set(t);
    this.result.set(null);
  }
  private end(r: { ok: boolean; msg: string }) {
    this.loadingTask.set(null);
    this.result.set(r);
    this.snack.open(r.msg, 'OK', { duration: 3000 });
  }
  private fail(msg: string) {
    this.result.set({ ok: false, msg });
  }
}
