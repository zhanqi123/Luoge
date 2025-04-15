import request from '@/utils/request'

// 登录方法
export function initList(data) {
   
  return request({
    url: '/RequestInterface.aspx?/request', // 拼接具体接口路径
      headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
     data: data
  })
}