import { Controller, Post, UseGuards } from '@nestjs/common';
import { GenerateAccessToken } from 'src/oauth/application/usecases/generate-access-token.usecase';
import { ProjectVerificationGuard } from 'src/project/api/guards/project-verification.guard';
import { Token } from 'src/user/api/decorators/token.decorator';
import { ValidateAuthorizationCodeGuard } from 'src/user/api/guards/validate-authorization-code.guard';

@Controller('oauth')
export class OauthController {
  constructor(private generateAccessToken: GenerateAccessToken) {}

  @Post('access-token')
  @UseGuards(ProjectVerificationGuard, ValidateAuthorizationCodeGuard)
  async generateToken(@Token() token: string) {
    const result = await this.generateAccessToken.execute({
      authorizationCode: token,
    });

    return {
      access_token: result.accessToken,
    };
  }
}
