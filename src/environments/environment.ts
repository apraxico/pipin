export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDWD5P0-Wp1BGWDkv2bPKaRIqAPaV5A4J8',
    authDomain: 'private-service-958f7.firebaseapp.com',
    projectId: 'private-service-958f7',
    storageBucket: 'private-service-958f7.firebasestorage.app',
    messagingSenderId: '955086892923',
    appId: '1:955086892923:web:539ca8d5d903b614ab57de'
  },
  // ─── Pagos ─── Pega tu link de Stripe/MercadoPago cuando lo tengas.
  // Mientras estén vacíos, la opción no aparece en el checkout.
  payments: {
    stripePaymentLink:       '',    // ej. 'https://buy.stripe.com/...'
    mercadoPagoLink:         '',    // ej. 'https://mpago.la/...'
    flowLink:                '',    // ej. 'https://www.flow.cl/btn.php?token=...'
    bankTransfer: {
      bank:                  'Banco Estado',
      accountType:           'Cuenta Vista',
      accountNumber:         '00 000 000 0000',
      rut:                   '12.345.678-9',
      name:                  'Tu Nombre',
      email:                 'pagos@pipin.cl'
    },
    whatsapp:                '+56932842677',     // tu número de soporte para premium
    monthlyPriceCLP:         8990
  },
  // ─── Backend unificado (pipin-backend) ───
  // Sirve para storage de imágenes y endpoints admin.
  // Si dejas baseUrl vacío, el front cae a Firebase Storage / WhatsApp.
  backend: {
    baseUrl: '',                              // ej. 'https://api.tudominio.com'
    apiKey:  ''                               // misma API_KEY del .env del backend
  }
};
