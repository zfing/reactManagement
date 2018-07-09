/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select } from 'antd'
import city from '../../utils/city'
const FormItem = Form.Item
const { Search } = Input
const { RangePicker, MonthPicker } = DatePicker
const { Option } = Select
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
    padding: 0,
  },
}

const addStyle = {
  style: {
    marginRight: 0,
  },
}
const labelStyle = {
  style: {
    fontWeight: 'bold',
  },
}


const Filter = ({
  loading,
  onAdd,
  onDR,
  isMotion,
  switchIsMotion,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
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

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    console.log(key, values)
    let fields = getFieldsValue()
    fields[key] = values
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
  const MarBom = {
    style: {
      marginBottom: 16,
      textAlign: 'right',
    },
  }
  // 输入币种   onChange={(e) => handleChange('startPos', e.target.value)}
  return (
      <Form layout={'inline'} {...MarBom}>
       {/* <FormItem label={ '币种' } {...labelStyle}>
          {getFieldDecorator('2', {
            initialValue: '',
            rules: [],
          })(
            <Input placeholder="输入币种"/>
          )}
        </FormItem>
        <FormItem label={ '评级状态' } {...labelStyle}>
          {getFieldDecorator('3', {
            initialValue: '0',
            rules: [],
          })(
            <Select style={{ width: 200 }} onChange={handleChange.bind(null, 'authType')}>
              <Option value="0">所有</Option>
              <Option value="1">已评级</Option>
              <Option value="2">未评级</Option>
            </Select>,
          )}
        </FormItem>*/}
        <FormItem {...addStyle}>
          <Button onClick={onAdd}>+ 添加</Button>
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
