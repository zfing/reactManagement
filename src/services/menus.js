// import { request, config } from 'utils'

// const { api } = config
// const { menus } = api

export function query (params) {
  return new Promise((resolve) => {
    resolve({ list: require('../mock/menu.json') })
  })
  // return request({
  //   url: menus,
  //   method: 'get',
  //   data: params,
  // })
}
