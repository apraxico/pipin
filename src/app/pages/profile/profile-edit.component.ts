import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    FormsModule,
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

          <div class="md:col-span-2">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-ink-700">Galería (lugar y persona)</label>
              <span class="text-xs text-ink-400">{{ photos().length }} / {{ MAX_PHOTOS }}</span>
            </div>

            <div class="flex flex-wrap gap-3 mb-3">
              @for (url of photos(); track url; let i = $index) {
                <div class="relative group">
                  <img [src]="url" referrerpolicy="no-referrer"
                       class="w-24 h-24 object-cover rounded-lg ring-1 ring-cream-300">
                  <button mat-icon-button type="button"
                          class="!absolute -top-2 -right-2 !bg-cream-50 shadow"
                          (click)="removePhoto(i)">
                    <mat-icon class="!text-red-600">close</mat-icon>
                  </button>
                </div>
              }
              @if (photos().length === 0) {
                <div class="w-24 h-24 rounded-lg border-2 border-dashed border-cream-300 flex items-center justify-center text-ink-400 text-xs">
                  Sin fotos
                </div>
              }
            </div>

            <div class="flex gap-2">
              <mat-form-field appearance="outline" class="flex-1 !mb-0">
                <mat-label>Pega una URL de imagen (https://...)</mat-label>
                <input matInput [(ngModel)]="newPhotoUrl" [ngModelOptions]="{standalone:true}"
                       placeholder="https://images.unsplash.com/..."
                       [disabled]="photos().length >= MAX_PHOTOS"
                       (keyup.enter)="addPhotoUrl()">
                <mat-icon matSuffix>link</mat-icon>
              </mat-form-field>
              <button mat-stroked-button type="button" (click)="addPhotoUrl()" class="!h-14"
                      [disabled]="photos().length >= MAX_PHOTOS">
                <mat-icon>add</mat-icon> Añadir
              </button>
            </div>

            <div class="flex items-center gap-3 mt-2">
              <label class="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-cream-300 text-sm text-ink-600 hover:bg-cream-100 cursor-pointer transition"
                     [class.opacity-50]="photos().length >= MAX_PHOTOS"
                     [class.pointer-events-none]="photos().length >= MAX_PHOTOS">
                @if (uploadingPhotos()) { <mat-spinner diameter="16"></mat-spinner> }
                @else { <mat-icon class="!text-base !w-4 !h-4">upload</mat-icon> }
                Subir archivo
                <input type="file" accept="image/*" multiple hidden
                       [disabled]="photos().length >= MAX_PHOTOS"
                       (change)="onPhotos($event)">
              </label>
              <span class="text-[11px] text-ink-400 italic">
                Hasta {{ MAX_PHOTOS }} fotos. Si Storage no está activo, usa URL.
              </span>
            </div>
          </div>

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

  readonly MAX_PHOTOS = 4;

  saving = signal(false);
  uploadingAvatar = signal(false);
  uploadingPhotos = signal(false);
  photos = signal<string[]>([]);
  newPhotoUrl = '';

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
        if (p) {
          this.form.patchValue(p);
          this.photos.set((p.photos ?? []).slice(0, this.MAX_PHOTOS));
        }
      });
    });
  }

  async onPhotos(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    const u = this.auth.user();
    if (!u) return;
    const remaining = this.MAX_PHOTOS - this.photos().length;
    if (remaining <= 0) {
      this.snack.open(`Máximo ${this.MAX_PHOTOS} fotos`, 'OK', { duration: 2500 });
      return;
    }
    const toUpload = files.slice(0, remaining);
    this.uploadingPhotos.set(true);
    try {
      const urls = await this.storage.uploadMany(`profiles/${u.uid}/gallery`, toUpload);
      this.photos.update(prev => [...prev, ...urls].slice(0, this.MAX_PHOTOS));
      if (files.length > toUpload.length) {
        this.snack.open(`Se subieron ${toUpload.length}. Máximo ${this.MAX_PHOTOS}.`, 'OK', { duration: 3000 });
      } else {
        this.snack.open(`${urls.length} foto(s) subida(s)`, 'OK', { duration: 2000 });
      }
    } catch (err: any) {
      const msg = err?.code === 'storage/unauthorized' || err?.message?.includes('CORS')
        ? 'Storage no está activo en tu Firebase. Usa la opción de pegar URL.'
        : 'Error subiendo fotos. Usa la opción de pegar URL.';
      this.snack.open(msg, 'OK', { duration: 4000 });
      console.error('Upload error', err);
    } finally {
      this.uploadingPhotos.set(false);
    }
  }

  addPhotoUrl() {
    const url = (this.newPhotoUrl || '').trim();
    if (!url) return;
    if (this.photos().length >= this.MAX_PHOTOS) {
      this.snack.open(`Máximo ${this.MAX_PHOTOS} fotos`, 'OK', { duration: 2500 });
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      this.snack.open('La URL debe empezar con http:// o https://', 'OK', { duration: 2500 });
      return;
    }
    if (this.photos().includes(url)) {
      this.snack.open('Esa URL ya está añadida', 'OK', { duration: 2000 });
      return;
    }
    this.photos.update(prev => [...prev, url]);
    this.newPhotoUrl = '';
  }

  removePhoto(i: number) {
    const arr = [...this.photos()];
    arr.splice(i, 1);
    this.photos.set(arr);
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
        avatarUrl: v.avatarUrl,
        photos: this.photos()
      });
      this.snack.open('Perfil guardado', 'OK', { duration: 2500 });
    } catch {
      this.snack.open('No se pudo guardar', 'OK', { duration: 3000 });
    } finally {
      this.saving.set(false);
    }
  }
}
