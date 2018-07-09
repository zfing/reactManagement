import { request, config } from 'utils'

const { api } = config
const { ratingReport } = api

export function query (params) {
  return request({
    url: ratingReport,
    method: 'get',
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

export function ratingList (params) {
  return request({
    url: ratingReport,
    method: 'get',
    data: params,
  })
}
