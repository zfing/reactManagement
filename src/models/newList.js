/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { create, remove, update, upload, newGetTime, NewDelete } from 'services/newList'
import * as newListsService from 'services/newLists'
import { pageModel } from './common'
import lodash from 'lodash'
const { query } = newListsService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'newList',

  state: {
    refresh: true,
    selected: '',
    selectList: [],
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
        if (location.pathname === '/newList') {
          // const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
          dispatch({
            type: 'newGetTime',
            payload: {
              type: 1,
            },
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put, select }) {
      const { selected } = yield select(_ => _.newList)
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

    * newGetTime ({ payload, refresh }, { call, put, select }) {
      const { selected } = yield select(({ newList }) => newList)
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
      const data = yield call(newGetTime, payload)
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
        // const codeNewDate = data.data[data.data.length - 1]
        // const newYear = codeNewDate.year
        // const newMonth = codeNewDate.month
        // const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        // yield put({
        //   type: 'query',
        //   payload: {
        //     year: newYear,
        //     month: newMonth,
        //     ...payload,
        //   },
        })

        const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({
          type: 'query',
          payload: {
            ...payload,
          },
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


    * delete ({ payload }, { select, call, put }) {
      const { selected } = yield select(_ => _.newList)
      const year = selected.split('-')[0]
      const month = selected.split('-')[1]
      const payloads = {
        id: payload,
        year: year,
        month: month,
      }
      const data = yield call(NewDelete, payloads)
      if (data.resultCode === '0') {
        const payloads = queryString.parse(location.search) || { page: 1, pageSize: 10 }
        yield put({
          type: 'query',
          payloads,
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
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    * changeDate ({ payload }, { put }) {
      yield put({ type: 'getCodeRankTimeSuccess', payload })
      yield put({ type: 'query' })
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ newList }) => newList.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      debugger
      if (data.resultCode === '0') {
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

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    getCodeRankTimeSuccess (state, { payload }) {
      return { ...state, ...payload }
    },

  },
})
