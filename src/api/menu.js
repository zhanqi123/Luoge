import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  // return request({
  //   url: '/getRouters',
  //   method: 'get'
  // })
  return new Promise((resolve) => {
    // 模拟异步操作，使用 setTimeout
    let data={
        "msg": "操作成功",
        "code": 200,
        "data":
         [
            {
                "name": "System",
                "path": "/system",
                "label": "系统管理",
                "hidden": false,
                "redirect": "noRedirect",
                "component": "Layout",
                "alwaysShow": true,
                'id':1,
                "meta": {
                    "title": "系统管理",
                    "icon": "system",
                    "noCache": false,
                    "link": null,
                   
                },
                "children": [
                    // {
                    //     "name": "User",
                    //     "path": "user",
                    //     "hidden": false,
                    //     "component": "system/user/index",
                    //     "meta": {
                    //         "title": "用户管理",
                    //         "icon": "user",
                    //         "noCache": false,
                    //         "link": null
                    //     }
                    // },
                    {
                        "name": "Role",
                        "path": "role",
                        "hidden": false,
                        "label": "角色管理",
                        'id':101,
                        "component": "system/role/index",
                        "meta": {
                            "title": "角色管理",
                            "icon": "peoples",
                            "noCache": false,
                            "link": null
                        }
                    },
                    {
                        "name": "Menu",
                        "path": "menu",
                        "hidden": false,
                        "component": "system/menu/index",
                        "meta": {
                            "title": "菜单管理",
                            "icon": "tree-table",
                            "noCache": false,
                            "link": null
                        }
                    },
                    {
                        "name": "Dept",
                        "path": "dept",
                        'id':102,
                        "hidden": false,
                        "label": "部门管理",
                        "component": "system/dept/index",
                        "meta": {
                            "title": "部门管理",
                            "icon": "tree",
                            "noCache": false,
                            "link": null
                        }
                    },
   
                ]
            },
            {
              "name": "User",
              "path": "/user",
              "hidden": false,
              "redirect": "noRedirect",
              "component": "Layout",
              "label": "人员管理",
              "alwaysShow": true,
              "meta": {
                  "title": "用户管理",
                  "icon": "system",
                  "noCache": false,
                  "link": null
              },
              "children": [
                  {
                      "name": "userIndex",
                      "path": "userIndex",
                      "label": "人员列表",
                      "hidden": false,
                      "component": "system/user/index",
                      "meta": {
                          "title": "人员列表",
                          "icon": "user",
                          "noCache": false,
                          "link": null
                      }
                  }
                
              ]
          },
          {
            "name": "record",
            "path": "/record",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "label": "归档管理",
            'id':2,
            "meta": {
                "title": "归档管理",
                "icon": "build",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "courseSubmit",
                    "path": "courseSubmit",
                    "label": "过程文件提交",
                    "hidden": false,
                    'id':201,
                    "component": "record/courseSubmit",
                    "meta": {
                        "title": "过程文件提交",
                        "icon": "edit",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "courseAudit",
                    "path": "courseAudit",
                    "label": "过程文件审核",
                    'id':202,
                    "hidden": false,
                    "component": "record/courseAudit",
                    "meta": {
                        "title": "过程文件审核",
                        "icon": "education",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "warehouseSubmit",
                    "path": "warehouseSubmit",
                    "hidden": false,
                    "label": "档案入库提交",
                    'id':203,
                    "component": "record/warehouseSubmit",
                    "meta": {
                        "title": "档案入库提交",
                        "icon": "log",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "warehouse",
                    "path": "warehouse",
                    'id':204,
                    "hidden": false,
                    "label": "档案入库",
                    "component": "record/warehouse",
                    "meta": {
                        "title": "档案入库",
                        "icon": "form",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "fileAudit",
                    "path": "fileAudit",
                    'id':205,
                    "hidden": false,
                    "label": "归档文件审核",
                    "component": "record/fileAudit",
                    "meta": {
                        "title": "归档文件审核",
                        "icon": "clipboard",
                        "noCache": false,
                        "link": null
                    }
                }
              
            ]
        },
        {
            "name": "Standing",
            "path": "/Standing",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "label": "台账管理",
            "alwaysShow": true,
            'id':3,
            "meta": {
                "title": "台账管理",
                "icon": "redis-list",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "StandingIndex",
                    "path": "StandingIndex",
                    "hidden": false,
                    "label": "档案列表",
                    'id':301,
                    "component": "Standing/index",
                    "meta": {
                        "title": "档案列表",
                        "icon": "record",
                        "noCache": false,
                        "link": null
                    }
                }
              
            ]
        },
    
       

        ]
    
    }
    resolve(data);
  });
}