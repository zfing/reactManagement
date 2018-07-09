import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS, token } from './config'

const fetch = (options) => {
  let { data, url, withCredentials } = options

  const method = options.method.toLowerCase() || 'get'
  const fetchType = options.fetchType
  const headers = options.headers || {}

  const cloneData = lodash.cloneDeep(data)

  let formData = new FormData()

  for (let key in cloneData) {
    formData.append(key, cloneData[key])
  }

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  const config = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
      adminToken: token,
    },
    withCredentials: !withCredentials, // 允许跨域发生cookie
  }

  for (let key in cloneData) {
    if (lodash.isEmpty(cloneData[key]) && (!lodash.isNumber(cloneData[key]))) {
      delete cloneData[key]
    }
  }
  switch (method) {
    case 'get':
      return axios.get(url, {
        params: {
          ...cloneData,
        },
        ...config,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        ...config,
      })
    case 'post':
      return axios.post(url, qs.stringify(cloneData), {
        ...config,
      })
    case 'put':
      return axios.put(url, cloneData, {
        ...config,
      })
    case 'patch':
      return axios.patch(url, cloneData, {
        ...config,
      })
    case 'upload':
      return axios.post(url, formData, {
        ...config,
        'Content-Type': 'application/form-data',
      })
    default:
      return axios(options)
  }
}

const request = (options = {}) => {
  return fetch(options)
    .then(res => res.data)
    .catch((error) => {
      console.error(error)
      const { response } = error
      let msg
      if (response && response instanceof Object) {
        const { data, statusText } = response
        msg = data.message || statusText
      } else {
        msg = error.msg || error.message || 'Network Error'
      }
      return { code: false, msg }
    })
}

export default request
