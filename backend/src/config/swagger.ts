import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
 
export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle('NestJS Study API Docs')
      .setDescription('NestJS Study API description')
      .setVersion('1.0.0')
      .build();
  
    const document = SwaggerModule.createDocument(app, options);
    // 여기서 설정한 'docs' 경로대로 
    // https://localhost/api/docs 에서 Swagger 문서 확인가능
    SwaggerModule.setup('/api/docs', app, document);
  }