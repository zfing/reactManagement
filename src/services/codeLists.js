import { request, config } from 'utils'

const { api } = config
const { users } = api
const { codeList } = api
export function query (params) {
  return request({
    url: codeList,
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
