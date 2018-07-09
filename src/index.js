import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'
import { config } from 'utils'

const { failToken } = config
const ERROR_DURATION = 2

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError (error) {
    if (error.resultCode === '3') {
      failToken()
    } else {
      message.error(error.msg || error.message, ERROR_DURATION)
    }
  },
})

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
