import { request, config } from 'utils'

const { api } = config
const { ratingReport } = api
const { ratingDelete } = api
const { ratingSearch } = api
const { ratingAdd } = api
const { ratingUpload } = api
const { reportUpdate } = api

export function query (params) {
  return request({
    url: ratingReport,
    method: 'get',
    data: params,
  })
}

export function create (params) {
  return request({
    url: ratingAdd,
    method: 'post',
    data: params,
  })
}

export function remove (params) {
  return request({
    url: ratingReport,
    method: 'delete',
    data: params,
  })
}

export function update (params) {
  return request({
    url: ratingReport,
    method: 'patch',
    data: params,
  })
}

export function ratingReportUpdate (params) {
  return request({
    url: reportUpdate,
    method: 'post',
    data: params,
  })
}

export function ratingList (params) {
  return request({
    url: ratingReport,
    method: 'get',
    data: params,
  })
}
export function deleteItem (params) {
  return request({
    url: ratingDelete,
    method: 'post',
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

export function fileSignature (params) {
  return request({
    url: ratingUpload,
    method: 'get',
    data: params,
  })
}
