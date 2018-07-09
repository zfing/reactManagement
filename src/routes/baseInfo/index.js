import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Modal, Button, Popconfirm, Col } from 'antd'
import { Page } from '../../components'
import queryString from 'query-string'
import List from './list/List'
import Filter from './Filter'
import AddModal from './modal/AddModal'
import CheckModal from './modal/CheckModal'

const confirm = Modal.confirm

const BaseInfo = ({
                    location, dispatch, baseInfo, loading,
                  }) => {
  location.query = queryString.parse(location.search)
  // console.log(location.query)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, addModalVisible, checkModalVisible, modalType, selectedRowKeys,
  } = baseInfo

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const addModalProps = {
    visible: addModalVisible,
    onOk (fields) {
      console.log('fields:', fields)
      dispatch({
        type: 'baseInfo/addBaseInfo',
        payload: fields,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'baseInfo/hideAddModal',
      })
    },
  }

  const checkModalProps = {
    visible: checkModalVisible,
    currentItem,
    footer: modalType === 'check' ? (
      <div>
        <Button type="primary"
                loading={loading.effects['baseInfo/checkBaseInfo']}
                onClick={() => {
                  dispatch({
                    type: 'baseInfo/checkBaseInfo',
                    payload: {
                      id: currentItem.examineBaseInfo.id,
                    },
                  })
                    .then(() => {
                      handleRefresh()
                    })
                }}
        >审核通过</Button>
        <Button type="danger"
                loading={loading.effects['baseInfo/rejectBaseInfo']}
                onClick={() => {
                  dispatch({
                    type: 'baseInfo/rejectBaseInfo',
                    payload: {
                      id: currentItem.examineBaseInfo.id,
                    },
                  })
                    .then(() => {
                      handleRefresh()
                    })
                }}
        >不通过</Button>
      </div>
    ) : null,
    title: modalType === 'check' ? '审核' : '查看',
    onCancel () {
      dispatch({
        type: 'baseInfo/hideCheckModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['baseInfo/list'],
    pagination,
    location,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    onDeleteItem (item) {
      confirm({
        title: '提示',
        content: '确定删除该条记录？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'baseInfo/deleteBaseInfo',
            payload: {
              id: item.id,
            },
          }).then(() => {
            handleRefresh()
          })
        },
        onCancel() {},
      });
    },
    onPass (item) {
      dispatch({
        type: 'baseInfo/checkBaseInfo',
        payload: {
          id: item.id,
        },
      })
        .then(() => {
          handleRefresh()
        })
    },
    onNoPass (item) {
      dispatch({
        type: 'baseInfo/rejectBaseInfo',
        payload: {
          id: item.id,
        },
      })
        .then(() => {
          handleRefresh()
        })
    },
    onEditItem (item) {
      console.log(item)
      dispatch({
        type: 'baseInfo/queryBaseInfo',
        payload: {
          id: item.id,
          coinId: item.coinId,
          modalType: 'get',
        },
      })
    },
    onCheckItem (item) {
      debugger
      console.log(item)
      dispatch({
        type: 'baseInfo/queryBaseInfo',
        payload: {
          id: item.id,
          coinId: item.coinId,
          modalType: 'check',
        },
      })
    },
  }
  const filterProps = {
    filter: { ...query },
    onFilterChange (fields) {
      handleRefresh({
        ...fields,
        page: 1,
      })
    },
    onAdd () {
      dispatch({ type: 'baseInfo/showAddModal' })
    },
  }

  return (
    <Page inner loading={loading.effects['baseInfo/queryBaseInfo']}>
      <Filter {...filterProps} />
      <List {...listProps} />
      <AddModal {...addModalProps} />
      <CheckModal {...checkModalProps} />
    </Page>
  )
}

BaseInfo.propTypes = {
  baseInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading,
}))(BaseInfo)
