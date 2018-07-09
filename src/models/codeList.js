/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { create, remove, update, upload, codeGetTime, CodeDelete, CodeAdd, CodeSearch } from 'services/codeList'
import * as codeListsService from 'services/codeLists'
import { pageModel } from './common'
import lodash from 'lodash'
const { query } = codeListsService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'codeList',

  state: {
    searchList: [],
    currentItem: {},
    selected: '',
    selectList: [],
    modalVisible: false,
    modalVisibleDR: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/codeList') {
          // 默认进入此页面就调用年月接口来获取，参数固定为 type = 2，这是代码榜单的值
          dispatch({
            type: 'codeGetTime',
            payload: {
              type: 2,
            },
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put, select }) {
      const { selected } = yield select(_ => _.codeList)
      payload.currentPage = payload.page
      delete  payload.page
      const data = yield call(query, {
        ...payload,
        year: selected.split('-')[0],
        month: selected.split('-')[1],
      })
      if (data.resultCode === '0') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.rankingList,
            pagination: {
              current: Number(payload.currentPage) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalSize,
            },
          },
        })
      }
    },

    * codeGetTime ({ payload, refresh }, { call, put, select }) {
      const { selected } = yield select(({ codeList }) => codeList)
      if (!refresh && selected) {
        const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({
          type: 'query',
          payload: {
            // year: newYear,
            // month: newMonth,
            // year: lastData.year,
            // month: lastData.month,
            ...payload,
          },
        })
        return null
      }
      const data = yield call(codeGetTime, payload)
      // 获取到年月 然后调用列表查询接口，将最新的年月当成参数传入
      if (data.resultCode === '0') {
        const selectList = data.data.map(_ => `${_.year}-${_.month}`)
        if (!Array.isArray(selectList) || !selectList.length) return null
        yield put({
          type: 'getCodeRankTimeSuccess',
          payload: {
            selectList,
            selected: lodash.last(selectList),
          },
        })
        // const codeNewDate = data.data[data.data.length - 1]
        // const newYear = codeNewDate.year
        // const newMonth = codeNewDate.month
        // const lastData = lodash.last(data.data)
        const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({
          type: 'query',
          payload: {
            // year: newYear,
            // month: newMonth,
            // year: lastData.year,
            // month: lastData.month,
            ...payload,
          },
        })
      } else {
        throw data
      }
    },

    * changeDate ({ payload }, { put }) {
      yield put({ type: 'getCodeRankTimeSuccess', payload })
      yield put({ type: 'query' })
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(CodeDelete, { id: payload })
      if (data.resultCode === '0') {
        const payloads = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({
          type: 'query',
          payload: payloads,
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
      const data = yield call(CodeAdd, payload)
      if (data.resultCode === '0') {
        yield put({ type: 'hideModal' })
        const payloads = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({
          type: 'query',
          payload: payloads,
        })
      } else {
        throw data
      }
    },

    * upload ({ payload }, { call, put }) {
      const data = yield call(upload, payload)
      if (data.resultCode === '0') {
        yield put({ type: 'hideModalDR' })
      } else {
        throw data
      }
    },


    * update ({ payload }, { call, put }) {
      debugger
      // const id = yield select(({ codeList }) => codeList.currentItem.id)
      // const newUser = { ...payload, id }
      const data = yield call(update, payload)
      if (data.resultCode === '0') {
        const payloads = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({ type: 'hideModal' })
        yield put({
          type: 'query',
          payload: payloads,
        })
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
      const data = yield call(CodeSearch, { sequence: payload })
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

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    searchSuccess (state, { payload }) {
      // console.log(payload)
      return { ...state, ...payload }
    },
    getCodeRankTimeSuccess (state, { payload }) {
      return { ...state, ...payload }
    },

  },
})
