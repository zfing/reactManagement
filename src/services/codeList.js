import { request, config } from 'utils'

const { api } = config
const { user } = api
const { codeUpload } = api
const { codeList } = api
const { codeTime } = api
const { codeDelete } = api
const { codeAdd } = api
const { codeSearch } = api
const { codeUpdate } = api

export function codeGetTime (params) {
  return request({
    url: codeTime,
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

export function CodeDelete (params) {
  return request({
    url: codeDelete,
    method: 'post',
    data: params,
  })
}
export function CodeAdd (params) {
  return request({
    url: codeAdd,
    method: 'post',
    data: params,
  })
}

export function create (params) {
  return request({
    url: user.replace('/:id', ''),
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
    url: codeUpdate,
    method: 'post',
    data: params,
  })
}

export function upload (params) {
  return request({
    url: codeUpload,
    method: 'upload',
    data: params,
  })
}
