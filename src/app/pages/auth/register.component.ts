import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-md bg-cream-50 rounded-2xl shadow-soft p-8 border border-cream-300/40">
        <div class="text-center mb-6">
          <p class="text-xs uppercase tracking-[0.2em] text-sage-600 mb-2">Empieza aquí</p>
          <h1 class="font-serif text-4xl text-ink-800">Crear <span class="italic text-rose-600">cuenta</span></h1>
          <p class="text-sm text-ink-400 mt-1">Comienza a publicar tus servicios en minutos</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-3">
          <mat-form-field appearance="outline">
            <mat-label>Nombre público</mat-label>
            <input matInput formControlName="displayName" autocomplete="name">
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email">
            <mat-icon matSuffix>mail</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput [type]="showPass() ? 'text' : 'password'" formControlName="password" autocomplete="new-password">
            <button mat-icon-button matSuffix type="button" (click)="showPass.set(!showPass())">
              <mat-icon>{{ showPass() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-hint>Mínimo 6 caracteres</mat-hint>
          </mat-form-field>

          @if (error()) {
            <div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{{ error() }}</div>
          }

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) { <mat-spinner diameter="20"></mat-spinner> }
            @else { Crear cuenta }
          </button>
        </form>

        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400 uppercase">o</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <button mat-stroked-button type="button" class="w-full" (click)="registerGoogle()" [disabled]="loading()">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 inline mr-2" alt="">
          Continuar con Google
        </button>

        <p class="mt-6 text-center text-sm text-ink-400">
          ¿Ya tienes cuenta? <a routerLink="/auth/login" class="text-rose-600 font-medium hover:text-rose-700">Inicia sesión</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private router = inject(Router);

  showPass = signal(false);
  error = signal<string | null>(null);
  loading = this.auth.loading;

  form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async submit() {
    this.error.set(null);
    if (this.form.invalid) return;
    try {
      const { email, password, displayName } = this.form.getRawValue();
      const user = await this.auth.register(email, password, displayName);
      await this.profiles.upsert(user.uid, {
        displayName,
        email
      });
      this.router.navigateByUrl('/profile');
    } catch (e: any) {
      this.error.set(this.translate(e?.code) ?? 'No se pudo crear la cuenta.');
    }
  }

  async registerGoogle() {
    this.error.set(null);
    let user;
    try {
      user = await this.auth.loginWithGoogle();
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user') return;
      this.error.set(this.translate(e?.code) ?? 'No se pudo crear cuenta con Google.');
      return;
    }
    this.profiles
      .upsert(user.uid, {
        displayName: user.displayName ?? 'Sin nombre',
        email: user.email ?? undefined,
        avatarUrl: user.photoURL ?? undefined
      })
      .catch(err => console.warn('No se pudo crear perfil tras registro Google:', err));
    this.router.navigateByUrl('/profile');
  }

  private translate(code?: string): string | null {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ese email ya está registrado.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/weak-password':
        return 'Contraseña demasiado débil.';
      case 'auth/popup-blocked':
        return 'El popup fue bloqueado por el navegador.';
      case 'auth/operation-not-allowed':
        return 'Este método de inicio no está habilitado en Firebase.';
      default:
        return null;
    }
  }
}
