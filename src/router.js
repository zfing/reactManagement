import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/ratingReport')],
      component: () => import('./routes/ratingReport/'),
    },
    // {
    //   path: '/user',
    //   models: () => [import('./models/user')],
    //   component: () => import('./routes/user/'),
    // }, {
    //   path: '/user/:id',
    //   models: () => [import('./models/user/detail')],
    //   component: () => import('./routes/user/detail/'),
    // }, {
    //   path: '/login',
    //   models: () => [import('./models/login')],
    //   component: () => import('./routes/login/'),
    // }, {
    //   path: '/request',
    //   component: () => import('./routes/request/'),
    // }, {
    //   path: '/UIElement/iconfont',
    //   component: () => import('./routes/UIElement/iconfont/'),
    // }, {
    //   path: '/UIElement/search',
    //   component: () => import('./routes/UIElement/search/'),
    // }, {
    //   path: '/UIElement/dropOption',
    //   component: () => import('./routes/UIElement/dropOption/'),
    // }, {
    //   path: '/UIElement/layer',
    //   component: () => import('./routes/UIElement/layer/'),
    // }, {
    //   path: '/UIElement/dataTable',
    //   component: () => import('./routes/UIElement/dataTable/'),
    // }, {
    //   path: '/UIElement/editor',
    //   component: () => import('./routes/UIElement/editor/'),
    // }, {
    //   path: '/chart/ECharts',
    //   component: () => import('./routes/chart/ECharts/'),
    // }, {
    //   path: '/chart/highCharts',
    //   component: () => import('./routes/chart/highCharts/'),
    // }, {
    //   path: '/chart/Recharts',
    //   component: () => import('./routes/chart/Recharts/'),
    // }, {
    //   path: '/post',
    //   models: () => [import('./models/post')],
    //   component: () => import('./routes/post/'),
    // },
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    },
    {
      path: '/ratingReport',
      models: () => [import('./models/ratingReport')],
      component: () => import('./routes/ratingReport/'),
    },
    {
      path: '/newRatingReport',
      models: () => [import('./models/newRatingReport')],
      component: () => import('./routes/newRatingReport/'),
    },
    {
      path: '/codeList',
      models: () => [import('./models/codeList')],
      component: () => import('./routes/codeList/'),
    },
    {
      path: '/newList',
      models: () => [import('./models/newList')],
      component: () => import('./routes/newList/'),
    },
    {
      path: '/totalList',
      models: () => [import('./models/totalList')],
      component: () => import('./routes/totalList/'),
    },
    {
      path: '/kyc',
      models: () => [import('./models/kyc')],
      component: () => import('./routes/kyc/'),
    },
    {
      path: '/baseInfo',
      models: () => [import('./models/baseInfo')],
      component: () => import('./routes/baseInfo/'),
    },
    {
      path: '/sowingMap',
      models: () => [import('./models/sowingMap')],
      component: () => import('./routes/sowingMap/'),
    },
    {
      path: '/fileUpload',
      // models: () => [import('./models/fileUpload')],
      component: () => import('./routes/fileUpload/'),
    },
    // {
    //   path: '/notice',
    //   models: () => [import('./models/notice')],
    //   component: () => import('./routes/notice/'),
    // },
  ]

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={enUS}>
        <App>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/ratingReport" />)} />
            {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
            <Route component={error} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
