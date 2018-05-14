exports.index = async (ctx, next) => {
    // const list = await groupService.getAllGroup();
    await ctx.render('login/login', {
        title: '登录',
    })
};

exports.verify = async (ctx, next) => {};