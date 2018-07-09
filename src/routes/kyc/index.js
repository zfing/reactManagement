import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from '../../components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const User = ({
  location, dispatch, user, loading,
}) => {
  location.query = queryString.parse(location.search)
  // console.log(location.query)
  const { query, pathname } = location
  const {
    list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys,
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
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    footer: <div>
      <Button type="primary"
        loading={loading.effects['kyc/queryExamineInfo']}
        onClick={() => dispatch({
        type: 'kyc/queryExamineInfo',
        payload: {
          authStatus: 2,
        },
      })}
      >审核通过</Button>
      <Button type="primary"
        loading={loading.effects['kyc/queryExamineInfo']}
        onClick={() => dispatch({
        type: 'kyc/queryExamineInfo',
        payload: {
          authStatus: 3,
        },
      })}
      >不通过</Button>
    </div>,
    // okText: '审核通过',
    // cancelText: '不通过',
    confirmLoading: loading.effects[`kyc/${modalType}`],
    title: '用户审核',
    wrapClassName: 'vertical-center-modal',
    width: 1000,
    onOk () {
      // dispatch({
      //   type: 'kyc/queryExamineInfo',
      //   payload: {
      //     authStatus: 2,
      //   },
      // })
      /* console.log(1);
       dispatch({
         type: `kyc/${modalType}`,
         // payload: data,
       })
         .then(() => {
           handleRefresh()
         }) */
    },
    onCancel () {
      // dispatch({
      //   type: 'kyc/queryExamineInfo',
      //   payload: {
      //     authStatus: 3,
      //   },
      // })
      // console.log(3)
      dispatch({
        type: 'kyc/hideModal',
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['kyc/query'] || loading.effects['kyc/kycSearchItem'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },

    onEditItem (item) {
      dispatch({
        type: 'kyc/queryItem',
        payload: {
          userId: item.userId,
        },
      })
    },

    /* rowSelection: {
       selectedRowKeys,
       onChange: (keys) => {
         dispatch({
           type: 'user/updateState',
           payload: {
             selectedRowKeys: keys,
           },
         })
       },
     }, */
  }
  const filterProps = {
    loading,
    isMotion,
    filter: {
      ...query,
    },
    dispatch,
    // query: user.filterParams,
    onFilterChange (value) {
      handleRefresh({
        ...value,
        page: 1,
      })
    },
    onSearchUser (search) {
      if (search !== '') {
        dispatch({
          type: 'kyc/kycSearchItem',
          payload: {
            searchSequence: search,
          },
        })
      } else {
        alert('请输入查询内容')
      }
    },
    onAdd () {
      dispatch({
        type: 'kyc/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'kyc/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'kyc/multiDelete',
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
    <Page inner loading={loading.effects['kyc/queryItem']}>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{
          marginBottom: 24,
          textAlign: 'right',
          fontSize: 13,
        }}
        >
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

export default connect(({ kyc, loading }) => ({
  user: kyc,
  loading,
}))(User)
