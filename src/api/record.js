import request from '@/utils/request'

// 登录方法
export function initList(data) {
    console.log(data)
  return request({
    url: '/RequestInterface.aspx?/request', // 拼接具体接口路径
      headers: {
    //   isToken: false,
    //   repeatSubmit: false,
      'Content-Type': 'multipart/form-data'
      
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