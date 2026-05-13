import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ServicesService } from '../../core/services/service.service';
import { StorageService } from '../../core/services/storage.service';
import { CATEGORIES, ServiceItem } from '../../core/models/service.model';
import { Profile } from '../../core/models/profile.model';

@Component({
  selector: 'app-service-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-brand-700 mb-1">
        {{ id() ? 'Editar servicio' : 'Nuevo servicio' }}
      </h1>
      <p class="text-gray-500 mb-6">Describe lo que ofreces. Las fotos y un buen título atraen más clientes.</p>

      <form [formGroup]="form" (ngSubmit)="save()" class="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-3">

        <mat-form-field appearance="outline" class="md:col-span-2">
          <mat-label>Título del servicio</mat-label>
          <input matInput formControlName="title" maxlength="80">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="category">
            @for (c of categories; track c.value) {
              <mat-option [value]="c.value">{{ c.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ciudad</mat-label>
          <input matInput formControlName="city">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="price" min="0">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Moneda</mat-label>
          <mat-select formControlName="currency">
            <mat-option value="CLP">CLP</mat-option>
            <mat-option value="USD">USD</mat-option>
            <mat-option value="EUR">EUR</mat-option>
            <mat-option value="ARS">ARS</mat-option>
            <mat-option value="MXN">MXN</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Duración (min)</mat-label>
          <input matInput type="number" formControlName="durationMinutes" min="0">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>WhatsApp (con código país)</mat-label>
          <input matInput formControlName="whatsapp" placeholder="+56 9 1234 5678">
          <mat-icon matSuffix>chat</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="md:col-span-2">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="5" maxlength="1500"></textarea>
          <mat-hint align="end">{{ form.value.description?.length || 0 }} / 1500</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="md:col-span-2">
          <mat-label>Mensaje inicial de WhatsApp (opcional)</mat-label>
          <input matInput formControlName="whatsappMessage" placeholder="Hola, vi tu servicio en Pipin...">
        </mat-form-field>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-ink-700 mb-2">Fotos</label>

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

          <!-- Añadir por URL (no requiere Storage) -->
          <div class="flex gap-2">
            <mat-form-field appearance="outline" class="flex-1 !mb-0">
              <mat-label>Pega una URL de imagen (https://...)</mat-label>
              <input matInput [(ngModel)]="newPhotoUrl" [ngModelOptions]="{standalone:true}"
                     placeholder="https://images.unsplash.com/..."
                     (keyup.enter)="addPhotoUrl()">
              <mat-icon matSuffix>link</mat-icon>
            </mat-form-field>
            <button mat-stroked-button type="button" (click)="addPhotoUrl()" class="!h-14">
              <mat-icon>add</mat-icon> Añadir
            </button>
          </div>

          <!-- Upload archivo (sólo si Storage activo) -->
          <div class="flex items-center gap-3 mt-2">
            <label class="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-cream-300 text-sm text-ink-600 hover:bg-cream-100 cursor-pointer transition">
              @if (uploading()) { <mat-spinner diameter="16"></mat-spinner> }
              @else { <mat-icon class="!text-base !w-4 !h-4">upload</mat-icon> }
              Subir archivo
              <input type="file" accept="image/*" multiple hidden (change)="onPhotos($event)">
            </label>
            <span class="text-[11px] text-ink-400 italic">
              Si tu cuenta de Firebase no tiene Storage activo, usa la opción de URL.
            </span>
          </div>
        </div>

        <div class="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-cream-300/60 pt-5">
          <mat-slide-toggle formControlName="published" color="primary" class="self-start sm:self-auto">
            Publicado
          </mat-slide-toggle>
          <div class="flex gap-2 w-full sm:w-auto">
            <button mat-stroked-button type="button"
                    class="flex-1 sm:flex-none"
                    (click)="router.navigateByUrl('/me/services')">
              Cancelar
            </button>
            <button mat-flat-button color="primary" type="submit"
                    class="flex-1 sm:flex-none"
                    [disabled]="form.invalid || saving()">
              @if (saving()) { <mat-spinner diameter="20"></mat-spinner> }
              @else { Guardar }
            </button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class ServiceEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private services = inject(ServicesService);
  private storage = inject(StorageService);
  private snack = inject(MatSnackBar);
  router = inject(Router);

  id = input<string | undefined>();

  saving = signal(false);
  uploading = signal(false);
  photos = signal<string[]>([]);
  newPhotoUrl = '';
  categories = CATEGORIES;

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    category: ['conversacion' as const, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    currency: ['CLP' as const, Validators.required],
    durationMinutes: [60],
    city: [''],
    whatsapp: ['', Validators.required],
    whatsappMessage: [''],
    published: [true]
  });

  ngOnInit() {
    const id = this.id();
    if (!id) {
      // Pre-llenar whatsapp desde el perfil del usuario.
      const u = this.auth.user();
      if (u) {
        this.profiles.get(u.uid).subscribe(p => {
          if (p?.whatsapp) this.form.patchValue({ whatsapp: p.whatsapp });
        });
      }
      return;
    }
    this.services.get(id).subscribe(s => {
      if (!s) return;
      this.form.patchValue(s as any);
      this.photos.set(s.photos ?? []);
    });
  }

  async onPhotos(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    const u = this.auth.user();
    if (!u) return;
    this.uploading.set(true);
    try {
      const urls = await this.storage.uploadMany(`services/${u.uid}`, files);
      this.photos.update(prev => [...prev, ...urls]);
      this.snack.open(`${urls.length} foto(s) subida(s)`, 'OK', { duration: 2000 });
    } catch (err: any) {
      // Si Storage no está activo en Firebase, sugerimos usar URL.
      const msg = err?.code === 'storage/unauthorized' || err?.message?.includes('CORS')
        ? 'Storage no está activo en tu Firebase. Usa la opción de pegar URL.'
        : 'Error subiendo fotos. Usa la opción de pegar URL.';
      this.snack.open(msg, 'OK', { duration: 4000 });
      console.error('Upload error', err);
    } finally {
      this.uploading.set(false);
    }
  }

  addPhotoUrl() {
    const url = (this.newPhotoUrl || '').trim();
    if (!url) return;
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

  async save() {
    const u = this.auth.user();
    if (!u || this.form.invalid) return;
    this.saving.set(true);
    try {
      const v = this.form.getRawValue();
      const profile: Profile | undefined = await firstValueFrom(this.profiles.get(u.uid)).catch(() => undefined);
      const data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'> = {
        ...v,
        ownerUid: u.uid,
        ownerName: profile?.displayName ?? u.displayName ?? 'Anónimo',
        ownerAvatar: profile?.avatarUrl ?? '',
        ownerVerified: profile?.isVerified ?? false,
        featured: profile?.isPremium ?? false,
        photos: this.photos()
      };
      if (this.id()) {
        await this.services.update(this.id()!, data);
        this.snack.open('Servicio actualizado', 'OK', { duration: 2000 });
      } else {
        await this.services.create(data);
        this.snack.open('Servicio creado', 'OK', { duration: 2000 });
      }
      this.router.navigateByUrl('/me/services');
    } catch (e: any) {
      const code = e?.code || e?.message || 'unknown';
      console.error('Save service error:', e);
      const msg = code.includes('permission')
        ? 'Permiso denegado. Cierra sesión, vuelve a entrar y reintenta (token expirado).'
        : `No se pudo guardar: ${code}`;
      this.snack.open(msg, 'OK', { duration: 5000 });
    } finally {
      this.saving.set(false);
    }
  }
}

