// import http from 'k6/http';
// import { sleep } from 'k6';
// export let options = {
//   vus: 10,
//   duration: '30s',
// }
// export default function () {
//   http.get('https://test.k6.io');
//   sleep(1);
// }

// // // // //
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '3s', target: 20 },
    { duration: '1m3s', target: 10 },
    { duration: '2s', target: 0 },
  ],
};

export default function () {
  let res = http.get('https://httpbin.org/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
