export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyDWD5P0-Wp1BGWDkv2bPKaRIqAPaV5A4J8',
    authDomain: 'private-service-958f7.firebaseapp.com',
    projectId: 'private-service-958f7',
    storageBucket: 'private-service-958f7.firebasestorage.app',
    messagingSenderId: '955086892923',
    appId: '1:955086892923:web:539ca8d5d903b614ab57de'
  },
  payments: {
    stripePaymentLink:       '',
    mercadoPagoLink:         '',
    flowLink:                '',
    bankTransfer: {
      bank:                  'Banco Estado',
      accountType:           'Cuenta Vista',
      accountNumber:         '00 000 000 0000',
      rut:                   '12.345.678-9',
      name:                  'Tu Nombre',
      email:                 'pagos@pipin.cl'
    },
    whatsapp:                '+56932842677',
    monthlyPriceCLP:         8990
  }
};
