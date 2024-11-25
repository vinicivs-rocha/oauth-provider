export abstract class EncryptionGateway {
  abstract hash(value: string): Promise<string>;
  abstract compare(params: EncryptionGateway.ComparingParams): Promise<boolean>;
}

export namespace EncryptionGateway {
  export interface ComparingParams {
    plain: string;
    encrypted: string;
  }
}
