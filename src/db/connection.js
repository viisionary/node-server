import mysql from "mysql";
import bluebird from "bluebird";

bluebird.promisifyAll(mysql);

export function connectionMysql(){
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'test'
  });
}
