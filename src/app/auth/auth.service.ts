import { Injectable } from 'angular2/core';
import { FirebaseAuthState, FirebaseAuth, AuthProviders } from 'angularfire2';

@Injectable()
export class AuthService {
  private _authState: FirebaseAuthData | FirebaseAuthState;
  private _loginStatus = { login: false };

  constructor(private _auth$: FirebaseAuth) {
    _auth$.subscribe((state: FirebaseAuthState) => {
      // console.log(state);
      this._authState = state;
      this._loginStatus.login = this.authenticated;
    });
  }

  get loginStatus() {
    return this._loginStatus;
  }

  get authenticated(): boolean {
    return this._authState !== null && !this.expired;
  }

  get expired(): boolean {
    return !this._authState || this._authState.expires * 1000 < Date.now();
  }

  get id(): string {
    return this.authenticated ? this._authState.uid : '';
  }

  signInWithGithub(): Promise<FirebaseAuthState> {
    return this._auth$.login({
      provider: AuthProviders.Github
    });
  }

  signInWithGoogle(): Promise<FirebaseAuthState> {
    return this._auth$.login({
      provider: AuthProviders.Google
    });
  }

  signInWithTwitter(): Promise<FirebaseAuthState> {
    return this._auth$.login({
      provider: AuthProviders.Twitter
    });
  }

  signOut(): void {
    this._auth$.logout();
  }
}
