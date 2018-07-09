import { request, config } from 'utils'

const { api } = config
const { kyc } = api
const { kycInfo } = api
const { kycExamine } = api
const { kycSearch } = api

export function query (params) {
  return request({
    url: kyc,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: kyc.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}


export function update (params) {
  return request({
    url: kyc,
    method: 'patch',
    data: params,
  })
}

export function kycUserInfo (params) {
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
