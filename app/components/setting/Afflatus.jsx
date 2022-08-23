import React, { Component } from 'react';
import { FileAddOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, message, Modal } from 'antd';
import { App, CTYPE, U, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import '../../assets/css/common/afflatus.scss'
class Afflatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artisanCaseImgQo: {},
            list: [],
            loading: false,
        }
    }
    componentDidMount() {

        this.loadData();
    }
    loadData = () => {
        let { artisanCaseImgQo = {}, } = this.state;
        this.setState({ loading: true });
        App.api('adm/img/artisanCaseImgs', {
            artisanCaseImgQo: JSON.stringify({
                artisanCaseImgQo,
            })

        }).then((result) => {
            this.setState({
                list: result,
                loading: false
            });
        });

    };
    edit = id => {
        App.go(`/app/artisanCaseImg/edit/${id}`)
    }
    remove = id => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/img/remove', { id }).then(() => {
                    message.success('删除成功');
                    this.loadData();
                })
            },
        });
    }
    status = (id, status) => {
        Modal.confirm({
            title: `确认更改状态?`,
            onOk: () => {
                App.api('adm/img/status', { id, status: status == 1 ? 2 : 1 }).then(() => {
                    message.success('更改成功');
                    this.loadData();
                })
            },
        });
    }

    render() {
        let { list = [] } = this.state;
        let { imgs = [] } = list;
        return (
            <div className='afflatus-page'>
                <BreadcrumbCustom first={CTYPE.link.artisanCaseImg.txt} />
                <Card title={<Button type='primary' icon={<FileAddOutlined />} onClick={() => { this.edit(0) }}>添加图片</Button>}>
                    <div className='bordered'>
                        {
                            list.map((i, index) => {
                                let { id, status, title } = i
                                return <Card
                                    style={{ width: 298, marginLeft: 10 }}
                                    cover={
                                        <img style={{ width: 298, height: 298 }}
                                            alt="图片出错"
                                            src={i.imgs[0]}
                                        />
                                    }
                                    actions={[
                                        <SettingOutlined onClick={() => { this.status(id, status) }} />,
                                        <EditOutlined onClick={() => { this.edit(id) }} />,
                                        <DeleteOutlined onClick={() => { this.remove(id) }} />,
                                    ]}
                                >
                                    {title}
                                </Card>
                            })
                        }

                    </div>

                </Card>
            </div >
        );
    }
}

export default Afflatus;