import request from '@/utils/request'

// 测试本地调试方法
export function submitList(data) {
   
  return request({
    url: '/LocalRequestInterface?/request', // 拼接具体接口路径
      headers: {

      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
     data: data
  })
}