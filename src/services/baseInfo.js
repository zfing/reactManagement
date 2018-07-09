import { request, config } from '../utils'

const { api } = config
export function getBaseInfoList (params = {}) {
  return request({
    url: api.baseInfoList,
    method: 'get',
    data: params,
  })
}

export function fuzzySearch (params = {}) {
  return request({
    url: api.fuzzySearch,
    method: 'get',
    data: params,
  })
}
export function addBaseInfo (params = {}) {
  return request({
    url: api.addBaseInfo,
    method: 'post',
    data: params,
  })
}
export function checkBaseInfo (params = {}) {
  return request({
    url: api.checkBaseInfo,
    method: 'post',
    data: params,
  })
}
export function queryBaseInfo (params = {}) {
  return request({
    url: api.baseInfo,
    method: 'get',
    data: params,
  })
}
export function deleteBaseInfo (params = {}) {
  return request({
    url: api.deleteBaseInfo,
    method: 'post',
    data: params,
  })
}
