export abstract class JWTGateway {
  abstract sign(payload: object): Promise<string>;
  abstract verify<P extends object>(token: string): Promise<P>;
}
