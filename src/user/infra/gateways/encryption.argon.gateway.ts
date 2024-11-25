import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { EncryptionGateway } from 'src/user/application/gateways/encryption.gateway';

@Injectable()
export class EncryptionArgonGateway implements EncryptionGateway {
  compare(params: EncryptionGateway.ComparingParams): Promise<boolean> {
    return argon.verify(params.encrypted, params.plain);
  }

  hash(value: string): Promise<string> {
    return argon.hash(value);
  }
}
