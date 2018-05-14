const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'test'
});
connection.connect();
// 查询
const query = () => {
    connection.query('select * from user',(err,result)=>{
        if(err){
            console.log('[select error] - :', err.message)
        }
        console.log(result)
    });
};

// 插入
const insert = () => {
    const sql = 'insert into user(name,phone) VALUES(?,?)';
    const params = ['Rouse','17778569475'];
    connection.query(sql,params,(err,result)=>{
        if(err){
            console.log('[select error] - :', err.message)
        }
        console.log(result)
    });
};

// 跟新
const update = () => {
    const sql = 'update user set phone = ? where id = ?';
    const params = ['17778569475','1'];
    connection.query(sql,params,(err,result)=>{
        if(err){
            console.log('[select error] - :', err.message)
        }
        console.log(result)
    });
};

// 删除
const del = () => {
    const sql = 'delete from user where id = ?';
    const params = ['1'];
    connection.query(sql,params,(err,result)=>{
        if(err){
            console.log('[select error] - :', err.message)
        }
        console.log(result)
    });
};
del();

connection.end();
