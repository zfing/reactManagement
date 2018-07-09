/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Select, InputNumber } from 'antd'
import city from '../../utils/city'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option } = Select
const InputGroup = Input.Group
const FormItem = Form.Item
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onAdd,
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  loading,
  query,
  dispatch,
  onSearchUser,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    setFieldsValue,
  },
}) => {

  // onFieldsChange: (props, fields) => {
  //   console.log(props, fields)
  //   let value = {}
  //   _.forEach(fields, (item, key) => {
  //     value[key] = item.value
  //   })
  //
  //   props.onFilterChange(value)
  //   // props.dispatch({
  //   //   type: 'kyc/query',
  //   //   payload: {
  //   //     ...values,
  //   //   },
  //   // })
  // }
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const labelStyle = {
    marginRight: 15,
    fontSize: 18,
    fontWeight: 'bold',
  }

  const handleChange = (key, values) => {
    console.log(key, values)
    let fields = getFieldsValue()
    fields[key] = values

    if ((fields.startPos && !fields.endPos) || (!fields.startPos && fields.endPos)) {
      return null
    }

    // fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { name, address } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  function onChange (value) {
    console.log('changed', value)
    onFilterChange(value)
  }

  function onSubmit (e) {
    // e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        onFilterChange(values)
      }
    })
  }

  return (
    <Form layout={ 'inline' }>
      <FormItem label={ '起始序号' }>
        {getFieldDecorator('startPos', {
          initialValue: filter.startPos,
          rules: [],
        })(
          <Input style={{ width: 100 }} placeholder="最小序号"  onChange={(e) => handleChange('startPos', e.target.value)}/>,
        )}
      </FormItem>
      <FormItem label={'结束序号'}>
        {getFieldDecorator('endPos', {
          initialValue: filter.endPos,
          rules: [],
        })(
          <Input style={{ width: 100 }} placeholder="最大序号"  onChange={(e) => handleChange('endPos', e.target.value)}/>,
        )}
      </FormItem>
      <FormItem label={'证件类型'}>
        {getFieldDecorator('authType', {
          initialValue: filter.authType || '0',
          rules: [],
        })(
          <Select style={{ width: 200 }} onChange={handleChange.bind(null, 'authType')}>
            <Option value="0">所有</Option>
            <Option value="1">身份证</Option>
            <Option value="2">护照</Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label={ '审核状态' }>
        {getFieldDecorator('authStatus', {
          initialValue: filter.authStatus || '1',
          rules: [],
        })(
          <Select style={{ width: 200 }} onChange={handleChange.bind(null, 'authStatus')}>
            <Option value="4">所有</Option>
            <Option value="1">待审核</Option>
            <Option value="2">已通过</Option>
            <Option value="3">未通过</Option>
            <Option value="5">已通知</Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label={'提交日期'}>
        {getFieldDecorator('type', {
          initialValue: filter.type || '5',
          rules: [],
        })(
          <Select style={{ width: 200 }} onChange={handleChange.bind(null, 'type')}>
            <Option value="5">所有时间</Option>
            <Option value="1">最近三天</Option>
            <Option value="2">最近一周</Option>
            <Option value="3">最近一个月</Option>
            <Option value="4">最近三个月</Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label={'搜索查询'}>
        <Search
          placeholder="输入邮箱查询"
          onSearch={value => onSearchUser(value)}
          style={{ width: 200 }}
        />
      </FormItem>

    </Form>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)

