/**
 * Construye un enlace wa.me con número (sólo dígitos) y mensaje codificado.
 * Acepta números con +, espacios, guiones — los limpia.
 */
export function buildWhatsAppLink(rawPhone: string, message?: string): string {
  const digits = (rawPhone || '').replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
