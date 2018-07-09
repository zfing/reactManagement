import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag, Divider, Icon } from 'antd'
import moment from 'moment'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

const { confirm } = Modal

const List = ({
  onDeleteItem, onEditItem, onCheckItem, location, ...tableProps, onPass, onNoPass
}) => {
  location.query = queryString.parse(location.search)

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    }, {
      title: '项目名称',
      dataIndex: 'coinName',
      key: 'coinName',
      width: 80,
    }, {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      render: (text, record) => {
        if (record.userId) {
          return <span>{record.userId}</span>
        } else {
          return <span>admin</span>
        }
      },
    },
    {
      title: '提交类型',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      render: (text, record) => {
        if (record.type === 1) {
          return <span>发行时间</span>
        } else if (record.type === 2){
          return <span>众筹价格</span>
        } else if (record.type === 3){
          return <span>官方网站</span>
        } else if (record.type === 4){
          return <span>区块站</span>
        } else if (record.type === 5){
          return <span>上架交易所数量</span>
        } else if (record.type === 6){
          return <span>电报群</span>
        } else if (record.type === 7){
          return <span>github地址</span>
        } else if (record.type === 8){
          return <span>白皮书地址</span>
        } else if (record.type === 9){
          return <span>英文说明</span>
        } else if (record.type === 10){
          return <span>中文说明</span>
        } else if (record.type === 11){
          return <span>消息来源</span>
        } else {
          return <span>{record.type}</span>
        }
      },
    },
    {
      title: '当前内容',
      dataIndex: 'originalContent',
      key: 'originalContent',
      width: 200,
      render: (text, record) => `${record.originalContent}`,
    },
    {
      title: '提交内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      render: (text, record) => `${record.content}`,
    },
    {
      title: '提交时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 95,
      render: (text, record) => {
        return moment(record.gmtCreate)
          .format('YYYY-MM-DD HH:mm')
      },
    }, {
      title: '信息来源',
      dataIndex: 'infoSource',
      key: 'infoSource',
      width: 80,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text, record) => {
        if (record.status === 1) {
          return <span style={{ color: "blue" }}>待审核</span>
        } else if (record.status === 2) {
          return <span style={{ color: "green" }}>已通过</span>
        } else if (record.status === 3) {
          return <span style={{ color: "red" }}>未通过</span>
        }
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 130,
      render: (text, record) =>
        (
          <span>
            {/*{record.status === 1 && <a onClick={() => onCheckItem(record)}>审核</a>}*/}
            {/*{record.status !== 1 && <a onClick={() => onEditItem(record)}>查看</a>}*/}
            {<a onClick={() => onPass(record)}>通过</a>}
            <Divider type="vertical" />
            {<a onClick={() => onNoPass(record)}>不通过</a>}
            <Divider type="vertical" />
            <a onClick={() => onDeleteItem(record)}><Icon type="delete" title = '删除' /></a>
          </span>
        ),
    },
  ]

  const CommonBody = (props) => {
    return <tbody {...props} />
  }

  return (
    <Table
      {...tableProps}
      bordered
      // scroll={{ x: 1250 }}
      columns={columns}
      simple
      rowKey={record => record.id}
      components={{
        body: { wrapper: CommonBody },
      }}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onCheckItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
