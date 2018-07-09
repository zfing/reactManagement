import { request, config } from 'utils'

const { api } = config
const { user } = api
const { totalAdd } = api
const { codeTime } = api
const { totalUpload } = api
const { totalDelete } = api
const { totalUpdate } = api

// 模糊查询
const { ratingSearch } = api

export function totalGetTime (params) {
  return request({
    url: codeTime,
    method: 'get',
    data: params,
  })
}

export function fuzzySearch (params) {
  return request({
    url: ratingSearch,
    method: 'get',
    data: params,
  })
}


export function CodeSearch (params) {
  return request({
    url: codeSearch,
    method: 'get',
    data: params,
  })
}

export function query (params) {
  return request({
    url: codeList,
    method: 'get',
    data: params,
  })
}

export function Totaldelete (params) {
  return request({
    url: totalDelete,
    method: 'post',
    data: params,
  })
}

export function create (params) {
  return request({
    url: totalAdd,
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: user,
    method: 'delete',
    data: params,
  })
}

export function update (params) {
  return request({
    url: totalUpdate,
    method: 'post',
    data: params,
  })
}

export function upload (params) {
  return request({
    url: totalUpload,
    method: 'upload',
    data: params,
  })
}
