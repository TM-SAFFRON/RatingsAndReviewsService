import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Counter } from 'k6/metrics';
import { set1, set2, set3, combined1, combined2 } from './productIds.js';

export let errorRate = new Rate('errors');
export let slowCount = new Counter('slowCount');
export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  for (var productId of combined1) {
    const res = http.get(`http://localhost:5000/reviews/?product_id=${productId}&count=100&sort=relevant&page=1`);
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
