const mongoose = require('mongoose');
const db=''
mongoose.Promise = global.Promise;
exports.connect = () => {
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug',true)
        }
        mongoose.connect(db);
        mongoose.connection.on('disconnected',() => {
            maxConnectTimes++;
            if(maxConnectTimes < 5) { //小于5次重连
                mongoose.connect(db)
            }else {
                throw new Error('数据库挂了！')
            }
        });
        mongoose.connection.on('error', err => {
            console.log(err);
            reject(err)
        });
        mongoose.connection.once('open',() => {
            resolve();
            console.log('MongooseDB Connect Successfully!')
        })
    })
};
