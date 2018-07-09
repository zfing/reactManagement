import { request, config } from 'utils'
import md5 from 'blueimp-md5'

const { api } = config
const { userLogin } = api

export function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data: {
      ...data,
      password: md5(data.password),
    },
  })
}
