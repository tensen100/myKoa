const Koa = require('koa');
const views = require('koa-views');
const logger = require('koa-logger');
const static = require('koa-static');
const koaBodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const app = new Koa();

//routes
const group = require('./routes/group.router');
const login = require('./routes/login.router');
const upload = require('./routes/uploade.router');

// 日志
app.use(logger());
// app.use(koaBodyParser());
app.use(koaBody({multipart: true}));
// 静态资源路径
app.use(static(__dirname + '/public'));
// 视图路径
app.use(views(__dirname + '/views',{
    extension: 'pug'
}));

// 输出日志
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// routes
app.use(group.routes(), group.allowedMethods());
app.use(login.routes(), login.allowedMethods());
app.use(upload.routes(), upload.allowedMethods());

app.on('error', (err, ctx) => {
    console.log('server error',err,ctx)
});

app.listen(3000);