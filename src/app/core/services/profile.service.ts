import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private fs = inject(Firestore);

  get(uid: string): Observable<Profile | undefined> {
    return docData(doc(this.fs, `profiles/${uid}`), { idField: 'uid' }) as Observable<Profile | undefined>;
  }

  async upsert(uid: string, data: Partial<Profile>): Promise<void> {
    const ref = doc(this.fs, `profiles/${uid}`);
    // Firestore rechaza `undefined`. Limpiamos antes de escribir.
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    await setDoc(
      ref,
      {
        ...clean,
        uid,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt ?? serverTimestamp()
      },
      { merge: true }
    );
  }
}
