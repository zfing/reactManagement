import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
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
  const deleteCode = (record) => {
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
      title: '排名',
      dataIndex: 'auditRank',
      key: 'auditRank',
      width: 100,
    }, {
      title: '项目名称',
      dataIndex: 'coinName',
      key: 'coinName',
      width: 200,
      render: (text, record) =>
        <div style={{ textAlign: 'left' }}>
          <img src={record.imgUrl ? record.imgUrl : 'https://dprating.oss-cn-shanghai.aliyuncs.com/prod/website/default.svg'} alt="" style={imgNameStyle}/>
          <span>{record.coinName}</span>
        </div>,
    }, {
      title: '本月星级',
      dataIndex: 'rate',
      key: 'rate',
      render: (text, record) => `${record.rate}星`,
    }, {
      title: '当月提交',
      dataIndex: 'commitTimes',
      key: 'commitTimes',
      // render: (text, record) => `${record.age}`,
    }, {
      title: '提交类型',
      dataIndex: 'commitEvaluator',
      key: 'commitEvaluator',
      // render: (text, record) => `${record.age}`,
    }, {
      title: '库热度',
      dataIndex: 'hotRate',
      key: 'hotRate',
       render: (text, record) => `${record.hotRate}`,
    }, {
      title: '开发者数',
      dataIndex: 'developerNum',
      key: 'developerNum',
       // render: (text, record) => `${record.age}`,
    }, {
      title: '迭代速率',
      dataIndex: 'rateEvaluator',
      key: 'rateEvaluator',
       // render: (text, record) => `${record.age}`,
    }, {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
       // render: (text, record) => `${record.trend}`,
    }, {
      title: '市值排名',
      dataIndex: 'rank',
      key: 'rank',
       // render: (text, record) => `${record.age}`,
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) =>
        <div>
          <a onClick={() => onEditItem(record)} style={{ marginLeft: 5 }}> 编辑 </a>
          <a onClick={() => deleteCode(record)} style={{ marginLeft: 5 }}> 删除 </a>
        </div>
      ,
      // render: (text, record) => {
      //   return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
      // },
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
