import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { buildWhatsAppLink } from '../../core/utils/whatsapp.util';

@Component({
  selector: 'app-premium-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, MatSnackBarModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <a routerLink="/" class="text-sm text-ink-400 inline-flex items-center gap-1 mb-6 hover:text-rose-700">
        <mat-icon class="!text-base !w-4 !h-4">arrow_back</mat-icon> Volver
      </a>

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
            Tres formas. Cualquiera te activa el plan al instante o tras confirmación rápida.
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
                    <p class="text-sm text-ink-400">Crédito, débito o prepago. Procesado en pasarela segura.</p>
                  </div>
                  <span class="text-[10px] uppercase tracking-wider bg-sage-100 text-sage-700 px-2 py-1 rounded-full self-center hidden sm:inline">
                    Instantáneo
                  </span>
                </header>

                <div class="flex flex-wrap gap-2 mt-5 pl-0 sm:pl-15">
                  @if (stripeLink) {
                    <a mat-flat-button color="primary" [href]="stripeLink" target="_blank" rel="noopener">
                      <mat-icon>open_in_new</mat-icon> Stripe
                    </a>
                  }
                  @if (mpLink) {
                    <a mat-flat-button color="primary" [href]="mpLink" target="_blank" rel="noopener">
                      <mat-icon>open_in_new</mat-icon> MercadoPago
                    </a>
                  }
                  @if (flowLink) {
                    <a mat-flat-button color="primary" [href]="flowLink" target="_blank" rel="noopener">
                      <mat-icon>open_in_new</mat-icon> Flow
                    </a>
                  }
                </div>
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
                  <p class="text-sm text-ink-400">Sin comisiones. Activación tras confirmación (hasta 1h hábil).</p>
                </div>
                <mat-icon class="transition-transform text-ink-400"
                          [class.rotate-180]="bankOpen()">expand_more</mat-icon>
              </header>

              @if (bankOpen()) {
                <div class="px-6 pb-6 pl-6 sm:pl-21">
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
export class PremiumCheckoutComponent {
  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);

  bankOpen = signal(false);

  price       = environment.payments.monthlyPriceCLP;
  bank        = environment.payments.bankTransfer;
  stripeLink  = environment.payments.stripePaymentLink;
  mpLink      = environment.payments.mercadoPagoLink;
  flowLink    = environment.payments.flowLink;
  waNumber    = environment.payments.whatsapp;

  hasCardOption = computed(() => !!(this.stripeLink || this.mpLink || this.flowLink));

  initialWaLink = buildWhatsAppLink(
    this.waNumber,
    `Hola, soy ${this.auth.user()?.email || ''}. Quiero contratar Pipin Premium.`
  );

  confirmWaLink = buildWhatsAppLink(
    this.waNumber,
    `Hola, hice la transferencia de ${this.price.toLocaleString('es-CL')} CLP para Pipin Premium. Aquí va el comprobante:`
  );

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.snack.open(`Copiado: ${text}`, 'OK', { duration: 1800 });
    } catch {
      this.snack.open('No se pudo copiar', 'OK', { duration: 2000 });
    }
  }
}
