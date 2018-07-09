import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Row, Col, Tag } from 'antd'
import styles from './Modal.less'
import city from '../../utils/city'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const span = {
  xs: 24,
  sm: 12,
  lg: 12,
  xl: 12,
  style: {
    minHeight: 40,
  },
}

const modal = ({
  item = {},
  // form: {
  //   getFieldDecorator,
  //   validateFields,
  //   getFieldsValue,
  // },
  ...modalProps
}) => {
  const handleOk = (data) => {
    // console.log(data)
    // validateFields((errors) => {
    //   if (errors) {
    //     return
    //   }
    //   const data = {
    //     ...getFieldsValue(),
    //     key: item.key,
    //   }
    //   // data.address = data.address.join(' ')
    //   onOk(data)
    // })
  }

  const modalOpts = {
    ...modalProps,
    // onOk: handleOk,
  }
  const imgStyle = {
    // height: 320,
    margin: 15,
    width: 440,
  }
  return (
    <Modal {...modalOpts}>
      <div>
        <Row>
          <Col {...span}>
            <span className={styles.name}>所在国家 ：</span><Tag>{item.countryName}</Tag>
          </Col>
          <Col {...span}>
            <span className={styles.name}>名字 ：</span><Tag>{item.lastName+item.firstName}</Tag>
          </Col>
          <Col {...span}>
            <span className={styles.name}>出生日期 ：</span><Tag>{item.birthday}</Tag>
          </Col>
          <Col {...span}>
            <span className={styles.name}>钱包地址 ：</span><Tag>{item.walletAddress}</Tag>
          </Col>
          <Col {...span}>
            <span className={styles.name}>提交证件 ：</span><Tag>{item.authType}</Tag>
          </Col>
          <Col {...span}>
            <span className={styles.name}>证件号 ：</span><Tag>{item.idNo}</Tag>
          </Col>
        </Row>
        <Row>
          <Col {...span}>
            证件照片 ：
          </Col>
        </Row>
        <Row>
          <Col>
            <a href={item.positivePic} target="_blank"><img style={imgStyle} src={item.positivePic} alt="" /></a>
            <a href={item.negativePic} target="_blank"><img style={imgStyle} src={item.negativePic} alt="" /></a>
          </Col>
        </Row>
        <Row>
          <Col {...span}>
           手持证件照 ：
          </Col>
        </Row>
        <Row>
          <Col>
            <a href={item.handPic} target="_blank"><img style={imgStyle} src={item.handPic} alt="" /></a>
          </Col>
        </Row>
        <Row>
          <Col {...span}>
            <span className={styles.name}>Telegram用户名 ：</span><Tag>{item.telegramName}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>
            Telegram截图 ：
          </Col>
        </Row>
        <Row>
          <Col>
            <a href={item.telegramPic} target="_blank"><img style={imgStyle} src={item.telegramPic} alt=""/></a>
          </Col>
        </Row>
        <Row>
          <Col {...span}>
            <span className={styles.name}>Twitter用户名 ：</span><Tag>{item.twitterName}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>
            Twitter截图 ：
          </Col>
        </Row>
        <Row>
          <Col>
            <a href={item.twitterPic} target="_blank"><img style={imgStyle} src={item.twitterPic} alt=""/></a>
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

modal.propTypes = {
  // form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default modal
