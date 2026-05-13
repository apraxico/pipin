import { Profile } from '../models/profile.model';

// Datos de muestra para tu propio perfil (uid se inyecta en runtime).
export const SEED_PROFILE: Omit<Profile, 'uid' | 'createdAt' | 'updatedAt'> = {
  displayName: 'Camila Rivera',
  bio:
    'Psicóloga clínica y terapeuta corporal. Ofrezco un espacio cálido, ' +
    'profesional y confidencial. Más de 8 años acompañando procesos personales.',
  city: 'Santiago, Chile',
  age: 32,
  whatsapp: '+56932842677',
  avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Camila%20Rivera&backgroundColor=fce7f3'
};
