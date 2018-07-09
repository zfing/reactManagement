import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Divider  } from 'antd'
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

  const handleMenuClick = (record, e) => {
    console.log(record.userId)
    if (e.key === '1') {
      onEditItem(record.userId)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }
  const deleteItem = (record) => {
    console.log(record)
    confirm({
      title: '确定删除此项目信息？',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }
  const imgNameStyle = {
    width: 30,
    height: 30,
    marginRight: 10,
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'auditRank',
      key: 'auditRank',
      width: 100,
    }, {
      title: '名称',
      dataIndex: 'coinName',
      key: 'coinName',
      width: 200,
      render: (text, record) =>
        <div style={{ textAlign: 'left' }}>
          <img src={record.imgUrl ? record.imgUrl : 'https://dprating.oss-cn-shanghai.aliyuncs.com/prod/website/default.svg'} alt="" style={imgNameStyle}/>
          <span>{record.coinName}</span>
        </div>,
    }, {
      title: '市值排名',
      dataIndex: 'marketRank',
      key: 'marketRank',
      // render: (text, record) => `${record.age}`,
    }, {
      title: '风险评级',
      dataIndex: 'risk',
      key: 'risk',
      render: (text, record) => `${record.rate}星`,
    }, {
      title: '可投资性',
      dataIndex: 'investment',
      key: 'investment',
      // render: (text, record) => `${record.age}`,
    }, {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      // render: (text, record) => `${record.age}`,
    }, {
      title: '操作',
      key: 'operation',
      width: 110,
      render: (text, record) =>
        <span>
          <a onClick={() => onEditItem(record)}> 编辑 </a>
          <Divider type="vertical"  />
          <a onClick={() => deleteItem(record)}> 删除 </a>
        </span>
      ,
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
