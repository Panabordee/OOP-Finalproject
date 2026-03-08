import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return '<h1>Welcome to the Blog API</h1><p>Swagger API Documentation is located at <a href="/api">/api</a></p>';
  }
}
