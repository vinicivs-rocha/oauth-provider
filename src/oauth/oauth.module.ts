import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { OauthController } from './api/controllers/oauth.controller';
import { GenerateAccessToken } from './application/usecases/generate-access-token.usecase';

@Module({
  imports: [UserModule, ProjectModule],
  providers: [GenerateAccessToken],
  controllers: [OauthController],
})
export class OauthModule {}
