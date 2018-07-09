import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Divider } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import moment from 'moment'
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
  const bannerImgStyle = {
    width: 300,
    height: 100,
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      // width: 100,
    }, {
      title: 'Banner图',
      dataIndex: 'webImgUrl',
      key: 'webImgUrl',
      width: 250,
      render: (text, record) =>
        <a href={record.webJumpUrl} target="_blank">
          <img src={record.webImgUrl ? record.webImgUrl : 'https://dprating.oss-cn-shanghai.aliyuncs.com/prod/website/banner.png'} alt="" {...bannerImgStyle}/>
        </a>,
    }, {
      title: 'Banner描述',
      dataIndex: 'activityDesc',
      key: 'activityDesc',
      // render: (text, record) => `${record.rate}星`,
    }, {
      title: '上线日期',
      dataIndex: 'releaseTime',
      key: 'releaseTime',
      render: (text, record) => {
        return moment(record.releaseTime).format("YYYY-MM-DD")
      },
    }, {
      title: '下架日期',
      dataIndex: 'downlineTime',
      key: 'downlineTime',
      render: (text, record) => {
        return moment(record.downlineTime).format("YYYY-MM-DD")
      },
    }, {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
       // render: (text, record) => `${record.hotRate}`,
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
       render: (text, record) =>{
        if (record.status === 1){
          return '展示中'
        } else if (record.status === 2) {
          return '已过期'
        }
       },
    }, {
      title: '操作',
      key: 'operation',
      width: 110,
      render: (text, record) =>
        <div>
          <a onClick={() => onEditItem(record)}> 编辑 </a>
          <Divider type="vertical" />
          <a onClick={() => deleteCode(record)}> 删除 </a>
        </div>,
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
