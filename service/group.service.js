const query = require('./../sql/sql');
exports.getAllGroup = () => {
    return query.row('select * from system__group')
};
exports.getGroupById = (id) => {
    return query.first('select * from system__group where id = ?',[id])
};
exports.getGroupPermissionByTag = async (tag) => {
    return query.row('select * from system__group_permission where groupTag = ?',[tag])

};
exports.getAllSystemModule = async(tag) => {
    // const sql = 'SELECT a.id,a.name,a.parentId,a.level,b.name AS permissionName,b.id AS permissionId FROM system__module a LEFT JOIN system__permission b ON a.id = b.moduleId'
    const sql = 'SELECT a.id,a.name,a.parentId,a.level,b.name AS permissionName,b.id AS permissionId,c.groupTag FROM system__module a LEFT JOIN system__permission b ON a.id = b.moduleId LEFT JOIN system__group_permission c ON b.id = c.permissionId && c.groupTag = ?'
    const modules = await query.row(sql,tag);
    const groupBy = (pId,level) => {
        pId = pId || 0;
        const module = modules.filter(m => m.parentId === pId);
        if (level === 2) {
            const obj = {};
            const arr = [];
            module.forEach((m) => {
                const permission = {
                    name: m.permissionName,
                    id: m.permissionId,
                    checked: !!m.groupTag,
                };
                if(obj[m.id]){
                    obj[m.id].permission.push(permission)
                }else {
                    m.permission = [permission];
                    obj[m.id] = m
                }
            });
            for(const v in obj){
                arr.push(obj[v])
            }
            return arr;
        }else {
            return module.map( m => {
                m.children = groupBy(m.id, m.level);
                return m;
            })
        }

    };
    // const mouleObj = {};
    // modules.forEach( m => {
    //     if(m.level === 1) {
    //         mouleObj[m.id] = m;
    //     } else if (m.level === 2) {
    //         mouleObj[m.parentId]['children'][m.id] = m;
    //     } else {
    //         mouleObj[m.parentId]['children'][m.id]['children'][] =
    //     }
    // });

    return groupBy()
};