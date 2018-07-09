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
      title: '本月排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
    }, {
      title: '交易所',
      dataIndex: 'exName',
      key: 'exName',
      width: 250,
      render: (text, record) =>
        <div style={{ textAlign: 'left' }}>
          <img src={record.imgUrl ? record.imgUrl : 'https://dprating.oss-cn-shanghai.aliyuncs.com/prod/website/default.svg'} alt="" style={imgNameStyle}/>
          <span>{record.exName}</span>
        </div>,
    }, {
      title: '上线新币数量',
      dataIndex: 'newCoinNum',
      key: 'newCoinNum',
      // render: (text, record) => `${record.age}`,
    }, {
      title: '上月涨跌幅',
      dataIndex: 'preTrend',
      key: 'preTrend',
      // render: (text, record) => `${record.preTrend}%`,
      render: (text, record) => (Math.round(Number(record.preTrend) * 10000)/100).toFixed(2) + '%',
    }, {
      title: '本月涨跌幅',
      dataIndex: 'trend',
      key: 'trend',
      render: (text, record) => (Math.round(Number(record.trend) * 10000)/100).toFixed(2) + '%',
    }, {
      title: '综合涨跌幅',
      dataIndex: 'totalTrend',
      key: 'totalTrend',
       render: (text, record) => (Math.round(Number(record.totalTrend) * 10000)/100).toFixed(2) + '%',
    }, {
      title: '排名变化',
      dataIndex: 'rankTrend',
      key: 'rankTrend',
       // render: (text, record) => `${record.age}`,
    }, {
      title: '操作',
      key: 'operation',
      width: 150,
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
