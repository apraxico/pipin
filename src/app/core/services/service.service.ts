import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { ServiceItem, ServiceCategory } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private fs = inject(Firestore);
  private col = collection(this.fs, 'services');

  listPublished(category?: ServiceCategory): Observable<ServiceItem[]> {
    const constraints = [where('published', '==', true), orderBy('createdAt', 'desc')];
    if (category) {
      constraints.unshift(where('category', '==', category));
    }
    return collectionData(query(this.col, ...constraints), { idField: 'id' }) as Observable<ServiceItem[]>;
  }

  listByOwner(uid: string): Observable<ServiceItem[]> {
    const q = query(this.col, where('ownerUid', '==', uid), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<ServiceItem[]>;
  }

  get(id: string): Observable<ServiceItem | undefined> {
    return docData(doc(this.fs, `services/${id}`), { idField: 'id' }) as Observable<ServiceItem | undefined>;
  }

  async create(data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(this.col, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return ref.id;
  }

  async update(id: string, data: Partial<ServiceItem>): Promise<void> {
    await updateDoc(doc(this.fs, `services/${id}`), {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.fs, `services/${id}`));
  }
}
