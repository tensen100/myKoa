const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    name: String,
    phone: {
        type: String,
        unique: true // 不能重复
    },
    password: String,
    lockUntil: Number,
    loginAttempts: {
        type: Number,
        required: true, // 必填
        default: 0
    },
    //时间戳
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
});
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;
/**
 * 每存储数据前调用这个方法
 */
UserSchema.pre('save',next =>{
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});
UserSchema.pre('save',next =>{
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt) => {
        if(err) return next(err);
        bcrypt.hash(this.password,salt,(error,hash) => {
            if(error) return next(error);
            this.password = hash;
            next()
        })
    });
    next()
});
// 临时字段
UserSchema.virtual('isLocked').get(() => {
    return !!this.LockUtill && this.lockUntil > Date.now()
});
UserSchema.methods = {
    comparePassword: (_password,password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err,isMatch) => {
                if (!err) resolve(isMatch);
                else reject(err)
            })
        })
    },
    incLoginAttempts: () => {
        return new Promise((resolve, reject) => {
            if(this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset:{
                        lockUntil: 1
                    }
                }, (err) => {
                    if(!err) resolve(true);
                    else reject(err)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts:1
                    }
                };
                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set ={
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }
                this.update(updates,err => {
                    if (!err) resolve(true);
                    else reject(err);
                })
            }
        })
    }
};
const User = mongoose.model('User', UserSchema);
module.exports = User;