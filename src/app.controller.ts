import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('login')
  login() {}

  @Get('register')
  @Render('register')
  register() {}
}
