const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

// 常用的api
const API_URL = 'http://47.94.240.141:8080/admin'
// 获取年月 banner
const API_URL1 = 'http://47.94.240.141:8080'

module.exports = {
  name: '后台管理系统',
  prefix: 'antdAdmin',
  footerText: 'Copyright © 2017-2018 DPRating.com All Rights Reserved',
  logo: '/dplogo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${API_URL}/user/login`,
    userLogout: `${API_URL}/user/logout`,
    // userLogin: `${APIV1}/user/login`,
    userInfo: `${API_URL}/user/getUser`,
    // userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
    // kyc
    kyc: `${API_URL}/examine/list`,
    kycInfo: `${API_URL}/examine/detail`,
    kycExamine: `${API_URL}/examine/examine`,
    kycSearch: `${API_URL}/examine/getUserByType`,
    // 旧评级报告
    ratingReport: `${API_URL}/rating/getSummaryList`,
    ratingDelete: `${API_URL}/rating/delete`,
    ratingSearch: `${API_URL}/rating/fuzzySearch`,
    ratingAdd: `${API_URL}/rating/add`,
    // 上传文件到服务器
    ratingUpload: `${API_URL}/user/signature`,

    reportUpdate: `${API_URL}/rating/update`,
    // 代码质量榜
    codeUpload: `${API_URL}/ranking/audit/upload`,
    codeList: `${API_URL}/ranking/audit/list`,
    codeTime: `${API_URL1}/api/ranking/allRecordTime`,
    codeDelete: `${API_URL}/ranking/audit/delete`,
    codeAdd: `${API_URL}/ranking/audit/add`,
    codeSearch: `${API_URL}/ranking/audit/fuzzySearch`,
    codeUpdate: `${API_URL}/ranking/audit/update`,
    // 上新质量榜
    newList: `${API_URL}/ranking/ex/exList`,
    newUpload: `${API_URL}/ranking/ex/upload`,
    newDelete: `${API_URL}/ranking/ex/delete`,
    newAdd: `${API_URL}/ranking/ex/add`,
    newUpdate: `${API_URL}/ranking/ex/update`,
    // baseInfo
    fuzzySearch: `${API_URL}/baseinfo/fuzzySearch`,
    baseInfoList: `${API_URL}/baseinfo/list`,
    addBaseInfo: `${API_URL}/baseinfo/add`,
    checkBaseInfo: `${API_URL}/baseinfo/update`,
    baseInfo: `${API_URL}/baseinfo/get`,
    deleteBaseInfo: `${API_URL}/baseinfo/delete`,
    // banner
    bannerList: `${API_URL}/banner/list`,
    bannerAdd: `${API_URL}/banner/save`,
    bannerUpdate: `${API_URL}/banner/update`,
    bannerDelete: `${API_URL}/banner/delete`,
    // 综合榜单
    totalList: `${API_URL}/ranking/comprehensive/list`,
    totalAdd: `${API_URL}/ranking/comprehensive/save`,
    totalUpload: `${API_URL}/ranking/comprehensive/upload`,
    totalDelete: `${API_URL}/ranking/comprehensive/delete`,
    totalUpdate: `${API_URL}/ranking/comprehensive/update`,
  },
  get token () {
    return localStorage.getItem(`${this.prefix}token`)
  },
  failToken () {
    let from = location.pathname
    window.location = `${location.origin}/login?from=${from}`
  },
}
