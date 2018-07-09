import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import Bread from "../../components/Layout/Bread";

const { confirm } = Modal

const List = ({
  onDeleteItem, onEditItem, isMotion, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)

  // const handleMenuClick = (record, e) => {
  //   console.log(record.userId)
  //   if (e.key === '1') {
  //     onEditItem(record.userId)
  //   } else if (e.key === '2') {
  //     confirm({
  //       title: 'Are you sure delete this record?',
  //       onOk () {
  //         onDeleteItem(record.id)
  //       },
  //     })
  //   }
  // }
  const deleteCode = (record) => {
    console.log(record)
    confirm({
      title: '确定删除此项目信息？',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        onDeleteItem(record)
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
      dataIndex: 'id',
      key: 'id',
      width: 100,
    }, {
      title: '项目名称',
      dataIndex: 'coinNameCn',
      key: 'coinNameCn',
      width: 300,
      render: (text, record) =>
        <div>
          <div style={{ textAlign: 'left', marginLeft: 0, whiteSpace: 'nowrap'}} title={record.coinNameEn}>
            <img src={record.logoUrl} alt="" style={imgNameStyle}/>
            <span>
              {record.coinNameCn}<span style={{ color: 'green' }}>{ '(' + record.symbol + ')' }</span>
            </span>
          </div>
        </div>,
    },{
      title: '风险评级',
      dataIndex: 'risk',
      key: 'risk',
      render: (text, record) => {
        if(record.risk === 0){
          return '低'
        }else if(record.risk === 1){
          return '中'
        }else if(record.risk === 2){
          return '高'
        }else {
          return '暂无'
        }
      },
    }, {
      title: '可投资性',
      dataIndex: 'nickName',
      key: 'nickName',
      render: (text, record) => {
        if(record.popularity === 0){
          return '低'
        }else if(record.popularity === 1){
          return '中'
        }else if(record.popularity === 2){
          return '高'
        }else {
          return '暂无'
        }
      },
    },{
      title: '报告',
      dataIndex: 'downloadUrl',
      key: 'downloadUrl',
      render: (text, record) =>
        <div>
          <a href={record.downloadUrl} target="_blank">下载</a>
        </div>,
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
