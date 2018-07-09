import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, DatePicker, Upload, Button, Icon, LocaleProvider  } from 'antd'
import ReactDOM from 'react-dom'
import lrz from 'lrz'
import city from '../../utils/city'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { disabledDate } from "./Filter"
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/src/locale/zh-cn'
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
  constructor (props) {
    super (props)
    this.state = {
      file: null,
      year: null,
      month: null,
    }
  }
  handleChange = (e) => {
    console.log(e.target.files[0])
    this.setState({
      file: e.target.files[0],
    })
  }
  dataChange = (value) => {
    this.setState({
      year : new Date(value._d).getFullYear(),
      month : new Date(value._d).getMonth() + 1,
    })
  }
  render () {
    const {
      onCancel,
      loading,
      item = {},
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalDRProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          file: this.state.file,
          year: this.state.year,
          month: this.state.month,
        }
        onOk(data)
      })
    }
    const modalOpts = {
      ...modalDRProps,
      onOk: handleOk,
      footer: <div>
        <Button type="default" onClick={() => onCancel()}>取消</Button>
        <Button type="primary" loading={loading.effects['newList/upload']} onClick={() => handleOk()}>确定</Button>
      </div>,
    }
    return (
      <LocaleProvider locale={zh_CN}>
      <Modal {...modalOpts}>
        <Form layout="horizontal" >
          <FormItem label="报告" {...formItemLayout}>
            <Input type="file" onChange={this.handleChange} />
          </FormItem>
          <FormItem label="期数" {...formItemLayout}>
            <MonthPicker  placeholder="选择期数" onChange={this.dataChange}/>
          </FormItem>
        </Form>
      </Modal>
      </LocaleProvider>
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
