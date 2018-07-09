import { request, config } from 'utils'

const { api } = config
const { kyc } = api
const { kycInfo } = api
const { kycExamine } = api
const { kycSearch } = api
export function query (params = {}) {
  const { page = 1, pageSize = 10, ...rest } = params
  // debugger
  return request({
    url: kyc,
    method: 'get',
    data: {
      page,
      pageSize,
      ...rest,
    },
  })
}
export function remove (params) {
  return request({
    url: kyc,
    method: 'delete',
    data: params,
  })
}
export function kycUserInfo (params) {
  // debugger
  return request({
    url: kycInfo,
    method: 'get',
    data: params,
  })
}
export function kycExamineInfo (params) {
  // debugger
  return request({
    url: kycExamine,
    method: 'post',
    data: params,
  })
}

export function kycSearchUser (params) {
  return request({
    url: kycSearch,
    method: 'get',
    data: params,
  })
}
