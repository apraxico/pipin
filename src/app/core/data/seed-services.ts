import { ServiceCategory } from '../models/service.model';

export interface SeedService {
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: 'CLP' | 'USD' | 'EUR' | 'ARS' | 'MXN';
  durationMinutes: number;
  city: string;
  photos: string[];
  whatsapp: string;
  whatsappMessage: string;
  published: boolean;
  ownerName: string;
  ownerAvatar: string;
}

// Imágenes editoriales de Unsplash con onda spa / íntimo / luz cálida.
// El campo ownerUid se llena con el uid del usuario logueado al hacer seed.
export const SEED_SERVICES: SeedService[] = [
  {
    title: 'Conversaciones íntimas a la luz de una vela',
    description:
      'Espacio cálido para hablar, escuchar y compartir. Vino, té y conversación pausada. Sin juicios, en absoluta confidencialidad. Ideal si necesitas desahogarte o tener compañía.',
    category: 'conversacion',
    price: 18000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80',
      'https://images.unsplash.com/photo-1530021232320-687d8e3dba54?w=900&q=80'
    ],
    whatsapp: '+56912345678',
    whatsappMessage: 'Hola, vi tu publicación de conversaciones en Pipin y me interesa.',
    published: true,
    ownerName: 'Camila R.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Camila%20R&backgroundColor=ecc7c0'
  },
  {
    title: 'Sesión psicológica online · enfoque cognitivo',
    description:
      'Psicóloga clínica con 8 años de experiencia. Trabajo ansiedad, estrés, autoestima y vínculos. Modalidad online por videollamada, con seguimiento entre sesiones.',
    category: 'psicologia',
    price: 30000,
    currency: 'CLP',
    durationMinutes: 50,
    city: 'Valparaíso',
    photos: [
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=900&q=80',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&q=80'
    ],
    whatsapp: '+56987654321',
    whatsappMessage: 'Hola, quiero agendar una sesión psicológica.',
    published: true,
    ownerName: 'Dra. Soledad P.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Soledad%20P&backgroundColor=c8d3bf'
  },
  {
    title: 'Masaje relajante con aceites cálidos · 60 min',
    description:
      'Masaje descontracturante con aceites esenciales tibios, música ambiente y aromaterapia. Atiendo en consulta privada con camilla profesional. Reservar con un día de anticipación.',
    category: 'masajes',
    price: 28000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80'
    ],
    whatsapp: '+56911223344',
    whatsappMessage: 'Hola, me interesa agendar un masaje.',
    published: true,
    ownerName: 'Andrés M.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Andres%20M&backgroundColor=ecc7c0'
  },
  {
    title: 'Compañía elegante para cenas y eventos',
    description:
      'Acompañamiento discreto y elegante para cenas, eventos corporativos o salidas. Conversación culta, presencia agradable y máxima reserva. Vestimenta formal disponible según ocasión.',
    category: 'compania',
    price: 90000,
    currency: 'CLP',
    durationMinutes: 180,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=900&q=80'
    ],
    whatsapp: '+56933445566',
    whatsappMessage: 'Hola, me gustaría saber más sobre tu servicio de compañía.',
    published: true,
    ownerName: 'Valentina A.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Valentina%20A&backgroundColor=f5e3df'
  },
  {
    title: 'Coaching de vida · sesión 1 a 1',
    description:
      'Te acompaño a tomar decisiones, ordenar prioridades y avanzar en metas personales o profesionales. Sesiones estructuradas con tareas semanales y seguimiento por WhatsApp.',
    category: 'coaching',
    price: 22000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Online',
    photos: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80',
      'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=900&q=80'
    ],
    whatsapp: '+56955667788',
    whatsappMessage: 'Hola, me interesa una sesión de coaching.',
    published: true,
    ownerName: 'Felipe G.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Felipe%20G&backgroundColor=c8d3bf'
  },
  {
    title: 'Masaje descontracturante deportivo',
    description:
      'Para deportistas y personas con tensión muscular crónica. Técnica de presión profunda + estiramientos asistidos. Consulta de Ñuñoa, camilla profesional, toallas tibias.',
    category: 'masajes',
    price: 32000,
    currency: 'CLP',
    durationMinutes: 75,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=900&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80'
    ],
    whatsapp: '+56977889900',
    whatsappMessage: 'Hola, quiero agendar un masaje deportivo.',
    published: true,
    ownerName: 'Rodrigo T.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Rodrigo%20T&backgroundColor=ecc7c0'
  },
  {
    title: 'Hablemos sin filtros · escucha activa',
    description:
      'No soy psicólogo, soy alguien que sabe escuchar. Si necesitas contar algo sin tener que justificarlo, este espacio es para ti. Vía videollamada o llamada de audio.',
    category: 'conversacion',
    price: 9000,
    currency: 'CLP',
    durationMinutes: 45,
    city: 'Online',
    photos: [
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=80'
    ],
    whatsapp: '+56922334455',
    whatsappMessage: 'Hola, quiero conversar contigo.',
    published: true,
    ownerName: 'María José L.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=MariaJose%20L&backgroundColor=f5e3df'
  },
  {
    title: 'Coaching emocional · pareja en crisis',
    description:
      'Espacio neutral para parejas que necesitan reordenar la conversación. No reemplaza terapia, pero ayuda a destrabar conflictos puntuales en 1 a 3 sesiones.',
    category: 'coaching',
    price: 45000,
    currency: 'CLP',
    durationMinutes: 90,
    city: 'Online',
    photos: [
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=900&q=80',
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=900&q=80'
    ],
    whatsapp: '+56944556677',
    whatsappMessage: 'Hola, mi pareja y yo necesitamos una sesión.',
    published: true,
    ownerName: 'Paula H.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Paula%20H&backgroundColor=c8d3bf'
  },
  {
    title: 'Ritual de aromaterapia + masaje · 90 min',
    description:
      'Experiencia completa: pediluvio con sales, masaje corporal con aceites de lavanda y rosa, infusión de cierre. Sala con luz tenue, velas y música en vivo grabada.',
    category: 'masajes',
    price: 48000,
    currency: 'CLP',
    durationMinutes: 90,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80',
      'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=900&q=80',
      'https://images.unsplash.com/photo-1532926381893-7542290edf1d?w=900&q=80'
    ],
    whatsapp: '+56966778899',
    whatsappMessage: 'Hola, me interesa el ritual de aromaterapia.',
    published: true,
    ownerName: 'Isidora V.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Isidora%20V&backgroundColor=f5e3df'
  },

  // ────────────── Catálogo "candente" — masajes & compañía con onda íntima ──────────────
  {
    title: 'Masaje sensorial a piel descubierta · luz tenue',
    description:
      'Experiencia íntima de cuerpo completo. Aceites tibios, música suave, sala oscura iluminada sólo con velas. Pensado para soltar el cuerpo y entregar todos los sentidos. Mayores de 18.',
    category: 'masajes',
    price: 55000,
    currency: 'CLP',
    durationMinutes: 75,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80'
    ],
    whatsapp: '+56988776655',
    whatsappMessage: 'Hola, me interesa el masaje sensorial.',
    published: true,
    ownerName: 'Antonia D.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Antonia%20D&backgroundColor=f5e3df'
  },
  {
    title: 'Masaje tántrico · despertar de la energía',
    description:
      'Ritual de presencia consciente que trabaja respiración, contacto suave y prolongado. No es terapéutico ni sexual, es un viaje íntimo de conexión. Sólo personas mayores de 21 años.',
    category: 'masajes',
    price: 70000,
    currency: 'CLP',
    durationMinutes: 90,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80'
    ],
    whatsapp: '+56922118855',
    whatsappMessage: 'Hola, quiero saber más del masaje tántrico.',
    published: true,
    ownerName: 'Lorenza F.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Lorenza%20F&backgroundColor=ecc7c0'
  },
  {
    title: 'Compañía íntima · cenas privadas y after',
    description:
      'Acompañamiento elegante y reservado para cenas, copas o veladas en hotel boutique. Conversación culta, química real, vestimenta a medida del evento. Discreción absoluta.',
    category: 'compania',
    price: 150000,
    currency: 'CLP',
    durationMinutes: 240,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=900&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80'
    ],
    whatsapp: '+56988224477',
    whatsappMessage: 'Hola, quiero saber más sobre tu disponibilidad.',
    published: true,
    ownerName: 'Renata C.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Renata%20C&backgroundColor=ecc7c0'
  },
  {
    title: 'Encuentro VIP a domicilio · hotel o departamento',
    description:
      'Servicio premium con disponibilidad nocturna. Llego donde me indiques en zona oriente de Santiago. Encuentro íntimo, sin apuros, con todo lo necesario para una velada inolvidable.',
    category: 'compania',
    price: 200000,
    currency: 'CLP',
    durationMinutes: 180,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=900&q=80',
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=900&q=80'
    ],
    whatsapp: '+56977665544',
    whatsappMessage: 'Hola, me interesa tu servicio VIP a domicilio.',
    published: true,
    ownerName: 'Macarena S.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Macarena%20S&backgroundColor=f5e3df'
  },
  {
    title: 'Masaje corporal en pareja · vela y champagne',
    description:
      'Sesión privada para dos. Pediluvio, masaje espalda y piernas con aceites, copa de espumante y ambiente íntimo. Ideal aniversario o noche especial.',
    category: 'masajes',
    price: 90000,
    currency: 'CLP',
    durationMinutes: 120,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80'
    ],
    whatsapp: '+56955443322',
    whatsappMessage: 'Hola, queremos reservar el masaje en pareja.',
    published: true,
    ownerName: 'Estudio Brasa',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Estudio%20Brasa&backgroundColor=ecc7c0'
  },
  {
    title: 'Compañera de viaje · fines de semana',
    description:
      'Te acompaño a tu destino de fin de semana: playa, montaña, escapada urbana. Conversación, fotos, planes y química real. Cubres traslado y estadía. Disponibilidad reservar con anticipación.',
    category: 'compania',
    price: 350000,
    currency: 'CLP',
    durationMinutes: 2880,
    city: 'Nacional',
    photos: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80'
    ],
    whatsapp: '+56933221100',
    whatsappMessage: 'Hola, quiero planificar una escapada contigo.',
    published: true,
    ownerName: 'Florencia M.',
    ownerAvatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Florencia%20M&backgroundColor=f5e3df'
  }
];
