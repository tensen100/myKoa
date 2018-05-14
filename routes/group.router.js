const router = require('koa-router')();
const group = require('./../controllers/group.controller');

router.prefix('/system/group');
router.get('/',group.index);
router.get('/edit/:id',group.edit);
router.get('/permission/:id',group.permission);

module.exports = router;