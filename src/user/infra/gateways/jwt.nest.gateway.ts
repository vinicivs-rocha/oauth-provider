import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTGateway } from 'src/user/application/gateways/jwt.gateway';

@Injectable()
export class JWTNestGateway implements JWTGateway {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: object): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verify<P extends object>(token: string): Promise<P> {
    return this.jwtService.verify<P>(token);
  }
}
