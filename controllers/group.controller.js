const groupService = require('./../service/group.service');
exports.index = async (ctx, next) => {
    const list = await groupService.getAllGroup();
    await ctx.render('group/group', {
        title: '用户组管理',
        list: list
    })
};

exports.edit = async (ctx,next) => {
    const id =  ctx.params.id;
    const group = await groupService.getGroupById(id);
    await ctx.render('group/edit', {
        title: '编辑用户组',
        group: group
    })
};

exports.permission = async (ctx,next) => {
    const id = ctx.params.id;
    const group = await groupService.getGroupById(id);
    // const permission = await groupService.getGroupPermissionByTag(group.tag);
    const modules = await groupService.getAllSystemModule(group.tag);
    console.log(JSON.stringify(modules));
    await ctx.render('group/permission', {
        title: '权限控制',
        modules: modules
    })
};