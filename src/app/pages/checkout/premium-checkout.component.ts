import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { buildWhatsAppLink } from '../../core/utils/whatsapp.util';

@Component({
  selector: 'app-premium-checkout',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatButtonModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <a routerLink="/" class="text-sm text-ink-400 inline-flex items-center gap-1 mb-6 hover:text-rose-700">
        <mat-icon class="!text-base !w-4 !h-4">arrow_back</mat-icon> Volver
      </a>

      <!-- ═════════ Estado: vuelta de pasarela ═════════ -->
      @if (returnStatus() === 'success') {
        <div class="bg-cream-50 rounded-2xl shadow-soft border border-cream-300/40 p-6 mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center flex-shrink-0">
              @if (premiumActive()) {
                <mat-icon>check_circle</mat-icon>
              } @else {
                <mat-spinner diameter="22"></mat-spinner>
              }
            </div>
            <div class="flex-1">
              <h2 class="font-serif text-2xl text-ink-800">
                @if (premiumActive()) { ¡Bienvenid&#64; a Premium! }
                @else { Confirmando tu pago... }
              </h2>
              <p class="text-ink-400 text-sm mt-1">
                @if (premiumActive()) {
                  Tu plan está activo hasta el {{ expiresFormatted() }}. Ya puedes disfrutar todos los beneficios.
                } @else {
                  El pago suele confirmarse en menos de 30 segundos. Si no se actualiza, escríbenos.
                }
              </p>
              @if (premiumActive()) {
                <a mat-stroked-button routerLink="/me/services" class="mt-4">
                  <mat-icon>storefront</mat-icon> Ir a mis servicios
                </a>
              }
            </div>
          </div>
        </div>
      } @else if (returnStatus() === 'cancelled') {
        <div class="bg-cream-50 rounded-2xl border border-cream-300/40 p-5 mb-8 text-sm text-ink-600">
          Cancelaste el pago. Cuando quieras retomarlo, elige una opción abajo.
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- ═══════════ Resumen del plan ═══════════ -->
        <aside class="lg:col-span-1 order-2 lg:order-1">
          <div class="bg-cream-50 rounded-2xl shadow-soft border border-cream-300/40 p-6 sticky top-20">
            <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Resumen</p>
            <h2 class="font-serif text-2xl text-ink-800 mt-1">Pipin Premium</h2>

            <div class="mt-4 pb-4 border-b border-cream-300/60">
              <div class="font-serif text-4xl text-rose-700">
                {{ price | number }} <span class="text-base text-ink-400">CLP</span>
              </div>
              <p class="text-xs text-ink-400 mt-1">Cobro mensual · cancela cuando quieras</p>
            </div>

            <ul class="mt-5 space-y-2.5 text-sm text-ink-600">
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-sage-600 mt-0.5">verified</mat-icon>
                Badge "Verificad&#64;" en perfil y servicios
              </li>
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-sage-600 mt-0.5">star</mat-icon>
                Servicios marcados como "Destacado"
              </li>
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-sage-600 mt-0.5">unfold_more</mat-icon>
                Hasta 10 servicios simultáneos
              </li>
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-sage-600 mt-0.5">auto_awesome</mat-icon>
                Posición preferente en home
              </li>
              <li class="flex items-start gap-2">
                <mat-icon class="!text-base !w-5 !h-5 text-sage-600 mt-0.5">insights</mat-icon>
                Estadísticas de visitas
              </li>
            </ul>

            <p class="text-[11px] text-ink-400 italic mt-5">
              Pipin no procesa pagos entre usuarios. Esta suscripción es sólo para tu cuenta como proveedor.
            </p>
          </div>
        </aside>

        <!-- ═══════════ Métodos de pago ═══════════ -->
        <section class="lg:col-span-2 order-1 lg:order-2">
          <p class="text-xs uppercase tracking-[0.25em] text-sage-600">Paso 1 de 1</p>
          <h1 class="font-serif text-4xl md:text-5xl text-ink-800 mt-1">
            Elige cómo <span class="italic text-rose-600">pagar</span>.
          </h1>
          <p class="text-ink-400 mt-2">
            Activación inmediata vía pasarela. Manual tras confirmación si pagas por transferencia.
          </p>

          <div class="space-y-4 mt-8">

            <!-- TARJETA -->
            @if (hasCardOption()) {
              <article class="bg-cream-50 rounded-2xl shadow-soft border border-cream-300/40 p-6">
                <header class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                    <mat-icon>credit_card</mat-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-serif text-xl text-ink-800">Pago con tarjeta</h3>
                    <p class="text-sm text-ink-400">Crédito, débito o prepago. Activación inmediata.</p>
                  </div>
                  <span class="text-[10px] uppercase tracking-wider bg-sage-100 text-sage-700 px-2 py-1 rounded-full self-center hidden sm:inline">
                    Instantáneo
                  </span>
                </header>

                <div class="flex flex-wrap gap-2 mt-5">
                  @if (stripeUrl()) {
                    <a mat-flat-button color="primary" [href]="stripeUrl()" target="_blank" rel="noopener">
                      <mat-icon>open_in_new</mat-icon> Stripe
                    </a>
                  }
                  @if (mpUrl()) {
                    <a mat-flat-button color="primary" [href]="mpUrl()" target="_blank" rel="noopener">
                      <mat-icon>open_in_new</mat-icon> MercadoPago
                    </a>
                  }
                  @if (flowUrl()) {
                    <a mat-flat-button color="primary" [href]="flowUrl()" target="_blank" rel="noopener">
                      <mat-icon>open_in_new</mat-icon> Flow
                    </a>
                  }
                </div>
                <p class="text-[11px] text-ink-400 mt-3">
                  Te llevamos a la pasarela. Al pagar, tu Premium se activa automáticamente.
                </p>
              </article>
            } @else {
              <article class="bg-cream-100/60 rounded-2xl border-2 border-dashed border-cream-300 p-6 opacity-70">
                <header class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-full bg-cream-200 text-ink-400 flex items-center justify-center flex-shrink-0">
                    <mat-icon>credit_card</mat-icon>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-serif text-xl text-ink-700">Pago con tarjeta</h3>
                    <p class="text-sm text-ink-400">Pasarela aún no configurada. Usa transferencia o WhatsApp por ahora.</p>
                  </div>
                </header>
              </article>
            }

            <!-- TRANSFERENCIA -->
            <article class="bg-cream-50 rounded-2xl shadow-soft border border-cream-300/40 overflow-hidden">
              <header class="p-6 flex items-start gap-3 cursor-pointer" (click)="bankOpen.set(!bankOpen())">
                <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                  <mat-icon>account_balance</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-serif text-xl text-ink-800">Transferencia bancaria</h3>
                  <p class="text-sm text-ink-400">Activación manual tras confirmar comprobante (hasta 1h hábil).</p>
                </div>
                <mat-icon class="transition-transform text-ink-400"
                          [class.rotate-180]="bankOpen()">expand_more</mat-icon>
              </header>

              @if (bankOpen()) {
                <div class="px-6 pb-6">
                  <div class="bg-cream-100/60 rounded-xl p-4 text-sm space-y-2 font-mono">
                    <div class="flex justify-between gap-2">
                      <span class="text-ink-400">Banco</span>
                      <span class="text-ink-800 font-medium">{{ bank.bank }}</span>
                    </div>
                    <div class="flex justify-between gap-2">
                      <span class="text-ink-400">Tipo de cuenta</span>
                      <span class="text-ink-800 font-medium">{{ bank.accountType }}</span>
                    </div>
                    <div class="flex justify-between gap-2">
                      <span class="text-ink-400">N° de cuenta</span>
                      <button class="text-ink-800 font-medium underline decoration-dotted"
                              (click)="copy(bank.accountNumber)">{{ bank.accountNumber }}</button>
                    </div>
                    <div class="flex justify-between gap-2">
                      <span class="text-ink-400">RUT</span>
                      <button class="text-ink-800 font-medium underline decoration-dotted"
                              (click)="copy(bank.rut)">{{ bank.rut }}</button>
                    </div>
                    <div class="flex justify-between gap-2">
                      <span class="text-ink-400">Nombre</span>
                      <span class="text-ink-800 font-medium">{{ bank.name }}</span>
                    </div>
                    <div class="flex justify-between gap-2">
                      <span class="text-ink-400">Email</span>
                      <button class="text-ink-800 font-medium underline decoration-dotted"
                              (click)="copy(bank.email)">{{ bank.email }}</button>
                    </div>
                    <div class="flex justify-between gap-2 pt-2 border-t border-cream-300/60 mt-2">
                      <span class="text-ink-400">Monto</span>
                      <span class="text-rose-700 font-medium">{{ price | number }} CLP</span>
                    </div>
                  </div>
                  <p class="text-xs text-ink-400 mt-3">
                    Envía el comprobante al WhatsApp de soporte para activar tu Premium.
                  </p>
                  <a mat-stroked-button class="mt-3" [href]="confirmWaLink" target="_blank" rel="noopener">
                    <mat-icon>chat</mat-icon> Enviar comprobante por WhatsApp
                  </a>
                </div>
              }
            </article>

            <!-- WHATSAPP -->
            <article class="bg-cream-50 rounded-2xl shadow-soft border border-cream-300/40 p-6">
              <header class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     style="background:#25D366;color:#fff">
                  <mat-icon>chat</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-serif text-xl text-ink-800">Hablar directo por WhatsApp</h3>
                  <p class="text-sm text-ink-400">Te coordinamos el plan, te enviamos link de pago a medida.</p>
                </div>
              </header>
              <a mat-flat-button class="!bg-[#25D366] !text-white mt-5"
                 [href]="initialWaLink" target="_blank" rel="noopener">
                <mat-icon>chat</mat-icon> Abrir WhatsApp
              </a>
            </article>

          </div>

          <p class="text-[11px] text-ink-400 text-center mt-8">
            🔒 Pipin no almacena datos de tarjeta. El cobro lo procesa la pasarela elegida.
          </p>
        </section>
      </div>
    </div>
  `
})
export class PremiumCheckoutComponent implements OnInit {
  private auth = inject(AuthService);
  private profiles = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  bankOpen = signal(false);
  returnStatus = signal<'success' | 'cancelled' | null>(null);

  price       = environment.payments.monthlyPriceCLP;
  bank        = environment.payments.bankTransfer;
  waNumber    = environment.payments.whatsapp;

  // Perfil reactivo — para detectar cuando isPremium se activa
  private profile = toSignal(
    of(null).pipe(
      switchMap(() => {
        const u = this.auth.user();
        return u ? this.profiles.get(u.uid) : of(undefined);
      })
    ),
    { initialValue: undefined }
  );

  premiumActive = computed(() => !!this.profile()?.isPremium);

  expiresFormatted = computed(() => {
    const ts = this.profile()?.premiumExpiresAt as any;
    const d = ts?.toDate?.() ?? null;
    return d ? d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  });

  // Links de pasarela con UID e email del usuario inyectados
  stripeUrl = computed(() => this.appendParams(environment.payments.stripePaymentLink));
  mpUrl     = computed(() => this.appendParams(environment.payments.mercadoPagoLink, 'mp'));
  flowUrl   = computed(() => this.appendParams(environment.payments.flowLink, 'flow'));

  hasCardOption = computed(() => !!(this.stripeUrl() || this.mpUrl() || this.flowUrl()));

  initialWaLink = buildWhatsAppLink(
    this.waNumber,
    `Hola, soy ${this.auth.user()?.email || ''}. Quiero contratar Pipin Premium.`
  );

  confirmWaLink = buildWhatsAppLink(
    this.waNumber,
    `Hola, hice la transferencia de ${this.price.toLocaleString('es-CL')} CLP para Pipin Premium. Aquí va el comprobante:`
  );

  ngOnInit() {
    const status = this.route.snapshot.queryParamMap.get('status');
    if (status === 'success' || status === 'cancelled') {
      this.returnStatus.set(status);
    }
  }

  // Watch: cuando isPremium pasa a true tras "success", muestra confirmación
  private _watch = effect(() => {
    if (this.returnStatus() === 'success' && this.premiumActive()) {
      this.snack.open('¡Premium activado!', 'OK', { duration: 3000 });
    }
  });

  /**
   * Añade client_reference_id (uid) y prefilled_email al link de pasarela.
   * Stripe y MercadoPago aceptan estos parámetros para asociar el pago al usuario.
   */
  private appendParams(url: string, provider: 'stripe' | 'mp' | 'flow' = 'stripe'): string {
    if (!url) return '';
    const u = this.auth.user();
    if (!u) return url;
    try {
      const parsed = new URL(url);
      if (provider === 'mp') {
        parsed.searchParams.set('external_reference', u.uid);
      } else if (provider === 'flow') {
        parsed.searchParams.set('optional', u.uid);
      } else {
        parsed.searchParams.set('client_reference_id', u.uid);
        if (u.email) parsed.searchParams.set('prefilled_email', u.email);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.snack.open(`Copiado: ${text}`, 'OK', { duration: 1800 });
    } catch {
      this.snack.open('No se pudo copiar', 'OK', { duration: 2000 });
    }
  }
}
