import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import moment from 'moment'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const { confirm } = Modal

const List = ({
  onDeleteItem, onEditItem, isMotion, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)

/*  const handleMenuClick = (record, e) => {
    // console.log(record)
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }*/
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      className: styles.avatar,
    }, {
      title: '用户邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    }, {
      title: '姓名',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 80,
      render: (text, record) => `${record.lastName}${record.firstName}`,
    }, {
      title: '提交证件',
      dataIndex: 'authType',
      key: 'authType',
      width: 70,
      render: (text, record) => {
        if(record.authType === 1) {
          return '身份证'
        } else if(record.authType === 2) {
          return '护照'
        }
      },
    }, {
      title: '证件号',
      dataIndex: 'idNo',
      key: 'idNo',
      width: 120,
    }, {
      title: '钱包地址',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
      width: 220,
    },
    {
      title: '提交日期',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 70,
      render: (text, record) => {
        return moment(record.gmtCreate).format("YYYY-MM-DD HH:mm") },
    }, {
      title: '审核状态',
      dataIndex: 'authStatus',
      key: 'authStatus',
      width: 70,
      render: (text, record) => {
        if(record.authStatus === 1){
          // return ' 待审核 '
          return  <span style={{ color:"red" }}>待审核</span>
        }else if(record.authStatus === 2){
          // return ' 已通过 '
          return  <span style={{ color:"blue" }}>已通过</span>
        }else if(record.authStatus === 3){
          return ' 未通过 '
        }else if(record.authStatus === 5){
          return <span style={{ color:"green" }}>已通知</span>
        }
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 50,
      render: (text, record) => <a onClick={() => onEditItem(record)}>审核</a>,
    },
  ]

  const AnimateBody = (props) => {
    return <AnimTableBody {...props} />
  }

  const CommonBody = (props) => {
    return <tbody {...props} />
  }

  return (
    <Table
      {...tableProps}
      className={classnames(styles.table, { [styles.motion]: isMotion })}
      bordered
      scroll={{ x: 1250 }}
      columns={columns}
      simple
      rowKey={record => record.id}
      components={{
        body: { wrapper: isMotion ? AnimateBody : CommonBody },
      }}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
