import { routerRedux } from 'dva/router'
import { login } from 'services/login'

export default {
  namespace: 'login',

  state: {
    userName: '',
    password: '',
  },

  effects: {
    * login ({ payload }, { put, call, select }) {
      const data = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.resultCode === '0') {
        const { from } = locationQuery
        yield put({
          type: 'app/setToken',
          payload: { token: data.data },
        })
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },

}
