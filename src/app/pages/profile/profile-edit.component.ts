import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-brand-700 mb-1">Mi perfil</h1>
      <p class="text-gray-500 mb-6">Completa tus datos. Tu perfil será visible para los visitantes.</p>

      <div class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center gap-4 mb-6">
          <div class="relative">
            <img
              [src]="form.value.avatarUrl || 'https://api.dicebear.com/9.x/initials/svg?seed=' + (form.value.displayName || 'P')"
              alt="avatar"
              class="w-20 h-20 rounded-full object-cover ring-2 ring-brand-200">
            @if (uploadingAvatar()) {
              <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <mat-spinner diameter="24"></mat-spinner>
              </div>
            }
          </div>
          <div>
            <input type="file" #avatarInput accept="image/*" hidden (change)="onAvatar($event)">
            <button mat-stroked-button type="button" (click)="avatarInput.click()" [disabled]="uploadingAvatar()">
              <mat-icon>photo_camera</mat-icon> Cambiar foto
            </button>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="save()" class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <mat-form-field appearance="outline" class="md:col-span-2">
            <mat-label>Nombre público</mat-label>
            <input matInput formControlName="displayName">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ciudad</mat-label>
            <input matInput formControlName="city">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Edad</mat-label>
            <input matInput type="number" formControlName="age" min="18" max="100">
          </mat-form-field>

          <mat-form-field appearance="outline" class="md:col-span-2">
            <mat-label>WhatsApp (con código país, ej. +56 9 1234 5678)</mat-label>
            <input matInput formControlName="whatsapp">
            <mat-icon matSuffix>chat</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="md:col-span-2">
            <mat-label>Bio</mat-label>
            <textarea matInput formControlName="bio" rows="4" maxlength="500"></textarea>
            <mat-hint align="end">{{ form.value.bio?.length || 0 }} / 500</mat-hint>
          </mat-form-field>

          <div class="md:col-span-2 flex justify-end gap-2 mt-2">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
              @if (saving()) { <mat-spinner diameter="20"></mat-spinner> }
              @else { Guardar }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileEditComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private storage = inject(StorageService);
  private snack = inject(MatSnackBar);

  saving = signal(false);
  uploadingAvatar = signal(false);

  form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    bio: [''],
    city: [''],
    age: [null as number | null],
    whatsapp: [''],
    avatarUrl: ['']
  });

  private profile = toSignal(
    // recarga cuando cambia el user
    of(null).pipe(
      switchMap(() => {
        const u = this.auth.user();
        return u ? this.profiles.get(u.uid) : of(undefined);
      })
    ),
    { initialValue: undefined }
  );

  constructor() {
    // patchear al cargar
    queueMicrotask(() => {
      const u = this.auth.user();
      if (!u) return;
      this.profiles.get(u.uid).subscribe(p => {
        if (p) this.form.patchValue(p);
      });
    });
  }

  async onAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const u = this.auth.user();
    if (!u) return;
    this.uploadingAvatar.set(true);
    try {
      const url = await this.storage.upload(`profiles/${u.uid}`, file);
      this.form.patchValue({ avatarUrl: url });
      await this.profiles.upsert(u.uid, { avatarUrl: url });
      this.snack.open('Avatar actualizado', 'OK', { duration: 2500 });
    } catch (err) {
      this.snack.open('Error subiendo avatar', 'OK', { duration: 3000 });
    } finally {
      this.uploadingAvatar.set(false);
    }
  }

  async save() {
    const u = this.auth.user();
    if (!u || this.form.invalid) return;
    this.saving.set(true);
    try {
      const v = this.form.getRawValue();
      await this.profiles.upsert(u.uid, {
        displayName: v.displayName,
        bio: v.bio,
        city: v.city,
        age: v.age ?? undefined,
        whatsapp: v.whatsapp,
        avatarUrl: v.avatarUrl
      });
      this.snack.open('Perfil guardado', 'OK', { duration: 2500 });
    } catch {
      this.snack.open('No se pudo guardar', 'OK', { duration: 3000 });
    } finally {
      this.saving.set(false);
    }
  }
}
