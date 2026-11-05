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

  // CORS origins configuration
  const customOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      // 1. Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) {
        return callback(null, true);
      }

      // 2. Always allow any localhost or 127.0.0.1 port for development
      if (
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }

      // 3. Allow official domains & Vercel deployments
      if (
        origin.endsWith('dreptobiodevices.com') ||
        origin.endsWith('.vercel.app') ||
        customOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      // 4. Reject unknown origin cleanly without throwing 500 error on preflight
      callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
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
