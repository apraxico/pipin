import { Profile } from '../models/profile.model';

/**
 * Perfiles falsos para poblar el catálogo con dueños diversos.
 *
 * `uid` es un identificador sintético (no es un Firebase Auth UID real).
 * Las publicaciones de seed referencian a estos owners por `slug`,
 * y al crearse se les copia `ownerUid = uid` para que la página pública
 * `/u/:uid` funcione.
 *
 * NOTA: Requiere reglas de Firestore que permitan al usuario logueado
 * escribir cualquier doc en /profiles y /services. Si tus reglas son
 * estrictas (request.auth.uid == uid), sólo se creará el perfil que
 * coincida con tu uid real — el resto fallará silenciosamente.
 */
export interface SeedOwner extends Omit<Profile, 'createdAt' | 'updatedAt'> {
  slug: string;        // referencia interna usada por seed-services
  isVerified?: boolean;
  isPremium?: boolean;
}

export const SEED_OWNERS: SeedOwner[] = [
  {
    slug: 'camila',
    uid: 'seed-camila-rivera',
    displayName: 'Camila Rivera',
    bio:
      'Psicóloga clínica y terapeuta corporal. Espacio cálido, profesional y confidencial. ' +
      '8 años acompañando procesos personales con enfoque cognitivo-corporal.',
    city: 'Santiago, Chile',
    age: 32,
    whatsapp: '+56932842677',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Camila%20Rivera&backgroundColor=fce7f3',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80',
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=900&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80',
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80'
    ],
    isVerified: true,
    isPremium: true
  },
  {
    slug: 'soledad',
    uid: 'seed-soledad-pizarro',
    displayName: 'Dra. Soledad Pizarro',
    bio:
      'Psicóloga clínica online. Enfoque cognitivo-conductual, ansiedad, estrés y vínculos. ' +
      'Atiendo adultos y jóvenes desde 2016. Sesiones por videollamada con seguimiento.',
    city: 'Valparaíso',
    age: 38,
    whatsapp: '+56987654321',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Soledad%20Pizarro&backgroundColor=c8d3bf',
    photos: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80'
    ],
    isVerified: true
  },
  {
    slug: 'andres',
    uid: 'seed-andres-munoz',
    displayName: 'Andrés Muñoz',
    bio:
      'Masajista certificado. Especialista en descontracturante con aceites esenciales. ' +
      'Consulta privada con camilla profesional, música ambiente y aromaterapia.',
    city: 'Santiago',
    age: 35,
    whatsapp: '+56911223344',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Andres%20Munoz&backgroundColor=ecc7c0',
    photos: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80'
    ],
    isVerified: true
  },
  {
    slug: 'valentina',
    uid: 'seed-valentina-aguirre',
    displayName: 'Valentina Aguirre',
    bio:
      'Acompañamiento discreto para cenas y eventos. Conversación culta, presencia agradable, ' +
      'máxima reserva. Vestimenta formal disponible. Sólo coordino con anticipación.',
    city: 'Santiago',
    age: 29,
    whatsapp: '+56933445566',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Valentina%20Aguirre&backgroundColor=f5e3df',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80'
    ],
    isPremium: true
  },
  {
    slug: 'felipe',
    uid: 'seed-felipe-gallardo',
    displayName: 'Felipe Gallardo',
    bio:
      'Coach de vida y carrera. 10 años trabajando con personas que necesitan ordenar metas. ' +
      'Sesiones estructuradas con tareas semanales y seguimiento entre sesiones.',
    city: 'Online',
    age: 41,
    whatsapp: '+56955667788',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Felipe%20Gallardo&backgroundColor=c8d3bf',
    photos: [
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80'
    ]
  },
  {
    slug: 'rodrigo',
    uid: 'seed-rodrigo-tapia',
    displayName: 'Rodrigo Tapia',
    bio:
      'Masaje deportivo y descontracturante profundo. Trabajo con corredores, ciclistas y ' +
      'personas con tensión muscular crónica. Consulta en Ñuñoa.',
    city: 'Santiago',
    age: 37,
    whatsapp: '+56977889900',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Rodrigo%20Tapia&backgroundColor=ecc7c0',
    photos: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=900&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80'
    ]
  },
  {
    slug: 'mariajose',
    uid: 'seed-mariajose-lara',
    displayName: 'María José Lara',
    bio:
      'No soy psicóloga, soy alguien que sabe escuchar. Si necesitas contar algo sin tener ' +
      'que justificarlo, este espacio es para ti. Online o presencial.',
    city: 'Online',
    age: 28,
    whatsapp: '+56922334455',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=MariaJose%20Lara&backgroundColor=f5e3df',
    photos: [
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=80'
    ]
  },
  {
    slug: 'paula',
    uid: 'seed-paula-herrera',
    displayName: 'Paula Herrera',
    bio:
      'Coach emocional especializada en parejas. Espacio neutral para reordenar la conversación. ' +
      'No reemplaza terapia, ayuda a destrabar conflictos puntuales en pocas sesiones.',
    city: 'Online',
    age: 36,
    whatsapp: '+56944556677',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Paula%20Herrera&backgroundColor=c8d3bf',
    photos: [
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=900&q=80',
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=900&q=80'
    ]
  },
  {
    slug: 'isidora',
    uid: 'seed-isidora-vergara',
    displayName: 'Isidora Vergara',
    bio:
      'Rituales de aromaterapia y masaje corporal. Sala con luz tenue, velas y música cuidada. ' +
      'Cada sesión es un viaje sensorial completo, no sólo un masaje.',
    city: 'Santiago',
    age: 31,
    whatsapp: '+56966778899',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Isidora%20Vergara&backgroundColor=f5e3df',
    photos: [
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80',
      'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=900&q=80',
      'https://images.unsplash.com/photo-1532926381893-7542290edf1d?w=900&q=80'
    ],
    isPremium: true
  },
  {
    slug: 'antonia',
    uid: 'seed-antonia-delpiano',
    displayName: 'Antonia Del Piano',
    bio:
      'Masajista holística con enfoque sensorial. Sesiones íntimas a piel descubierta en sala ' +
      'oscura iluminada con velas. Sólo mayores de 18. Discreción absoluta.',
    city: 'Santiago',
    age: 30,
    whatsapp: '+56988776655',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Antonia%20DelPiano&backgroundColor=f5e3df',
    photos: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80'
    ],
    isVerified: true,
    isPremium: true
  },
  {
    slug: 'lorenza',
    uid: 'seed-lorenza-fuentes',
    displayName: 'Lorenza Fuentes',
    bio:
      'Practicante de masaje tántrico tradicional. Ritual de presencia consciente: respiración, ' +
      'contacto suave y prolongado. Viaje íntimo de conexión, sólo +21.',
    city: 'Santiago',
    age: 34,
    whatsapp: '+56922118855',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Lorenza%20Fuentes&backgroundColor=ecc7c0',
    photos: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=900&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80'
    ]
  },
  {
    slug: 'renata',
    uid: 'seed-renata-cortes',
    displayName: 'Renata Cortés',
    bio:
      'Acompañamiento premium para cenas privadas y veladas en hotel boutique. ' +
      'Conversación culta, química real, vestimenta a medida del evento. Sólo perfiles serios.',
    city: 'Santiago',
    age: 27,
    whatsapp: '+56988224477',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Renata%20Cortes&backgroundColor=ecc7c0',
    photos: [
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=900&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80'
    ],
    isPremium: true
  },
  {
    slug: 'javiera',
    uid: 'seed-javiera-navarro',
    displayName: 'Dra. Javiera Navarro',
    bio:
      'Psicóloga especialista en adolescentes y jóvenes adultos. Trabajo ansiedad, autoestima, ' +
      'pantallas y vínculos. Modalidad online con tutores incluidos en seguimiento.',
    city: 'Online',
    age: 33,
    whatsapp: '+56922556677',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Javiera%20Navarro&backgroundColor=c8d3bf',
    photos: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80'
    ],
    isVerified: true
  },
  {
    slug: 'matias',
    uid: 'seed-matias-zarate',
    displayName: 'Matías Zárate',
    bio:
      'Mentor de emprendedores. Ex-fundador con 12 años en startups. Te acompaño a validar idea, ' +
      'fijar OKRs, primeras ventas y modelo. Plan de 6 sesiones con tareas semanales.',
    city: 'Online',
    age: 39,
    whatsapp: '+56955889911',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Matias%20Zarate&backgroundColor=c8d3bf',
    photos: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80',
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&q=80'
    ]
  },
  {
    slug: 'aurora',
    uid: 'seed-aurora-leyton',
    displayName: 'Aurora Leyton',
    bio:
      'Tarot íntimo y conversación profunda. No es predicción, es excusa para mirar lo que ' +
      'está pasando. Atiendo en mi terraza con vista al mar, té y manta. Mayores de 18.',
    city: 'Viña del Mar',
    age: 42,
    whatsapp: '+56988663311',
    avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Aurora%20Leyton&backgroundColor=f5e3df',
    photos: [
      'https://images.unsplash.com/photo-1572701695810-b1ce5cd58fe5?w=900&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=900&q=80'
    ]
  }
];

export function ownerBySlug(slug: string): SeedOwner | undefined {
  return SEED_OWNERS.find(o => o.slug === slug);
}
