/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Cascader, Switch } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import city from '../../utils/city'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
// 日历中文设置
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/src/locale/zh-cn'

const { Search } = Input
const { RangePicker, MonthPicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
    padding: 0,
  },
}

const FR = {
  padding: 0,
  float: 'right',
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf('day')
}

const Filter = ({
  selectList,
  selected,
  onSearchTime,
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
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
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
  // console.log(selectList)
  // disabledDate={disabledDate}
  return (
    <LocaleProvider locale={zh_CN}>
      <Row gutter={24} style={{ marginLeft: 0, marginRight: 0  }}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          <span style={{ fontWeight: 'bold', marginRight: 20 }}>期数</span>
          {selected && <MonthPicker  format="YYYY年MM月" value={moment(selected, 'YYYY-M')} placeholder="选择期数" style={{ width: 200 }}  onChange={onSearchTime} disabledDate={(value) => (selectList.indexOf(value.format('YYYY-M')) === -1)} />}
        </Col>
        <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }} style={FR}>
          <div style={{ textAlign: 'right' }}>
            <Button  onClick={onDR} style={{ marginRight: 20 }}>+ 导入</Button>
            <Button  onClick={onAdd}>+ 添加</Button>
          </div>
        </Col>
      </Row>
    </LocaleProvider>
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

export { disabledDate }
export default Form.create()(Filter)
