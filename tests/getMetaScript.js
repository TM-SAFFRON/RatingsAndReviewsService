import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Counter } from 'k6/metrics';
import { set1, set2, set3, combined1, combined2 } from './productIds.js';

export let slowCount = new Counter('slowCount');
export let errorRate = new Rate('errors');
export let options = {
  vus: 100,
  duration: '60s',
}

export default function () {
  for (var productId of combined2) {
    const res = http.get(`http://localhost:5000/reviews/meta?product_id=${productId}`);
    if (res.timings.duration > 50) {
      console.log(`Response time for product ${productId} was ${String(res.timings.duration)} ms`);
      slowCount.add(1);
    }
    const result = check(res, {
      'is status 200': (r) => r.status === 200,
    });
    errorRate.add(!result);
  sleep(1);
  }
}
