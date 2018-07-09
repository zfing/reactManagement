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
import ModalDR from './ModalDR'


const User = ({
  location, dispatch, user, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalVisibleDR, modalType, isMotion, selectedRowKeys, selected, selectList,
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
  const modalDRProps = {
    item: {},
    closable: false,
    visible: modalVisibleDR,
    maskClosable: false,
    width: 550,
    loading,
    // footer: <div style={{ textAlign: 'center' }}>
    //   <Button type="primary" >确定</Button>
    // </div>,
    // okText: '确定',
    // cancelText: '取消',
    confirmLoading: loading.effects[`newList/${modalType}`],
    title: '导入文件',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'newList/upload',
        payload: data,
      })
        .then(() => {
          dispatch({
            type: 'newList/newGetTime',
            payload: {
              type: 1,
            },
            refresh: true,
          })
        })
    },
    onCancel () {
      dispatch({
        type: 'newList/hideModalDR',
      })
    },
  }

  const modalProps = {
    modalType,
    selected,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    width: 550,
    confirmLoading: loading.effects[`newList/${modalType}`],
    title: `${modalType === 'create' ? '添加' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    okText: '确定',
    cancelText: '取消',
    onOk (data) {
      debugger
      dispatch({
        type: `newList/${modalType}`,
        payload: data,
      })
        .then(() => {
          dispatch({
            type: 'newList/newGetTime',
            payload: {
              type: 1,
            },
            refresh: true,
          })
        })
    },
    onCancel () {
      dispatch({
        type: 'newList/hideModal',
      })
    },
  }


  const listProps = {
    dataSource: list,
    loading: loading.effects['newList/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'newList/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'newList/showModal',
        payload: {
          modalType: 'update',
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
  const filterProps = {
    selectList,
    selected,
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
        type: 'newList/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onSearchTime (value) {
      dispatch({
        type: 'newList/changeDate',
        payload: {
          selected: value.format('YYYY-M'),
        },
      })
    },
    onDR () {
      dispatch({
        type: 'newList/showModalDR',
        payload: {
          modalType: 'upload',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'newList/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'newList/multiDelete',
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
    <Page inner >
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
      {modalVisibleDR && <ModalDR {...modalDRProps} />}
    </Page>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ newList, loading }) => ({ user: newList, loading }))(User)
