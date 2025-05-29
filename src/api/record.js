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

// 提交表单数据
export function submitList(data) {
  return request({
    url: '/submit', // 替换为你的实际提交接口
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: data
  })
}
