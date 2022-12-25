import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TransformInterceptor } from './interceptors/response.interceptors';

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

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //   }),
  // );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('api');

  app.enableCors({ origin: true, credentials: true });

  if (isProd) {
    // useProd(app);
  }

  const options = new DocumentBuilder()
    .setTitle('bigScreen')
    .setDescription('BigScreen')
    .setVersion('1.0')
    .addTag('big-screen')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
