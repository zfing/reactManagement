import { request, config } from 'utils'

const { api } = config
const { user } = api
const { bannerList } = api
const { bannerAdd } = api
const { bannerUpdate } = api
const { bannerDelete } = api

export function query (params) {
  return request({
    url: bannerList,
    method: 'get',
    data: params,
  })
}

export function BannerDelete (params) {
  return request({
    url: bannerDelete,
    method: 'post',
    data: params,
  })
}

export function create (params) {
  return request({
    url: bannerAdd,
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
    url: bannerUpdate,
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
