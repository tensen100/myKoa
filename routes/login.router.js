const router = require('koa-router')();
const login = require('./../controllers/login.controller');

router.prefix('/system/login');
router.get('/',login.index);

router.post('/verify',login.verify);
module.exports = router;