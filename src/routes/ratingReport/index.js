import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const User = ({
  location, dispatch, user, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, searchList,
  } = user

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const modalProps = {
    loading:loading.effects['kyc/Search'],
    searchList,
    onClear () {
      dispatch({
        type: 'ratingReport/searchSuccess',
        payload: {
          searchList: [],
        },
      })
    },
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    width: 600,
    confirmLoading: loading.effects[`ratingReport/${modalType}`],
    title: `${modalType === 'create' ? '添加' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    okText: '确定',
    cancelText: '取消',
    onOk (data) {
      dispatch({
        type: `ratingReport/${modalType}`,
        payload: data,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'ratingReport/hideModal',
      })
    },

    onSearch (value) {
      // console.log(value)
      dispatch({
        type: 'ratingReport/Search',
        payload: value,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['ratingReport/query'] || loading.effects['ratingReport/delete'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },

    onDeleteItem (item) {
      dispatch({
        type: 'ratingReport/delete',
        payload: item.id,
      })
        // .then(() => {
        //   handleRefresh({
        //     page: (list.length === 1 && pagination.current > 1) ? pagination.current - 1 : pagination.current,
        //   })
        // })
    },
    onEditItem (item) {
      // console.log(item)
      // debugger
      dispatch({
        type: 'ratingReport/showModal',
        payload: {
          modalType: 'ratingUpdate',
          currentItem: item,
        },
      })
    },
    // rowSelection: {
    //   selectedRowKeys,
    //   onChange: (keys) => {
    //     dispatch({
    //       type: 'user/updateState',
    //       payload: {
    //         selectedRowKeys: keys,
    //       },
    //     })
    //   },
    // },
  }
  // console.log(listProps)
  const filterProps = {
    isMotion,
    filter: {
      ...query,
    },
    onFilterChange (value) {
      handleRefresh({
        ...value,
        page: 1,
      })
    },
    onAdd () {
      dispatch({
        type: 'ratingReport/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'ratingReport/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'ratingReport/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
      .then(() => {
        handleRefresh({
          page: (list.length === selectedRowKeys.length && pagination.current > 1) ? pagination.current - 1 : pagination.current,
        })
      })
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title="Are you sure delete these items?" placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" style={{ marginLeft: 8 }}>Remove</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ ratingReport, loading }) => ({ user: ratingReport, loading }))(User)
