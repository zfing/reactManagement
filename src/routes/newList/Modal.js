import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, DatePicker, Upload, Icon, LocaleProvider } from 'antd'
import ReactDOM from 'react-dom'
import lrz from 'lrz'
import { request } from 'utils'
import city from '../../utils/city'
import lodash from  'lodash'
import { fileSignature } from 'services/ratingReport'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { disabledDate } from "./Filter"
import {message} from "antd/lib/index";
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
const imgClickStyle = {
  style: {
    textAlign: 'center',
  },
}
const imgHeader = {
  width: 70,
  height: 70,
  background: 'pink',
  borderRadius: '50%',
}
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
class modal extends React.Component {
  constructor (props) {
    super (props)
    let fileList = []
    if (!lodash.isEmpty(props.item)) {
      fileList = [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: props.item.imgUrl,
        },
      ]
    }
    this.state = {
      coinId: '',
      loading: false,
      imageUrl: null,
      iconUrl: props.item.imgUrl || null,
      id: props.item.id || '',
      fileList,
      year: null,
      month: null,
      radioValue: null,
    }
  }
  onCustomRequest = async (info, saveType) => {
    try {
      const { file } = info
      const data = await fileSignature()
      const signData =  JSON.parse(data.data)
      const filename = `${Date.now()}${parseInt(Math.random() * 10000)}.${file.type.substr(file.type.lastIndexOf('/') + 1)}`
      const uploadData = {
        name: filename,
        key: `${signData.dir}/rating/${filename}`,
        policy: signData.policy,
        OSSAccessKeyId: signData.accessid,
        success_action_status: 200,
        signature: signData.signature,
        file,
      }
      // 文件路径
      const fileurl = `${signData.host}/${uploadData.key}`
      this.setState({
        [saveType]: fileurl,
      })
      // console.log(uploadData)
      await request({
        url: signData.host,
        method: 'upload',
        data: uploadData,
        withCredentials: true,
      })
      // 返回对象和文件，对象没有为空，将文件塞进去
      info.onSuccess({}, file)

    } catch (e) {
      // 全局打印报错
      message.error(e.message)
    }
  }
  getDateTime = (value) => {
    this.setState({
      year : new Date(value._d).getFullYear(),
      month : new Date(value._d).getMonth() + 1,
    })
  }
  imgClick = () => {
    const inputFile = ReactDOM.findDOMNode(this.refs.input)
    inputFile.addEventListener('change', (e) => {
      lrz(e.target.files[0])
        .then((rst) => {
          // 处理成功会执行
          console.log(rst)
          this.setState({ imgSource: rst.base64 })
        })
        .catch( (err) => {
          // 处理失败会执行
        })
        .always( () => {
          // 不管是成功失败，都会执行
        })
    })
    inputFile.click()
  }
  handleChange = (info) => {
    // console.log(info)
    this.setState({ fileList: info.fileList})
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }))
    }
  }
  onChangeRadio = (e) => {
    console.log(e.target.value)
    this.setState({
      radioValue: e.target.value,
    })
  }
  render () {
    const imageUrl = this.state.imageUrl
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text" >Upload</div>
      </div>
    )
    const {
      modalType,
      selected,
      item = {},
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalProps
    } = this.props
    const { fileList, radioValue } = this.state
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          year: this.state.year ? this.state.year : selected.split('-')[0],
          month: this.state.month ? this.state.month : selected.split('-')[1],
          imgUrl: this.state.iconUrl,
        }
        if (data.imgUrl == '' || data.imgUrl == null){
          message.warning('图标不能为空')
          return null
        }
        onOk(data)
      })
    }
    const inputStyle = {
      width: 250,
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk,

    }
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal {...modalOpts}>
          <Form layout="horizontal" >
            <FormItem label="上传图标" {...formItemLayout} {...imgClickStyle}>
              <Upload
                customRequest={(info) => this.onCustomRequest(info, 'iconUrl')}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                onChange={this.handleChange}
                fileList={fileList}
              >
                { fileList.length >= 1 ? null : uploadButton }
              </Upload>
            </FormItem>
            <FormItem label="交易所" {...formItemLayout}>
              {getFieldDecorator('exName', {
                initialValue: item.exName,
                rules: [
                  {
                    required: true,
                    message: '请输入交易所名字',
                  },
                ],
              })(<Input style={inputStyle}/>)}
            </FormItem>
            <FormItem label="上线新币数量" {...formItemLayout}>
              {getFieldDecorator('num', {
                initialValue: item.newCoinNum,
                rules: [
                  {
                    required: true,
                    message: '请输入上线新币数量',
                  },
                ],
              })(<Input style={inputStyle}/>)}
            </FormItem>
            <FormItem label="期数" {...formItemLayout}>
              <MonthPicker  onChange={ (value) => this.getDateTime(value)} placeholder="选择期数"  defaultValue={moment(selected, 'YYYY-M')}/>
            </FormItem>
            <FormItem label="上月涨跌幅" {...formItemLayout}>
              {getFieldDecorator('preTrend', {
                initialValue: item.preTrend,
                rules: [
                  {
                    required: true,
                    message: '请输入上月涨跌幅',
                  },
                ],
              })(<InputNumber formatter={value => `${value}`} style={inputStyle} placeholder="请输入上月涨跌幅 (例：10% => 0.1)" />)}
            </FormItem>
            <FormItem label="本月涨跌幅" {...formItemLayout}>
              {getFieldDecorator('trend', {
                initialValue: item.trend,
                rules: [
                  {
                    required: true,
                    message: '请输入本月涨跌幅',
                  },
                ],
              })(<InputNumber formatter={value => `${value}`} style={inputStyle} placeholder="请输入本月涨跌幅 (例：10% => 0.1)" />)}
            </FormItem>
            <FormItem label="综合涨跌幅" {...formItemLayout}>
              {getFieldDecorator('totalTrend', {
                initialValue: item.totalTrend,
                rules: [
                  {
                    required: true,
                    message: '请输入综合涨跌幅',
                  },
                ],
              })(<InputNumber formatter={value => `${value}`} style={inputStyle} placeholder="请输入综合涨跌幅 (例：10% => 0.1)" />)}
            </FormItem>
            {
              modalType === 'update' && <FormItem label="排名变化" {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [
                    {
                      required: true,
                      message: '请选择相对上月变化值',
                    },
                  ],
                })(<div>
                  <Radio.Group onChange={this.onChangeRadio}>
                    <Radio value={1}>上升</Radio>
                    <Radio value={2}>下降</Radio>
                    <Radio value={3}>不变</Radio>
                  </Radio.Group>
                </div>)}
              </FormItem>
            }
            {
              modalType === 'create' && <FormItem label="排名变化" {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [
                    {
                      required: true,
                      message: '请选择相对上月变化值',
                    },
                  ],
                })(
                  <Radio.Group onChange={this.onChangeRadio}>
                    <Radio value={1}>上升</Radio>
                    <Radio value={2}>下降</Radio>
                    <Radio value={3}>不变</Radio>
                    <Radio value={4}>新加</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            }
            {
              radioValue !== 3 && radioValue !== 4 && <FormItem label="变化名次" {...formItemLayout}>
                {getFieldDecorator('changeNum', {
                  initialValue: item.changeNum,
                  rules: [
                    {
                      required: true,
                      message: '请输入变化名次',
                    },
                  ],
                })(
                  <InputNumber min={0} />
                )}
              </FormItem>
            }
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
