import { request, config } from 'utils'

const { api } = config
const { users } = api
const { totalList } = api
export function query (params) {
  return request({
    url: totalList,
    method: 'get',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: users,
    method: 'delete',
    data: params,
  })
}
