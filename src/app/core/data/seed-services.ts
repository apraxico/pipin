import { ServiceCategory } from '../models/service.model';

/**
 * Cada servicio referencia a un owner por `ownerSlug` (de seed-owners.ts).
 * Al hacer seed, el componente resuelve el slug y rellena
 * ownerUid / ownerName / ownerAvatar / featured con datos del SeedOwner.
 */
export interface SeedService {
  ownerSlug: string;          // referencia al SeedOwner
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
}

export const SEED_SERVICES: SeedService[] = [
  {
    ownerSlug: 'camila',
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
    whatsapp: '+56932842677',
    whatsappMessage: 'Hola, vi tu publicación de conversaciones en Pipin y me interesa.',
    published: true
  },
  {
    ownerSlug: 'soledad',
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
    published: true
  },
  {
    ownerSlug: 'andres',
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
    published: true
  },
  {
    ownerSlug: 'valentina',
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
    published: true
  },
  {
    ownerSlug: 'felipe',
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
    published: true
  },
  {
    ownerSlug: 'rodrigo',
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
    published: true
  },
  {
    ownerSlug: 'mariajose',
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
    published: true
  },
  {
    ownerSlug: 'paula',
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
    published: true
  },
  {
    ownerSlug: 'isidora',
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
    published: true
  },

  // ────────────── Catálogo "candente" — masajes & compañía con onda íntima ──────────────
  {
    ownerSlug: 'antonia',
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
    published: true
  },
  {
    ownerSlug: 'lorenza',
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
    published: true
  },
  {
    ownerSlug: 'renata',
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
    published: true
  },
  {
    ownerSlug: 'valentina',
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
    published: true
  },
  {
    ownerSlug: 'isidora',
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
    published: true
  },
  {
    ownerSlug: 'renata',
    title: 'Compañera de viaje · fines de semana',
    description:
      'Te acompaño a tu destino de fin de semana: playa, montaña, escapada urbana. Conversación, fotos, planes y química real. Cubres traslado y estadía. Coordinar con anticipación.',
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
    published: true
  },

  // ────────────── Tanda variada — más ciudades y categorías ──────────────
  {
    ownerSlug: 'javiera',
    title: 'Terapia psicológica online · adolescentes',
    description:
      'Psicóloga acreditada, especialista en adolescentes y jóvenes adultos. Trabajo ansiedad, autoestima, manejo de pantallas y vínculos. Modalidad online con tutores incluidos en seguimiento.',
    category: 'psicologia',
    price: 28000,
    currency: 'CLP',
    durationMinutes: 50,
    city: 'Online',
    photos: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80'
    ],
    whatsapp: '+56922556677',
    whatsappMessage: 'Hola, quiero agendar terapia para mi hijo/a.',
    published: true
  },
  {
    ownerSlug: 'mariajose',
    title: 'Conversación café & libro · sábados',
    description:
      'Para personas que necesitan un rato de conversación lenta. Nos juntamos en una cafetería de barrio, hablamos de lo que tengas en mente. Sin pauta, sin reloj apurando. 90 min.',
    category: 'conversacion',
    price: 14000,
    currency: 'CLP',
    durationMinutes: 90,
    city: 'Valdivia',
    photos: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80',
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900&q=80'
    ],
    whatsapp: '+56944336688',
    whatsappMessage: 'Hola, me interesa juntarme a conversar.',
    published: true
  },
  {
    ownerSlug: 'andres',
    title: 'Masaje en silla · oficinas y eventos',
    description:
      'Vamos a tu oficina con silla ergonómica y aceites. Masaje de 20 minutos por persona enfocado en cuello, hombros y espalda alta. Mínimo 4 personas, ideal para wellness corporativo.',
    category: 'masajes',
    price: 12000,
    currency: 'CLP',
    durationMinutes: 20,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80'
    ],
    whatsapp: '+56998877665',
    whatsappMessage: 'Hola, quiero cotizar masajes para mi oficina.',
    published: true
  },
  {
    ownerSlug: 'matias',
    title: 'Coaching financiero personal · ordena tus números',
    description:
      'Te ayudo a ordenar tus gastos, presupuesto y deudas. Plan en 4 sesiones con herramientas concretas: planilla, alertas y revisión mensual. Ideal si vives al día y quieres salir de eso.',
    category: 'coaching',
    price: 30000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Online',
    photos: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80'
    ],
    whatsapp: '+56977443322',
    whatsappMessage: 'Hola, quiero ordenar mis finanzas.',
    published: true
  },
  {
    ownerSlug: 'paula',
    title: 'Acompañamiento para adulto mayor · tarde de domingo',
    description:
      'Visita semanal a tu familiar mayor: conversación, lectura, paseo si está habilitado. Reportes con foto al cierre. Cobertura Providencia, Ñuñoa, Las Condes. Mínimo 2 horas.',
    category: 'compania',
    price: 25000,
    currency: 'CLP',
    durationMinutes: 120,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1447710441604-5bdc41bc6517?w=900&q=80',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=900&q=80'
    ],
    whatsapp: '+56933112244',
    whatsappMessage: 'Hola, necesito acompañamiento para mi mamá/papá.',
    published: true
  },
  {
    ownerSlug: 'rodrigo',
    title: 'Masaje shiatsu japonés tradicional',
    description:
      'Técnica de presión sobre puntos de energía con ropa cómoda — no usa aceites. Ideal para dolor de espalda, dolor de cabeza tensional y bloqueos. Recibo en consulta privada con tatami.',
    category: 'masajes',
    price: 26000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Concepción',
    photos: [
      'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=900&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80'
    ],
    whatsapp: '+56922779944',
    whatsappMessage: 'Hola, me interesa el shiatsu.',
    published: true
  },
  {
    ownerSlug: 'soledad',
    title: 'Sesión de psicología perinatal',
    description:
      'Acompañamiento a embarazadas y madres en postparto. Trabajo ansiedad, miedo al parto, lactancia, vínculo. Modalidad online o presencial. Atiendo también a parejas.',
    category: 'psicologia',
    price: 35000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=900&q=80',
      'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=900&q=80'
    ],
    whatsapp: '+56944112233',
    whatsappMessage: 'Hola, estoy embarazada y me interesa agendar.',
    published: true
  },
  {
    ownerSlug: 'aurora',
    title: 'Tarot íntimo y conversación · al atardecer',
    description:
      'Tirada de tarot con conversación profunda. No es predicción, es una excusa para mirar lo que está pasando. Atiendo en mi terraza con vista, té y manta. Mayor 18.',
    category: 'otros',
    price: 22000,
    currency: 'CLP',
    durationMinutes: 75,
    city: 'Viña del Mar',
    photos: [
      'https://images.unsplash.com/photo-1572701695810-b1ce5cd58fe5?w=900&q=80',
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=900&q=80'
    ],
    whatsapp: '+56988663311',
    whatsappMessage: 'Hola, quiero una tirada de tarot.',
    published: true
  },
  {
    ownerSlug: 'matias',
    title: 'Coaching para emprendedores · primeros 90 días',
    description:
      'Mentor con 12 años en startups (ex-fundador). Te acompaño a validar idea, fijar OKRs, primeras ventas y modelo. Plan de 6 sesiones con tareas semanales. Sólo proyectos serios.',
    category: 'coaching',
    price: 60000,
    currency: 'CLP',
    durationMinutes: 60,
    city: 'Online',
    photos: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80',
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&q=80'
    ],
    whatsapp: '+56955889911',
    whatsappMessage: 'Hola, estoy lanzando un proyecto y necesito coaching.',
    published: true
  },
  {
    ownerSlug: 'antonia',
    title: 'Pintura corporal artística · sesión privada',
    description:
      'Body paint con pigmentos hipoalergénicos. Sesión privada con fotografía de cierre incluida. Diseño se acuerda antes. Ideal regalo, aniversario o experiencia distinta. Mayores de 21.',
    category: 'otros',
    price: 85000,
    currency: 'CLP',
    durationMinutes: 180,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=900&q=80',
      'https://images.unsplash.com/photo-1530021232320-687d8e3dba54?w=900&q=80'
    ],
    whatsapp: '+56933664422',
    whatsappMessage: 'Hola, me interesa una sesión de body paint.',
    published: true
  },
  {
    ownerSlug: 'valentina',
    title: 'Compañía discreta para almuerzo de negocios',
    description:
      'Acompañante elegante para almuerzo o reunión social formal. Buena conversación, presentación impecable. Atiendo zona oriente y centro. Cobertura horario laboral.',
    category: 'compania',
    price: 75000,
    currency: 'CLP',
    durationMinutes: 120,
    city: 'Santiago',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80',
      'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=900&q=80'
    ],
    whatsapp: '+56977552288',
    whatsappMessage: 'Hola, necesito compañía para un almuerzo.',
    published: true
  }
];
