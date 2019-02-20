import { createClient } from "redis";
import { connectionMysql } from "./connection";
import { connectMongoDB } from "./entity";
import http from "http";
import { startSocket } from "../socket/socket";
export let db;

export default async function startDB(app){
  const redisClient = createClient();

  const sub = function (c) {
    let cc = c || 'roban:test:channel';
    redisClient.subscribe(cc, () => {
      console.log('starting subscribe channel: ' + cc);
    });
  };

  sub();

  redisClient.on('message', function (err, response) {
    console.log(response);
  });

  db = connectionMysql();

  db.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('mysql connected as id ' + db.threadId);
  });

  await connectMongoDB({
    mongoDB: 'mongodb://localhost:27017/test?replicaset=rs',
  });
  let server = http.Server(app);
  startSocket(server)

}
