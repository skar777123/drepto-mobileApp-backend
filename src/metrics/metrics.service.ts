import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

// Enable default metrics collection
collectDefaultMetrics();

// Create custom metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

@Injectable()
export class MetricsService {
  incrementHttpRequests(method: string, route: string, statusCode: number) {
    httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  startHttpRequestTimer(method: string, route: string) {
    return httpRequestDuration.startTimer({ method, route });
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
