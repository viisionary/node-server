import { db } from "../app";

export function addPerson() {
  const addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
  const addSqlParams = ['菜鸟工具', 'https://c.runoob.com', '23453', 'CN'];
  db.query(addSql, addSqlParams)

}

export const searchPerson = () => {
  return new Promise(resolve => {
    const sql = 'SELECT * FROM websites';
    db.query(sql, (error, result) => {
      resolve(result)
    });
  })
};
