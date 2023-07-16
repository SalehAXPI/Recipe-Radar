export interface LoginUserResponse {
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}

export interface SignupUserResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface userResponseNeededData {
  email: string;
  id: string;
  readonly _token: string;
  readonly _tokenExpirationDate: Date;
}

export class User implements userResponseNeededData {
  constructor(
    public email: string,
    public id: string,
    readonly _token: string,
    readonly _tokenExpirationDate: Date
  ) {}

  get token(): string | null {
    return !this._tokenExpirationDate || new Date() > this._tokenExpirationDate
      ? null
      : this._token;
  }
}
