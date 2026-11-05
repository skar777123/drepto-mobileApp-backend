import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import client from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 52428800 }),
  );
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    originAgentCluster: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 31536000 },
    noSniff: true,
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true,
    frameguard: { action: 'deny' },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  });

  // CORS origins from environment
  const rawOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [
        'https://www.dreptobiodevices.com',
        'https://dreptobiodevices.com',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
      ];

  app.enableCors({
    // origin: '*' with credentials: true is rejected by browsers — use a function instead.
    origin: (origin, callback) => {
      if (!origin || rawOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Enhanced validation to prevent NoSQL injection
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strips unknown fields safely
      forbidNonWhitelisted: false, // do NOT reject requests with extra fields (nested DTOs are complex)
      transform: true,          // auto-transform types (e.g. string to number)
    }),
  );

  const port = process.env.PORT || 6001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });
