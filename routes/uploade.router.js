const fs = require('fs');
const path = require('path');
const multer = require('koa-multer');
const router = require('koa-router')();
const index = async (ctx, next) => {
    await ctx.render('upload/upload', {
        title: '文件上传',
    })
};

const upload = async (ctx, next) => {
    const data = {
        ctx: ctx,
        request:ctx.request,
        body: ctx.request.body
    };
    console.log(data);

    ctx.response.redirect('/system/upload/success')
    // ctx.body = data

};

const write = (files) => {
    return new Promise( async (resolve, reject)=>{
        const filesArr = Object.values(files);
        const filesLength = filesArr.length;
        for(let i=0,file;file = filesArr[i++];) {
            const posterData = file;
            const filePath = posterData.path;
            await new Promise((res, rej) => {
                fs.readFile(filePath, (err, data) => {
                    const timestamp = Date.now();
                    const type = posterData.type.split('/')[1];
                    const poster = timestamp + '.' + type;
                    const newPath = path.join(__dirname, '../', '/public/upload/' + poster);
                    fs.writeFile(newPath, data, function(err) {
                        if (err) {
                            rej(err)
                        }else {
                            res();
                        }
                    })
                });
            });
        }
        resolve()
    });
};

const upload2 = async (ctx, next) => {
    const data = {
        ctx: ctx,
        request:ctx.request,
        body: ctx.request.body,
    };
    await write(ctx.request.body.files);
    console.log('上传成功');
    ctx.response.redirect('/system/upload/success')
};

const success = (ctx,next) =>{
    ctx.body = {message: 'succsee'};
};

const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        const fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
const load = multer({ storage: storage });

router.prefix('/system/upload');
router.get('/',index);
// router.post('/upload',load.single('img'),upload);
router.post('/upload',upload2);
router.get('/success',success);

module.exports = router;