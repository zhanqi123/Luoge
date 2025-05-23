import request from '@/utils/request'
//查询列表
export function initList(data) {
  return request({
    url: '/request', // 拼接具体接口路径
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: data
  })
}
