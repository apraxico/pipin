import { Timestamp } from '@angular/fire/firestore';

export type PremiumPlan = 'free' | 'premium' | 'pro';

export interface Profile {
  uid: string;
  displayName: string;
  bio?: string;
  city?: string;
  age?: number;
  avatarUrl?: string;
  photos?: string[];
  whatsapp?: string;
  email?: string;
  // Premium / verificación
  isVerified?: boolean;
  isPremium?: boolean;
  plan?: PremiumPlan;
  premiumExpiresAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
