import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal,Select, Cascader, DatePicker, Spin, Upload, Icon, Button, message } from 'antd'
import ReactDOM from 'react-dom'
import { debounce } from 'utils'
import { fileSignature } from 'services/ratingReport'
import styles from './modal.less'
import lodash from  'lodash'
import lrz from 'lrz'
import { request } from 'utils'

import city from '../../utils/city'

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
      console.log(info.file, info.fileList)
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
    let FilesFileList = []
    if (!lodash.isEmpty(props.item)) {
      fileList = [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: props.item.logoUrl,
        },
      ]
      FilesFileList = [
        {
          uid: -1,
          name: props.item.downloadUrl,
          status: 'done',
          url: props.item.downloadUrl,
        },
      ]
    }
    this.state = {
      inputValue: props.item.coinNameCn || '',
      coinId: '',
      loading: false,
      imageUrl: null,
      iconUrl: props.item.logoUrl || null,
      fileUrl: props.item.downloadUrl || null,
      id: props.item.id || '',
      fileList,
      FilesFileList,
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
    // console.log(i)
    this.props.onClear()
    this.setState({
      inputValue: i.coinName,
      coinId: i.coinId,
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
      onOk,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
      },
      ...modalProps
    } = this.props

    const { inputValue, coinId, fileList, FilesFileList } = this.state

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          key: coinId,
          coinId,
          logoUrl: this.state.iconUrl,
          url: this.state.fileUrl,
          id: this.state.id,
        }
        onOk(data)
      })
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

    return (
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
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('coinNameCn', {
              initialValue: item.coinNameCn,
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            })(
              <div>
                <Input onChange={this.nameQuery} value={inputValue} placeholder="请根据下拉框内名称选择"/>
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
          <FormItem label="风险评级" {...formItemLayout}>
            {getFieldDecorator('risk', {
              initialValue: item.risk,
              rules: [],
            })(<Radio.Group>
              <Radio value={3}>极高</Radio>
              <Radio value={2}>高</Radio>
              <Radio value={1}>中</Radio>
              <Radio value={0}>低</Radio>
              <Radio value={-1}>极低</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="可投资性" {...formItemLayout}>
            {getFieldDecorator('rating', {
              initialValue: item.score,
              rules: [],
            })(<Radio.Group>
              <Radio value='Aaa'>Aaa</Radio>
              <Radio value='Aa'>Aa&nbsp;&nbsp;</Radio>
              <Radio value='A'>A&nbsp;&nbsp;&nbsp;</Radio>
              <Radio value='Bbb'>Bbb</Radio>
              <Radio value='Bb'>Bb</Radio>
              <Radio value='B'>B&nbsp;&nbsp;&nbsp;&nbsp;</Radio>
              <Radio value='Ccc'>Ccc&nbsp;</Radio>
              <Radio value='Cc'>Cc&nbsp;&nbsp;</Radio>
              <Radio value='C'>C&nbsp;&nbsp;&nbsp;</Radio>
              <Radio value='D'>D&nbsp;</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="报告" {...formItemLayout}>
            <Upload
              customRequest={(info) => this.onCustomRequest(info, 'fileUrl')}
              {...props}
              fileList={FilesFileList}
              onChange={this.FilehandleChange}
            >
              <Button><Icon type="upload" /> 点击上传</Button>
            </Upload>
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
  searchList: PropTypes.array,
}

export default Form.create()(modal)
