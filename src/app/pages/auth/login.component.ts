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
  selector: 'app-login',
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
          <p class="text-xs uppercase tracking-[0.2em] text-sage-600 mb-2">Hola, de nuevo</p>
          <h1 class="font-serif text-4xl text-ink-800">Inicia <span class="italic text-rose-600">sesión</span></h1>
          <p class="text-sm text-ink-400 mt-1">Accede para gestionar tu perfil y servicios</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-3">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email">
            <mat-icon matSuffix>mail</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput [type]="showPass() ? 'text' : 'password'" formControlName="password" autocomplete="current-password">
            <button mat-icon-button matSuffix type="button" (click)="showPass.set(!showPass())">
              <mat-icon>{{ showPass() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          @if (error()) {
            <div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{{ error() }}</div>
          }

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) { <mat-spinner diameter="20"></mat-spinner> }
            @else { Entrar }
          </button>
        </form>

        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400 uppercase">o</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <button mat-stroked-button type="button" class="w-full" (click)="loginGoogle()" [disabled]="loading()">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 inline mr-2" alt="">
          Continuar con Google
        </button>

        <p class="mt-6 text-center text-sm text-ink-400">
          ¿No tienes cuenta? <a routerLink="/auth/register" class="text-rose-600 font-medium hover:text-rose-700">Crear cuenta</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private router = inject(Router);

  showPass = signal(false);
  error = signal<string | null>(null);
  loading = this.auth.loading;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async submit() {
    this.error.set(null);
    if (this.form.invalid) return;
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(this.translate(e?.code) ?? 'No se pudo iniciar sesión.');
    }
  }

  async loginGoogle() {
    this.error.set(null);
    let user;
    try {
      user = await this.auth.loginWithGoogle();
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user') return;
      this.error.set(this.translate(e?.code) ?? 'No se pudo iniciar con Google.');
      return;
    }
    // El login ya fue exitoso. Navegamos siempre, aunque el upsert falle.
    this.profiles
      .upsert(user.uid, {
        displayName: user.displayName ?? 'Sin nombre',
        email: user.email ?? undefined,
        avatarUrl: user.photoURL ?? undefined
      })
      .catch(err => console.warn('No se pudo actualizar perfil tras login Google:', err));
    this.router.navigateByUrl('/');
  }

  private translate(code?: string): string | null {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email o contraseña incorrectos.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      case 'auth/popup-blocked':
        return 'El popup fue bloqueado por el navegador.';
      case 'auth/operation-not-allowed':
        return 'Este método de inicio no está habilitado en Firebase.';
      default:
        return null;
    }
  }
}
