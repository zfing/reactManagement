import React from 'react'
import PropTypes from 'prop-types'
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
  LocaleProvider,
} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/src/locale/zh-cn'
import { fuzzySearch } from '../../../services/baseInfo'

const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

class AddModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      coinList: [],
      selectedCoinName: '',
    }
  }

  render () {
    let {
      form: {
        getFieldDecorator,
        validateFields,
      },
      onOk,
      ...addModalProps
    } = this.props

    const _clickOk = () => {
      validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        const fields = {
          ...fieldsValue,
          releaseTime: fieldsValue.releaseTime.format('YYYY-MM-DD'),
          coinName: this.state.selectedCoinName,
        }
        debugger
        onOk(fields)
      })
    }

    addModalProps = {
      ...addModalProps,
      onOk: _clickOk,
      title: '添加',
      okText: '保存',
      cancelText: '取消',
      width: 650,
    }

    const handleCoinInputChange = async (value) => {
      if (!value) {
        this.setState({
          coinList: [],
        })
        return
      }
      let result = await fuzzySearch({ sequence: value })
      this.setState({
        coinList: result.data,
      })
    }

    const handleCoinInputSelect = (value, option) => {
      this.setState({
        selectedCoinName: option.props.children,
      })
      // console.log(value, option)
    }

    const checkCoinId = (rule, value, callback) => {
      if (value && (/(^[1-9]\d*$)/.test(value))) {
        callback()
        return
      }
      callback('请选择一个项目')
    }

    const options = this.state.coinList.map(d => (<Option key={d.coinId}>{d.coinName}</Option>))
    return (
      <LocaleProvider locale={zh_CN}>
      <Modal {...addModalProps}>
        <Form style={{ margin: '0 30px' }}>
          <FormItem
            {...formItemLayout}
            label="项目名"
            hasFeedback
          >
            {getFieldDecorator('coinId', {
              rules: [{
                validator: checkCoinId,
                required: true,
                message: '请输入项目名!',
              }],
            })(<Select
              mode="combobox"
              placeholder="请选择项目名"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              optionLabelProp="children"
              onChange={handleCoinInputChange}
              onSelect={handleCoinInputSelect}
            >
              {options}
            </Select>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="发行时间"
            hasFeedback
          >
            {getFieldDecorator('releaseTime', {
              rules: [{
                required: true,
                message: '请选择发行时间',
              }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择发行时间"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="众筹价"
            hasFeedback
          >
            {getFieldDecorator('crowdFunding', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入众筹价"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="官网链接"
            hasFeedback
          >
            {getFieldDecorator('officialWebsite', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入官网链接"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="区块站"
            hasFeedback
          >
            {getFieldDecorator('blockWebsiteList', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入区块站，多个区块站以 , 隔开"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="上交易所数量"
            hasFeedback
          >
            {getFieldDecorator('exchangeNum', {
              initialValue: '',
              rules: [],
            })(<InputNumber placeholder="上交易所数量" style={{ width: '100%' }}/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="电报群"
            hasFeedback
          >
            {getFieldDecorator('telegramGroup', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入电报群"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="开源代码仓库"
            hasFeedback
          >
            {getFieldDecorator('githubAddr', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入开源代码仓库"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="白皮书链接"
            hasFeedback
          >
            {getFieldDecorator('whitePaper', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入白皮书链接"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="项目简介"
            hasFeedback
          >
            {getFieldDecorator('explainZh', {
              initialValue: '',
              rules: [],
            })(<TextArea rows={5} placeholder="请输入项目简介"/>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="信息来源"
            hasFeedback
          >
            {getFieldDecorator('infoSource', {
              initialValue: '',
              rules: [],
            })(<Input placeholder="请输入信息来源"/>)}
          </FormItem>

        </Form>
      </Modal>
      </LocaleProvider>
    )
  }
}

AddModal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
}

export default Form.create()(AddModal)
