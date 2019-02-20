import OrderModel from "../db/entity/orders";
import { Router } from 'express';
import request from 'request-promise';
import amqp from 'amqplib';
import uuid from 'node-uuid';

export const orderRouter = new Router();

orderRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

orderRouter.get('/buy', async (req, res) => {
  const userId = req.query.userId;
  const count = await OrderModel.countDocuments();
//做判断，大于100就不再入库
  if (count > 100) {
    res.send('sold out!');
  } else {
    const model = new OrderModel({
      userId: userId
    }).save({});
    if (model) {
      res.send('success');
    }
  }
});

let globalUserId = 1;

orderRouter.get('/clientBuy', async (req, res) => {
//用户id简单地每次请求递增1
  let num = globalUserId++;
//调用request发起请求
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    uri: `http://127.0.0.1:8000/order/buy?userId=${num}`,
    // body: qs.stringify(newParams),
    json: true,
  };
  // try {
  await request(options);
  res.send('success');
});

let conn;
amqp.connect('amqp://127.0.0.1').then(res => {
  conn = res;
});

const q = 'fibq'; //前端发送消息队列
const q2 = 'ackq'; //后台回复队列
const correlationId = uuid();
orderRouter.get('/ampq/clientBuy', (req, res) => {
//用户id简单地每次请求递增1
  let num = globalUserId++;
  conn.createChannel().then(ch => {
    //监听q2队列（订单量如果到达100，服务端会通过q2队列返回信息）
    return ch.assertQueue(q2, { durable: false }).then(function () {
      //创建消费q2队列，这里简单把信息设置到res的body里
      ch.consume(q2, function (msg) {
        res.send(msg.content.toString());
        ch.close();
      }, { noAck: true });
      //发送消息到q队列，这里把订单id作为content。把q2队列的name和uuid也传过去，这里uuid用来做消息的关联id
      ch.sendToQueue(q, Buffer.from(num.toString()), { replyTo: q2, correlationId: correlationId })
    });
  }).then(null, console.error)
});
