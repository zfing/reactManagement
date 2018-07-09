import { request, config } from 'utils'

const { api } = config
const { user } = api
const { newUpload } = api
const { newList } = api
const { codeTime } = api
const { newDelete } = api
const { newAdd } = api
const { newUpdate } = api

export function query (params) {
  return request({
    url: newList,
    method: 'get',
    data: params,
  })
}

export function NewDelete (params) {
  return request({
    url: newDelete,
    method: 'post',
    data: params,
  })
}
export function newGetTime (params) {
  return request({
    url: codeTime,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: newAdd,
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
    url: newUpdate,
    method: 'post',
    data: params,
  })
}

export function upload (params) {
  return request({
    url: newUpload,
    method: 'upload',
    data: params,
  })
}
