import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, DatePicker } from 'antd'
import ReactDOM from 'react-dom'
import lrz from 'lrz'
import city from '../../utils/city'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { disabledDate } from "./Filter"

const { MonthPicker } = DatePicker
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class modal extends React.Component {
  // constructor (props) {
  //   super (props)
  //   this.state = {
  //     imgSource: null,
  //   }
  // }

  render () {
    const {
      item = {},
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalDRProps
    } = this.props

    const modalOpts = {
      ...modalDRProps,
    }
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal" >
          <FormItem label="上传文件" {...formItemLayout}>
            <input type="file"/>
          </FormItem>
          <FormItem label="期数" {...formItemLayout}>
            <MonthPicker disabledDate={disabledDate} placeholder="选择期数" />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
