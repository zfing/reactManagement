/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { create, remove, update, deleteItem, fuzzySearch, ratingReportUpdate } from 'services/ratingReport'
import * as ratingReportsService from 'services/ratingReports'
import { pageModel } from './common'

const { query } = ratingReportsService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'ratingReport',

  state: {
    searchList: [],
    list: [],
    currentItem: {},
    modalVisible: false,
    modalVisibleDR: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/ratingReport') {
          const selected = {
            page: '1',
            pageSize: '10',
          }
          const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
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

  effects: {

    * query ({ payload = {} }, { call, put }) {
      payload.currentPage = payload.page
      delete  payload.page
      const data = yield call(query, payload)
      // console.log(data)
      if (data.resultCode === '0') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.ratingList,
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(deleteItem, { id: payload })
      if (data.resultCode === '0') {
        const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({ type: 'query', payload })
      } else {
        throw data
      }
    },

    * Search ({ payload }, { call, put }) {
      if (!payload) {
        yield put({
          type: 'searchSuccess',
          payload: {
            searchList: [],
          },
        })
        return null
      }
      const data = yield call(fuzzySearch, { sequence: payload })
      // console.log(data)
      if (data.resultCode === '0') {
        yield put({
          type: 'searchSuccess',
          payload: {
            searchList: data.data,
          },
        })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(usersService.remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.resultCode === '0') {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * ratingUpdate ({ payload }, { call, put }) {
      const data = yield call(ratingReportUpdate, payload)
      if (data.resultCode === '0') {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    showModalDR (state) {
      return { ...state, modalVisibleDR: true }
    },

    hideModalDR (state) {
      return { ...state, modalVisibleDR: false }
    },

    searchSuccess (state, { payload }) {
      // console.log(payload)
      return { ...state, ...payload }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
