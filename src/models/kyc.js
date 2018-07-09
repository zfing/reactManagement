/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { create, update, kycUserInfo, kycExamineInfo, kycSearchUser } from 'services/kyc'
import * as kycsService from 'services/kycs'
import { pageModel } from './common'

const { query } = kycsService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'kyc',

  state: {
    currentItem: {},
    filterParams: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}kycIsMotion`) === 'true',
  },

  // 监听数据
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        // 默认值
        if (location.pathname === '/kyc') {
          const selected = {
            type: '5',
            authStatus: '1',
            authType: '0',
          }
          // payload: {  ...selected, ...payload, }, payload 放后面用来替换默认值
          const payload = queryString.parse(location.search) || {
            page: 1,
            pageSize: 10,
          }
          dispatch({
            type: 'query',
            payload: {
              ...selected,
              ...payload,
            },
          })
        }
      })
    },
  },
  // 接收数据
  effects: {
    * query ({ payload = {} }, { call, put }) {
      payload.currentPage = payload.page
      delete  payload.page
      const data = yield call(query, payload)
      if (data.resultCode === '0') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data,
            pagination: {
              current: Number(payload.currentPage) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalSize,
            },
          },
        })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(usersService.remove, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: { selectedRowKeys: [] },
        })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = {
        ...payload,
        id,
      }
      const data = yield call(update, newUser)
      console.log(data)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * kycSearchItem ({ payload = {} }, { call, put }) {
      const data = yield call(query)
      let payLoads = queryString.parse(location.search)
      if (!payload) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data,
            current: Number(payload.currentPage) || 1,
            pageSize: Number(payload.pageSize) || 10,
            ...payLoads,
          },
        })
        return null
      }
      const dataSearch = yield call(kycSearchUser, payload)
      if (dataSearch.resultCode === '0') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: dataSearch.data,
          },
        })
      } else {
        throw dataSearch
      }
    },

    * queryItem ({ payload = {} }, { call, put }) {
      const data = yield call(kycUserInfo, payload)
      if (data.resultCode === '0') {
        yield put({
          type: 'showModal',
          payload: {
            currentItem: data.data,
          },
        })
      } else {
        throw data
      }
    },

    * kycSearchItem ({ payload = {} }, { call, put }) {
      const data = yield call(query)
      let payLoads = queryString.parse(location.search)
      if (!payload) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data,
            current: Number(payload.currentPage) || 1,
            pageSize: Number(payload.pageSize) || 10,
            ...payLoads,
          },
        })
        return null
      }
      const dataSearch = yield call(kycSearchUser, payload)
        if (dataSearch.resultCode === '0') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: dataSearch.data,
            } })
        } else {
          throw dataSearch
        }
    },

    * queryExamineInfo ({ payload = {} }, { call, put, select }) {
      const userId = yield select(({ kyc }) => kyc.currentItem.userId)
      const data = yield call(kycExamineInfo, {
        ...payload,
        userId,
      })
      if (data.resultCode === '0') {
        let payLoad = queryString.parse(location.search)
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload: {
            type: '5',
            authStatus: '1',
            authType: '0',
            ...payLoad,
          },
        })
      } else {
        throw data
      }
    },

  },

  // 处理数据
  reducers: {
    updateFilterParams (state, { payload }) {
      return {
        ...state,
        filterParams: {
          ...state.filterParams,
          ...payload,
        },
      }
    },
    showModal (state, { payload }) {
      // console.log(payload)
      return {
        ...state, ...payload,
        modalVisible: true,
      }
    },

    hideModal (state) {
      return {
        ...state,
        modalVisible: false,
      }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}kycIsMotion`, !state.isMotion)
      return {
        ...state,
        isMotion: !state.isMotion,
      }
    },

  },
})
