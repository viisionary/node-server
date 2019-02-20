import amqp from 'amqplib';

import OrderModel from "../db/entity/orders";

//订阅一个频道
export function rabbitMq() {
  const q = 'fibq';
  amqp.connect('amqp://127.0.0.1').then(function (conn) {
    process.once('SIGN', function () {
      conn.close();
    });
    return conn.createChannel().then(function (ch) {
//设置公平调度，这里是指rabbitmq不会向一个繁忙的队列推送超过1条消息。
      ch.prefetch(1);
      //定义回传消息函数
      const ackSend = function (msg, content) {
        //要注意这里我们之前传上来的队列名和uuid会被保存在msg对象的properties中
        //因为服务端并不知道回传的队列名字，所以我们需要把它带过来
        ch.sendToQueue(msg.properties.replyTo, Buffer.from(content.toString()),
          { correlationId: msg.properties.correlationId });
        //ack表示消息确认机制。这里我们告诉rabbitmq消息接收成功。
        ch.ack(msg);
      };
      //监听队列q并消费
      const ok = ch.assertQueue(q, { durable: false }).then(function () {
        ch.consume(q, async (msg) => {
          const userId = parseInt(msg.content.toString());
          const count = await OrderModel.countDocuments({});
          if(count >= 100){
            return ackSend(msg,'sold out!');
          }else{
            const model = new OrderModel({
              userId: userId
            }).save({});
            if (model) {
              return ackSend(msg,'buy success!');
            }
          }
        }, { noAck: false });
      });
      return ok.then(function () {
        console.log(' [*] waiting for message')
      })
    })
  }).then(null, console.error);

}
