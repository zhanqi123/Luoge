import request from '@/utils/request'
//获取列表
export function initList(data) {

  return request({
    url: '/request', // 拼接具体接口路径
      headers: {
      isToken: false,
      repeatSubmit: false,
      'Content-Type': 'multipart/form-data'
      
    },
    method: 'post',
     data: data
  })
}


//提交
export function submitData(data) {
   
  return request({
    url: '/request', // 拼接具体接口路径
      headers: {
      isToken: false,
      repeatSubmit: false,
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
     data: data
  })
}