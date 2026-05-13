import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
          <div class="flex flex-wrap gap-3">
            @for (url of photos(); track url; let i = $index) {
              <div class="relative group">
                <img [src]="url" class="w-24 h-24 object-cover rounded-lg ring-1 ring-gray-200">
                <button mat-icon-button type="button"
                        class="!absolute -top-2 -right-2 !bg-white shadow"
                        (click)="removePhoto(i)">
                  <mat-icon class="!text-red-600">close</mat-icon>
                </button>
              </div>
            }
            <label class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:text-brand-600 transition">
              @if (uploading()) { <mat-spinner diameter="20"></mat-spinner> }
              @else {
                <mat-icon>add_photo_alternate</mat-icon>
                <span class="text-xs mt-1">Subir</span>
              }
              <input type="file" accept="image/*" multiple hidden (change)="onPhotos($event)">
            </label>
          </div>
        </div>

        <div class="md:col-span-2 flex items-center justify-between border-t pt-4">
          <mat-slide-toggle formControlName="published" color="primary">Publicado</mat-slide-toggle>
          <div class="flex gap-2">
            <button mat-button type="button" (click)="router.navigateByUrl('/me/services')">Cancelar</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
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
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    if (!files.length) return;
    const u = this.auth.user();
    if (!u) return;
    this.uploading.set(true);
    try {
      const urls = await this.storage.uploadMany(`services/${u.uid}`, files);
      this.photos.update(prev => [...prev, ...urls]);
    } catch {
      this.snack.open('Error subiendo fotos', 'OK', { duration: 2500 });
    } finally {
      this.uploading.set(false);
    }
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
    } catch (e) {
      this.snack.open('No se pudo guardar', 'OK', { duration: 3000 });
    } finally {
      this.saving.set(false);
    }
  }
}

