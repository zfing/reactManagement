/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from '../utils'
import { getBaseInfoList, deleteBaseInfo, addBaseInfo, checkBaseInfo, queryBaseInfo } from '../services/baseInfo'
import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'baseInfo',

  state: {
    currentItem: {},
    filterParams: {},
    checkModalVisible: false,
    addModalVisible: false,
    modalType: 'check',
  },

  // 监听数据
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        // 默认值
        if (location.pathname === '/baseInfo') {
          const selected = {
            type: '1',
            status: '1',
            page: 1,
            pageSize: 10,
          }
          const search = queryString.parse(location.search)
          dispatch({
            type: 'list',
            payload: {
              ...selected,
              ...search,
            },
          })
        }
      })
    },
  },
  // 接收数据
  effects: {
    * list ({ payload = {} }, { call, put }) {
      payload.currentPage = payload.page
      delete  payload.page
      const data = yield call(getBaseInfoList, payload)
      if (data.resultCode === '0') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.baseInfoList,
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
    * addBaseInfo ({ payload = {} }, { call, put }) {
      yield put({ type: 'hideAddModal' })
      const data = yield call(addBaseInfo, payload)
      if (data.resultCode === '0') {
      } else {
        throw data
      }
    },

    * queryBaseInfo ({ payload = {} }, { call, put }) {
      debugger
      const data = yield call(queryBaseInfo, {
        id: payload.id,
        coinId: payload.coinId,
      })
      if (data.resultCode === '0') {
        yield put({
          type: 'showCheckModal',
          payload: {
            currentItem: data.data,
            modalType: payload.modalType,
          },
        })
      } else {
        throw data
      }
    },

    * checkBaseInfo ({ payload = {} }, { call, put }) {
      console.log('payload:', payload)
      const data = yield call(checkBaseInfo, {
        ...payload,
        type: 2,
      })
      yield put({ type: 'hideCheckModal' })
      if (data.resultCode === '0') {
      } else {
        throw data
      }
    },
    * rejectBaseInfo ({ payload = {} }, { call, put }) {
      const data = yield call(checkBaseInfo, {
        ...payload,
        type: 3,
      })
      yield put({ type: 'hideCheckModal' })
      if (data.resultCode === '0') {
      } else {
        throw data
      }
    },

    * deleteBaseInfo ({ payload = {} }, { call, put }) {
      const data = yield call(deleteBaseInfo, payload)
      if (data.resultCode === '0') {
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
    showAddModal (state) {
      return {
        ...state,
        addModalVisible: true,
      }
    },

    hideAddModal (state) {
      return {
        ...state,
        addModalVisible: false,
      }
    },

    showCheckModal (state, { payload }) {
      return {
        ...state,
        ...payload,
        checkModalVisible: true,
      }
    },

    hideCheckModal (state, { payload }) {
      return {
        ...state,
        ...payload,
        checkModalVisible: false,
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
