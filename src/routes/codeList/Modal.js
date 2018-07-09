import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal,Select, Cascader, DatePicker, Spin, Upload, Icon, Button, message,Row,Col, LocaleProvider } from 'antd'
import ReactDOM from 'react-dom'
import { debounce } from 'utils'
import { fileSignature } from 'services/ratingReport'
import styles from './modal.less'
import lodash from  'lodash'
import lrz from 'lrz'
import { request } from 'utils'
const { MonthPicker } = DatePicker
import moment from 'moment'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/src/locale/zh-cn'

const FormItem = Form.Item
const Search = Input.Search
const Option = Select.Option
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


const action = debounce( function (value, onSearch) {
  onSearch(value)
}, 1000)

//img
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}


//file
const props = {
  name: 'file',
  headers: {
    authorization: 'authorization-text',
  },
  onChange (info) {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`)
    }
  },
}

class modal extends React.Component {
  constructor (props) {
    super (props)
    let fileList = []
    // let FilesFileList = []
    if (!lodash.isEmpty(props.item)) {
      fileList = [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: props.item.imgUrl,
        },
      ]
      // FilesFileList = [
      //   {
      //     uid: -1,
      //     name: props.item.downloadUrl,
      //     status: 'done',
      //     url: props.item.downloadUrl,
      //   },
      // ]
    }
    this.state = {
      inputValue: props.item.coinName || '',
      coinId: '',
      loading: false,
      imageUrl: null,
      iconUrl: props.item.imgUrl || null,
      fileUrl: props.item.downloadUrl || null,
      id: props.item.id || '',
      fileList,
      year: null,
      month: null,
      rankTrend: null,
      radioValue: null,
    }
  }

  onCustomRequest = async (info, saveType) => {
    console.log(info)
    try {
      const { file } = info
      const data = await fileSignature()
      const signData =  JSON.parse(data.data)
      const filename = `${Date.now()}${parseInt(Math.random() * 10000)}.${file.type.substr(file.type.lastIndexOf('/') + 1)}`
      const uploadData = {
        name: filename,
        key: `${signData.dir}/dprating/${filename}`,
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
  getTrend = (value) => {
    console.log(value)
    this.setState({
      rankTrend: value,
    })
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
  FilehandleChange = (info) => {
    // console.log(info)
    this.setState({ FilesFileList: info.fileList})
  }

  imgClick = () => {
    const inputFile = ReactDOM.findDOMNode(this.refs.imgInput)
    inputFile.addEventListener('change', (e) => {
      lrz(e.target.files[0])
        .then((rst) => {
          // 处理成功会执行
          console.log(rst)
          this.setState({ imgSource: rst.base64 })
        })
        .catch((err) => {
          // 处理失败会执行
        })
        .always(() => {
          // 不管是成功失败，都会执行
        })
    })
    inputFile.click()
  }

  nameQuery = (e) => {
    this.setState({ inputValue: e.target.value })
    action(e.target.value, this.props.onSearch) // 连续间隔1秒内执行，只会打印最后一次
  }
  getValue = (i) => {
    console.log(i)
    this.props.onClear()
    this.setState({
      inputValue: i.coinName,
      coinId: i.coinId,
    })
  }
  onChangeRadio = (e) => {
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
      item = {},
      searchList,
      selected,
      modalType,
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalProps
    } = this.props

    const { inputValue, coinId, fileList, FilesFileList, radioValue } = this.state
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          key: coinId,
          coinId,
          imgUrl: this.state.iconUrl,
          id: this.state.id,
          year: this.state.year ? this.state.year : selected.split('-')[0],
          month: this.state.month ? this.state.month : selected.split('-')[1],
          rankTrend: this.state.rankTrend,
          coinName: this.state.inputValue,
        }
        if (data.imgUrl == '' || data.imgUrl == null){
          message.warning('图标不能为空')
          return null
        }
        debugger
        onOk(data)
      })
    }
    const inlineStyle = {
        style:{
          display: 'inline'
        }
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk,
    }
    const ulStyle = {
      maxHeight: 300,
      listStyleType: 'none',
      overflow: 'auto',
      paddingLeft: 0,
      border: '1px solid lightgray',
      marginTop: '-5',
    }
    const inputWidth = {
      style: {
        width: 170,
      }
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <Modal {...modalOpts} className={styles.modal}>
          <Form layout="horizontal" >
            <FormItem  label="上传图标" {...formItemLayout} {...imgClickStyle}>
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
            <FormItem label="所属期数" {...formItemLayout}>
              <MonthPicker  onChange={ (value) => this.getDateTime(value)} placeholder="选择期数" defaultValue={moment(selected, 'YYYY-M')} />
            </FormItem>
            {/*<FormItem label="排名" {...formItemLayout}>*/}
              {/*{getFieldDecorator('rank', {*/}
                {/*initialValue: item.auditRank,*/}
                {/*rules: [],*/}
              {/*})(<InputNumber {...inputWidth} min={0} placeholder="请输入"/>)}*/}
            {/*</FormItem>*/}
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('coinName', {
                initialValue: item.coinName,
                rules: [
                  {
                    required: true,
                    message: '请输入名称',
                  },
                ],
              })(
                <div>
                  <Input onChange={this.nameQuery} value={inputValue} {...inputWidth} placeholder="请根据下拉框内名称选择"/>
                  { searchList.length >0 &&
                  <ul style={ulStyle}>
                    { searchList.map((i, k) =>
                      <li className={styles.liStyle} onClick={() => this.getValue(i)}  key={k}>
                        {i.coinName}{<span style={{ color: 'green', fontSize: 12 }}>{'('+i.coinSymbol+')'}</span>}
                      </li>
                    )}
                  </ul>
                  }
                </div>
              )}
            </FormItem>
            <FormItem label="本月星级" {...formItemLayout}>
              {getFieldDecorator('rate', {
                initialValue: item.rate,
                rules: [
                  {
                    required: true,
                    message: '请输入星级',
                  },
                ],
              })(

                <InputNumber
                  min={0}
                  max={5}
                  {...inputWidth}
                  placeholder="请输入星级"
                />

              )}
            </FormItem>
            <FormItem label="当月提交" {...formItemLayout}>
              {getFieldDecorator('commitTimes', {
                initialValue: item.commitTimes,
                rules: [
                  {
                    required: true,
                    message: '请输入当月提交',
                  },
                ],
              })(<InputNumber min={0} {...inputWidth} placeholder="请输入"/>)}
            </FormItem>
            <FormItem label="提交类型" {...formItemLayout}>
              {getFieldDecorator('commitType', {
                initialValue: item.commitEvaluator,
                rules: [
                  {
                    required: true,
                    message: '请输入提交类型',
                  },
                ],
              })(<Radio.Group>
                <Radio value={'A1'}>A1</Radio>
                <Radio value={'A2'}>A2</Radio>
                <Radio value={'A3'}>A3</Radio>
                <Radio value={'B'}>B</Radio>
                <Radio value={'C'}>C</Radio>
                <Radio value={'D'}>D</Radio>
              </Radio.Group>)}
            </FormItem>
            <FormItem label="库热度" {...formItemLayout}>
              {getFieldDecorator('hotRate', {
                initialValue: item.hotRate,
                rules: [
                  {
                    required: true,
                    message: '请输入库热度',
                  },
                ],
              })(<Radio.Group>
                <Radio value={'极高'}>极高</Radio>
                <Radio value={'高'}>高</Radio>
                <Radio value={'中'}>中</Radio>
                <Radio value={'低'}>低</Radio>
              </Radio.Group>)}
            </FormItem>
            <FormItem label="开发者数" {...formItemLayout}>
              {getFieldDecorator('developNum', {
                initialValue: item.developerNum,
                rules: [
                  {
                    required: true,
                    message: '请输入开发者数',
                  },
                ],
              })(<Radio.Group>
                <Radio value={'多'}>多</Radio>
                <Radio value={'中'}>中</Radio>
                <Radio value={'少'}>少</Radio>
              </Radio.Group>)}
            </FormItem>
            <FormItem label="迭代速率" {...formItemLayout}>
              {getFieldDecorator('iterateRate', {
                initialValue: item.rateEvaluator,
                rules: [
                  {
                    required: true,
                    message: '请输入迭代速率',
                  },
                ],
              })(<Radio.Group>
                <Radio value={'快'}>快</Radio>
                <Radio value={'中'}>中</Radio>
                <Radio value={'慢'}>慢</Radio>
              </Radio.Group>)}
            </FormItem>
            {
              modalType === 'create' && <FormItem label="排名趋势" {...formItemLayout} {...inlineStyle}>
                {getFieldDecorator('trend', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请点击排名趋势',
                    },
                  ],
                })(
                  <Radio.Group onChange={this.onChangeRadio} >
                    <Radio value={1}>上升</Radio>
                    <Radio value={2}>下降</Radio>
                    <Radio value={3}>新加</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            }
            {
              modalType === 'update' && <FormItem label="排名趋势" {...formItemLayout} {...inlineStyle}>
                {getFieldDecorator('trend', {
                  initialValue: '',
                  rules: [],
                })(
                  <Radio.Group>
                    <Radio value={1}>上升</Radio>
                    <Radio value={2}>下降</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            }
            {
              radioValue !== 3 && <FormItem label="变化名次" {...formItemLayout}>
                {getFieldDecorator('rankTrend', {
                  initialValue: '',
                  rules: [],
                })(
                  <InputNumber placeholder="输入变化名次" min={0} {...inputWidth} onChange={ (value) => this.getTrend(value)}/>
                )}
              </FormItem>
            }
            {
              modalType === 'create' && <FormItem label="市值排名" {...formItemLayout}>
                {getFieldDecorator('marketRank', {
                  initialValue: item.rank,
                  rules: [
                    {
                      required: true,
                      message: '请点击市值排名',
                    },
                  ],
                })(<InputNumber {...inputWidth} min={0} placeholder="请输入"/>)}
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
