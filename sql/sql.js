const mysql = require('mysql');
/*
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'test'
});
connection.connect();
*/
const pool = mysql.createPool({
    connectionLimit : 50,
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'reail',
    multipleStatements : true  //是否允许执行多条sql语句
});

// 返回数组
exports.row = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.log('sql error:', err);
                reject(err);
                return
            }
            connection.query(sql,params, (error,res) => {
                connection.release(); // 释放
                if(error){
                    console.log('sql error:', error);
                    reject(error);
                    return;
                }
                resolve(res)
            })
        })
    })
};

exports.first = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                console.log('sql error:', err);
                reject(err);
                return
            }
            connection.query(sql,params, (error,res) => {
                connection.release(); // 释放
                if(error){
                    console.log('sql error:', error);
                    reject(error);
                    return;
                }
                resolve(res[0] || null)
            })
        })
    })
};


