import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Counter } from 'k6/metrics';
import { set1, set2, set3, combined1, combined2 } from './productIds.js';

export let slowCount = new Counter('slowCount');
export let errorRate = new Rate('errors');
export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '60s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  const randomIndex = Math.floor(Math.random() * 100);
  const productId = combined2[randomIndex];
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




