import mysql, { Pool, escape } from 'mysql';
import { USER, PASSWORD, DATABASE, HOST } from '../const/mysql';

export const pool: Pool = mysql.createPool({
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  host: HOST,
  multipleStatements: true,
});

export const pull = <T>(q: string): Promise<[Array<T>, undefined | T]> =>
  new Promise((resolve, reject) => {
    pool.query(q, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve([results, results[0]]);
      }
    });
  });

export const push = <T>(q: string, values?: T): Promise<[number]> =>
  new Promise((resolve, reject) => {
    pool.query(q, values, (err, result: { insertId: number }) => {
      if (err) {
        reject(err);
      } else {
        resolve([result.insertId]);
      }
    });
  });

export { escape };
