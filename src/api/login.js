import request from '@/utils/request'

// 登录方法
export function login(Token) {
  console.log(Token,'8888')
  const data = {
    Token:Token

  }
  return request({
    url: '?login1',
    headers: {
      // isToken: false,
      // repeatSubmit: false
    },
    method: 'post',
    data: data
  })

  
  // return new Promise((resolve) => {
  //   // 模拟异步操作，使用 setTimeout
  //   let data={
  //     token: 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImYwNGJmZWY1LTAzMDYtNDFjOS04NGRhLWRiYzk3YzBlYTgwMCJ9.-nq-kGL5Odg9ELRCVg4A7JkwwJakgqxBXVDV_Wh2nEbEcpnmW7ACYO2fGk08MjeT0loeDvLxeHtIq28yppbe6g',
  //   }
  //   resolve(data);
  // });
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  // return request({
  //   url: '/getInfo',
  //   method: 'get'
  // })
  return new Promise((resolve) => {
    // 模拟异步操作，使用 setTimeout
    let data={
      
        "msg": "操作成功",
        "code": 200,
        "permissions": [
            "*:*:*"
        ],
        "roles": [
            "admin"
        ],
        "user": {
            "createBy": "admin",
            "createTime": "2024-06-30 11:27:11",
            "updateBy": null,
            "updateTime": null,
            "remark": "管理员",
            "userId": 1,
            "deptId": 103,
            "userName": "admin",
            "nickName": "若依",
            "email": "ry@163.com",
            "phonenumber": "15888888888",
            "sex": "1",
            "avatar": "",
            "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
            "status": "0",
            "delFlag": "0",
            "loginIp": "223.74.63.199",
            "loginDate": "2025-03-18T16:46:25.000+08:00",
            "dept": {
                "createBy": null,
                "createTime": null,
                "updateBy": null,
                "updateTime": null,
                "remark": null,
                "deptId": 103,
                "parentId": 101,
                "ancestors": "0,100,101",
                "deptName": "研发部门",
                "orderNum": 1,
                "leader": "若依",
                "phone": null,
                "email": null,
                "status": "0",
                "delFlag": null,
                "parentName": null,
                "children": []
            },
            "roles": [
                {
                    "createBy": null,
                    "createTime": null,
                    "updateBy": null,
                    "updateTime": null,
                    "remark": null,
                    "roleId": 1,
                    "roleName": "超级管理员",
                    "roleKey": "admin",
                    "roleSort": 1,
                    "dataScope": "1",
                    "menuCheckStrictly": false,
                    "deptCheckStrictly": false,
                    "status": "0",
                    "delFlag": null,
                    "flag": false,
                    "menuIds": null,
                    "deptIds": null,
                    "permissions": null,
                    "admin": true
                }
            ],
            "roleIds": null,
            "postIds": null,
            "roleId": null,
            "admin": true
        }
    
    }
    resolve(data);
  });
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
// export function getCodeImg() {
//   return request({
//     url: '/captchaImage',
//     headers: {
//       isToken: false
//     },
//     method: 'get',
//     timeout: 20000
//   })
// }
export function getCodeImg() {
  return new Promise((resolve) => {
    // 模拟异步操作，使用 setTimeout
    let data={
      captchaEnabled: true,
      code: 200,
      img:"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",
      msg: "操作成功",
      uuid: "785fe1c12b6a49b6866786b5f96038c8"
    }
    resolve(data);
  });
}