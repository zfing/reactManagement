import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  loading, login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'login/login',
        payload: values,
      })
    })
  }

  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt="logo" src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('userName', {
            initialValue: login.userName || '',
            rules: [
              {
                required: true,
              },
            ],
          })(<Input onPressEnter={handleOk} placeholder="Username" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            initialValue: login.password || '',
            rules: [
              {
                required: true,
              },
            ],
          })(<Input type="password" onPressEnter={handleOk} placeholder="Password" />)}
        </FormItem>
        <Row>
          <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
            登录
          </Button>
        </Row>
      </form>
    </div>
  )
}

Login.propTypes = {
  login: PropTypes.object,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading, login }) => ({
  loading,
  login,
}))(Form.create()(Login))
