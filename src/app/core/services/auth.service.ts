import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  readonly user = toSignal<User | null>(authState(this.auth), { initialValue: null });
  readonly loading = signal(false);

  isLoggedIn(): boolean {
    return !!this.user();
  }

  async register(email: string, password: string, displayName: string): Promise<User> {
    this.loading.set(true);
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      return cred.user;
    } finally {
      this.loading.set(false);
    }
  }

  async login(email: string, password: string): Promise<User> {
    this.loading.set(true);
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      return cred.user;
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle(): Promise<User> {
    this.loading.set(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(this.auth, provider);
      return cred.user;
    } finally {
      this.loading.set(false);
    }
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
