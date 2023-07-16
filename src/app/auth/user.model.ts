export interface LoginUserResponse {
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginUserResponseNeededData {
  email: string;
  id: string;
  readonly _token: string;
  readonly _tokenExpritionDate: Date;
}

export class User implements LoginUserResponseNeededData {
  constructor(
    public email: string,
    public id: string,
    readonly _token: string,
    readonly _tokenExpritionDate: Date
  ) {}

  get token(): string | null {
    return !this._tokenExpritionDate || new Date() > this._tokenExpritionDate
      ? null
      : this._token;
  }
}
