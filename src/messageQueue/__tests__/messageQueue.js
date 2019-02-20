import { sub } from "../messageQueue";

beforeAll(async () => {
  console.log('123456')
});

describe('message queue', () => {
  test('redis', async () => {
    console.log('123');
//订阅一个频道
    sub();
  })
});
