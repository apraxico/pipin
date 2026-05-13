import { Timestamp } from '@angular/fire/firestore';

export type ServiceCategory =
  | 'conversacion'
  | 'psicologia'
  | 'masajes'
  | 'compania'
  | 'coaching'
  | 'otros';

export interface ServiceItem {
  id?: string;
  ownerUid: string;
  ownerName?: string;
  ownerAvatar?: string;
  ownerVerified?: boolean;   // copia denormalizada del perfil al crear
  featured?: boolean;        // destacado (premium)
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: 'CLP' | 'USD' | 'EUR' | 'ARS' | 'MXN';
  durationMinutes?: number;
  city?: string;
  photos: string[];
  whatsapp: string;
  whatsappMessage?: string;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const CATEGORIES: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: 'conversacion', label: 'Conversación', icon: 'chat_bubble' },
  { value: 'psicologia',   label: 'Psicología',   icon: 'psychology' },
  { value: 'masajes',      label: 'Masajes',      icon: 'spa' },
  { value: 'compania',     label: 'Compañía',     icon: 'favorite' },
  { value: 'coaching',     label: 'Coaching',     icon: 'self_improvement' },
  { value: 'otros',        label: 'Otros',        icon: 'more_horiz' }
];
