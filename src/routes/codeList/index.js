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
import moment from  'moment'

const User = ({
  location, dispatch, user, loading,
}) => {
  location.query = queryString.parse(location.search)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalVisibleDR, modalType, isMotion, selectedRowKeys, selected, selectList, searchList,
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
    dispatch,
    item: {},
    closable: false,
    visible: modalVisibleDR,
    maskClosable: false,
    width: 550,
    loading,
    // okText: '确定',
    // cancelText: '取消',
    confirmLoading: loading.effects[`codeList/${modalType}`],
    title: '导入文件',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'codeList/upload',
        payload: data,
      })
        .then(() => {
          debugger
          dispatch({
            type: 'codeList/codeGetTime',
            payload: {
              type: 2,
            },
            refresh: true,
          })
        })
    },
    onCancel () {
      dispatch({
        type: 'codeList/hideModalDR',
      })
    },
  }

  const modalProps = {
    modalType,
    selected,
    searchList,
    onClear () {
      dispatch({
        type: 'codeList/searchSuccess',
        payload: {
          searchList: [],
        },
      })
    },
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    width: 600,
    // footer: <div style={{ textAlign: 'center' }}>
    //   <Button type="primary" >确定</Button>
    // </div>,
    confirmLoading: loading.effects[`codeList/${modalType}`],
    title: `${modalType === 'create' ? '添加' : '编辑'}`,
    wrapClassName: 'vertical-center-modal',
    okText: '确定',
    cancelText: '取消',
    onOk (data) {
      debugger
      dispatch({
        type: `codeList/${modalType}`,
        payload: data,
      })
        .then(() => {
        dispatch({
          type: 'codeList/codeGetTime',
          payload: {
            type: 2,
          },
          refresh: true,
        })
      })
    },
    onCancel () {
      dispatch({
        type: 'codeList/hideModal',
      })
    },
    onSearch (value) {
      // console.log(value)
      dispatch({
        type: 'codeList/Search',
        payload: value,
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['codeList/query'],
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
        type: 'codeList/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'codeList/showModal',
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
  // console.log(listProps)
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
        type: 'codeList/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onSearchTime (value) {
      dispatch({
        type: 'codeList/changeDate',
        payload: {
          selected: value.format('YYYY-M'),
        },
      })
    },
    onDR () {
      dispatch({
        type: 'codeList/showModalDR',
        payload: {
          modalType: 'upload',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'codeList/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'codeList/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
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

export default connect(({ codeList, loading }) => ({ user: codeList, loading }))(User)
