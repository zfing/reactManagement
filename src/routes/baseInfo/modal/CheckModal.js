import React from 'react'
import PropTypes from 'prop-types'
import styles from './checkModal.less'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  DatePicker,
  Spin,
  Upload,
  Icon,
  Button,
  message,
  Tag,
  Row,
  Col,
} from 'antd'

const labelSpan = {
  xs: 24,
  sm: 6,
  style: {
    textAlign: 'right',
    lineHeight: '32px',
    color: '#aaa',
  },
}
const valueSpan = {
  xs: 24,
  sm: 16,
  style: {},
}

class CheckModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getNameBySymbol (symbol) {
    const map = {
      submitContent: '提交内容',
      gmtCreate: '提交时间',
      infoSource: '信息来源',
      releaseTime: '发行时间',
      crowdFunding: '众筹价',
      officialWebsite: '官网链接',
      blockWebsiteList: '区块站',
      telegramGroup: '电报群',
      whitePaper: '白皮书链接',
      explainZh: '项目简介',
      githubAddr: '开源代码仓库',
      exchangeNum: '上交易所数量',
    }
    if (map.hasOwnProperty(symbol)) {
      return map[symbol]
    }
    return symbol
  }

  render () {
    let {
      currentItem,
      onCancel,
      ...checkModalProps
    } = this.props
    const { baseInfo, examineBaseInfo } = currentItem
    let varList = []
    for (let key in examineBaseInfo) {
      if (key === 'status' || key === 'userId' || key === 'enable' || key === 'id' || key === 'gmtCreate' || key === 'coinId' || key === 'coinName') {
        continue
      }
      console.log(baseInfo)
      if (baseInfo.hasOwnProperty(key)) {
        varList.push({
          name: this.getNameBySymbol(key),
          oldValue: baseInfo[key],
          curValue: examineBaseInfo[key],
        })
      } else {
        varList.push({
          name: this.getNameBySymbol(key),
          oldValue: '暂无',
          curValue: examineBaseInfo[key],
        })
      }
    }

    checkModalProps = {
      ...checkModalProps,
      onCancel,
      width: 650,
    }
    console.log(varList)

    const itemName = (name)=> {
      if (name == 'content' ) {
        return  '提交内容'
      } else if ( name == 'type' ) {
        return '提交类型'
      } else if ( name == '信息来源' ) {
        return '提交信息来源'
      }
    }
    const content = varList.map(item =>
      (<div className={styles.rowContainer} key={item.name}>
        <Row gutter={16}>
          <Col {...labelSpan}>
            <div>{itemName(item.name)}</div>
          </Col>
          <Col {...valueSpan}>
            <Input defaultValue={item.curValue}/>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col {...labelSpan}>
            <div>当前{itemName(item.name)}</div>
          </Col>
          <Col {...valueSpan}>
            <div className={styles.oldValue}>{item.oldValue}</div>
          </Col>
        </Row>
      </div>))

    return (
      <Modal {...checkModalProps} >
        {content}
      </Modal>
    )
  }
}

CheckModal.propTypes = {
  currentItem: PropTypes.object,
  onCancel: PropTypes.func,
}

export default CheckModal
