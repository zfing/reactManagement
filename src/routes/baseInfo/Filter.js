/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Select, InputNumber } from 'antd'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option } = Select
const InputGroup = Input.Group
const FormItem = Form.Item

const Filter = ({
  onAdd,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {
  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    onFilterChange(fields)
  }
  const addStyle = {
    style: {
      marginRight: 0,
      float: 'right',
    },
  }
  return (
    <Form layout="inline" style={{ paddingBottom: '10px' }}>
      <FormItem label="提交时间">
        {getFieldDecorator('type', {
          initialValue: filter.time || '1',
          rules: [],
        })(<Select style={{ width: 200 }} onChange={handleChange.bind(null, 'type')}>
          <Option value="1">最近三天</Option>
          <Option value="2">最近一周</Option>
          <Option value="3">最近一个月</Option>
          <Option value="4">最近三个月</Option>
          <Option value="5">所有时间</Option>
        </Select>)}
      </FormItem>

      <FormItem label="审核状态">
        {getFieldDecorator('status', {
          initialValue: filter.authStatus || '1',
          rules: [],
        })(<Select style={{ width: 200 }} onChange={handleChange.bind(null, 'status')}>
          <Option value="4">所有</Option>
          <Option value="1">待审核</Option>
          <Option value="2">已通过</Option>
          <Option value="3">未通过</Option>
        </Select>)}
      </FormItem>

      <FormItem {...addStyle}>
        <Button type="default" onClick={onAdd}>+ 添加</Button>
      </FormItem>

    </Form>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)

