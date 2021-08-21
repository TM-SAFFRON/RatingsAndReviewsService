import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Counter } from 'k6/metrics';

export let slowCount = new Counter('slowCount');
export let errorRate = new Rate('errors');
export let options = {
  vus: 10,
  duration: '60s',
}

const productIdsSet1 = [1000011,
  1000010,
  1000009,
  1000008,
  1000007,
  1000005,
  1000004,
  1000003,
  1000002,
  1000000,
  999999,
  999997,
  999996,
  999995,
  999994,
  999993,
  999992,
  999991,
  999990,
  999989,
  999988,
  999987,
  999986,
  999985,
  999984,
  999983,
  999981,
  999980,
  999979,
  999978,
  999977,
  999976,
  999975,
  999974,
  999973,
  999972,
  999971,
  999970,
  999969,
  999968,
  999967,
  999966,
  999965,
  999964,
  999963,
  999962,
  999961,
  999960,
  999959,
  999958];

  const productIdsSet2 = [1,
    2,
    4,
    5,
    7,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57];

    const productIdsSet3 = [59,
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67,
      68,
      69,
      70,
      71,
      72,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      106,
      107,
      108,
      109,
      110];

export default function () {
  for (var productId of productIdsSet3) {
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
