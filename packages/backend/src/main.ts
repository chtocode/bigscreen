import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

function useProd(app: INestApplication): void {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(cookieParser());

  app.use(csurf({ cookie: true }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const isProd = configService.get('IS_PROD');
  const port = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableCors({ origin: '*', credentials: true });

  if (isProd) {
    useProd(app);
  }

  const options = new DocumentBuilder()
    .setTitle('bigScreen')
    .setDescription('BigScreen')
    .setVersion('1.0')
    .addServer('http://')
    .addTag('big-screen')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
