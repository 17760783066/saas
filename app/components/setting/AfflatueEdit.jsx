import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { App, CTYPE, U } from '../../common';
import { FileAddOutlined, DeleteOutlined ,LeftOutlined,RightOutlined} from '@ant-design/icons';
import { Button, Card, Form, Divider, Input, message, Progress, Switch } from 'antd';
const { Meta } = Card;
import BreadcrumbCustom from '../BreadcrumbCustom';
const FormItem = Form.Item;
const { TextArea } = Input;
class AfflatueEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            artisanCaseImg: {},

            fs: [],
            file_index: 0,
            progress: 0
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { id } = this.state;
        if (id != 0) {
            App.api('adm/img/artisanCaseImg', { id }).then((artisanCaseImg) => {
                this.setState({
                    artisanCaseImg
                });
            })
        }
    };
    doUpload = (e) => {
        let fs = e.target.files;
        if (fs == null || fs.length === 0) {
            return;
        }

        for (let i = 0; i < fs.length; i++) {
            let file = fs[i];
            if (file.size > 10485760) {
                message.warn('单个文件大小不能超过10M，请检查');
                return;
            }
        }

        this.setState({ fs }, () => {
            let index = 0;
            this.uploadOne(index);
        });
    };
    uploadOne = (index) => {
        this.upload(index).then(() => {
            index++;
            this.uploadOne(index)
        });
    };
    doImgOpt = (index, opt, img) => {
        let { artisanCaseImg = {} } = this.state;
        let { imgs = [] } = artisanCaseImg;
        if (opt === 'left') {
            if (index === 0) {
                message.warn('已经是第一个');
                return;
            }
            imgs = U.array.swap(imgs, index, index - 1);
        } else if (opt === 'right') {
            if (index === imgs.length - 1) {
                message.warn('已经是最后一个');
                return;
            }
            imgs = U.array.swap(imgs, index, index + 1);
        } else if (opt === 'remove') {
            imgs = U.array.remove(imgs, index);
        } else if (opt === 'add') {
            imgs.push(img);
        }

        this.setState({
            artisanCaseImg: {
                ...artisanCaseImg,
                imgs
            }
        });
    };
    upload = (index) => {

        return new Promise((resolve, reject) => {

            let { fs = [] } = this.state;

            if (index > fs.length - 1) {
                return;
            }

            let img = fs[index];
            this.setState({
                file_index: index
            });

            const formData = new FormData();
            formData.append('file', img);
            formData.append('admin-token', App.getCookie('admin-token'));

            let xhr = new XMLHttpRequest();
            xhr.open("post", App.API_BASE + 'adm/file/img_upload_watermark');
            xhr.upload.onprogress = (e) => {
                this.setState({ progress: Math.floor(e.loaded / e.total * 100) });
            };
            xhr.send(formData);
            xhr.onreadystatechange = () => {

                if (xhr.status === 200 && xhr.readyState === 4) {

                    let ret = JSON.parse(xhr.responseText) || {};
                    let { errcode, errmsg } = ret;
                    if (errcode) {
                        message.error(errmsg);
                    }

                    let result = ret.result;

                    message.success('上传成功 ' + (index + 1) + ' / ' + fs.length);
                    this.doImgOpt(null, 'add', result.url);
                    if (index === fs.length - 1) {
                        fs = [];
                    }
                    this.setState({
                        uploading: false, progress: 100, fs
                    });

                    resolve();
                }
            };
        })
    };

    handleSubmit = () => {

        let { artisanCaseImg = {} } = this.state;
        let { title, imgs = [], status } = artisanCaseImg;


        if (U.str.isEmpty(title)) {
            message.warn('请填写图集名称');
            return;
        }

        if (imgs.length == 0) {
            message.warn('请上传图片');
            return;
        }

        if (U.str.isEmpty(status)) {
            artisanCaseImg.status = 2;
        }

        App.api(`adm/img/save_img`, {
            artisanCaseImg: JSON.stringify(artisanCaseImg),
        }).then(() => {
            message.success('已保存');
            window.history.back();
        });
    };

    render() {
        let { artisanCaseImg = {}, fs = [], file_index, progress } = this.state;
        let { title, status, imgs = [] } = artisanCaseImg;
        return (
            <div className='common-edit-page'>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.artisanCaseImg.path}>{CTYPE.link.artisanCaseImg.txt}</Link>}
                    second='新建图片' />
                <Card extra={<Button type="primary" icon={<FileAddOutlined />} onClick={() => {
                    this.handleSubmit()
                }}>保存</Button>}>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='图集名称'>
                        <TextArea placeholder="输入图集名称"
                            value={title}
                            rows={1}
                            maxLength={25}
                            onChange={(e) => {
                                this.setState({
                                    artisanCaseImg: {
                                        ...artisanCaseImg,
                                        title: e.target.value
                                    }
                                })
                            }} />
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout} label='图片' required={true}>


                        <div className='imgs-opt-block'>

                            {imgs.map((img, index) => {
                                return <Card key={index} className='img-card-edit'
                                    cover={<img src={img}  style={{width:168,height:126}}/>}
                                    actions={[
                                        <Card style={{ height: 30 }}>
                                            <LeftOutlined
                                                onClick={() => this.doImgOpt(index, 'left')} />
                                            <Divider type="vertical" />
                                            <DeleteOutlined
                                                onClick={() => this.doImgOpt(index, 'remove')} />
                                            <Divider type="vertical" />
                                            <RightOutlined
                                                onClick={() => this.doImgOpt(index, 'right')} />
                                        </Card>
                                    ]}
                                />
                            })}

                            <div className='img-card-add' >
                                <Card
                                    cover={<input className="file" type='file' accept='image/*' multiple={true}
                                        onChange={(e) => this.doUpload(e)} />}
                                >
                                    <Meta title='上传图片' description="小于1M .jpg、.png格式" />

                                </Card>
                            </div>

                            {fs.length > 0 && <div>
                                <span>{(file_index + 1) + ' / ' + fs.length}</span>
                                <Progress percent={progress} showInfo={true}
                                    strokeWidth={5} /></div>}

                        </div>
                        <div className='clearfix-h20' />

                    </FormItem>

                    <FormItem required={true}
                        {...CTYPE.formItemLayout} label='上架'>
                        <Switch checked={status === 1}
                            onChange={(chk) => {
                                this.setState({
                                    artisanCaseImg: {
                                        ...artisanCaseImg,
                                        status: chk ? 1 : 2
                                    }
                                })
                            }
                            }
                        />
                    </FormItem>
                </Card>
            </div>
        );
    }
}

export default AfflatueEdit;