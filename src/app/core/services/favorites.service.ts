import { inject, Injectable, computed } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  updateDoc
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from './auth.service';

interface FavoritesDoc {
  uid: string;
  serviceIds: string[];
  updatedAt?: any;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private fs = inject(Firestore);
  private auth = inject(AuthService);

  // Doc reactivo: reacciona a cambios de usuario Y a cambios en Firestore.
  private user$ = toObservable(this.auth.user);
  private doc$: Observable<FavoritesDoc | undefined> = this.user$.pipe(
    switchMap(u => {
      if (!u) return of(undefined);
      return docData(doc(this.fs, `userFavorites/${u.uid}`)) as Observable<FavoritesDoc | undefined>;
    })
  );

  ids = toSignal(this.doc$, { initialValue: undefined as FavoritesDoc | undefined });

  /** Set de ids para chequeos O(1). */
  idSet = computed(() => new Set<string>(this.ids()?.serviceIds ?? []));

  has(id: string): boolean {
    return this.idSet().has(id);
  }

  async toggle(serviceId: string): Promise<boolean> {
    const u = this.auth.user();
    if (!u) throw new Error('Debes iniciar sesión para guardar favoritos.');
    const ref = doc(this.fs, `userFavorites/${u.uid}`);
    const exists = this.has(serviceId);
    if (exists) {
      try {
        await updateDoc(ref, {
          serviceIds: arrayRemove(serviceId),
          updatedAt: serverTimestamp()
        });
      } catch {
        await setDoc(ref, { uid: u.uid, serviceIds: [], updatedAt: serverTimestamp() }, { merge: true });
      }
      return false;
    } else {
      await setDoc(
        ref,
        {
          uid: u.uid,
          serviceIds: arrayUnion(serviceId),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      return true;
    }
  }
}
