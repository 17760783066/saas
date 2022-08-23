import React, { Component } from 'react';
import { FileAddOutlined,DownOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal ,Table,Tabs,Dropdown,Menu} from '_antd@4.19.2@antd';
import { App, CTYPE, U, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
const { TabPane } = Tabs;

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        let { uiQo = {}, pagination = {}, isDefault } = this.state;
        uiQo["isDefault"] = isDefault;
        App.api('adm/ui/uis', {
            uiQo: JSON.stringify({
                ...uiQo,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((ret) => {
            let pagination = Utils.pager.convert2Pagination(ret);
            let { content = [] } = ret;
            this.setState({
                list: content,
                pagination,
                loading: false
            });
        });

    };
    isDefault = (id, isDefault) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: `确认${isDefault == 1 ? '封禁' : '启用'}操作`,
            onOk: () => {
                App.api(`adm/ui/isDefault`, { id, isDefault: isDefault == 1 ? 2 : 1 }).then(() => { this.loadData() })
            },
            onCancel() {
            },
        })
    }
    add = ui => {
        App.go(`/app/setting/ui-edit/${ui.id}`)

    }
    render() {
        let { list = [], loading } = this.state;

        return (
            <div>
                <BreadcrumbCustom first={CTYPE.link.uis.txt} />
                <Card extra={<Button icon={<FileAddOutlined />} type="primary" onClick={() => { this.add({id:0}) }}>新建模版</Button>}>
                    <Table
                        columns={[{
                            title: '序号',
                            dataIndex: 'id',
                            align: 'center',
                            width: '80px',
                            render: (col, row, i) => i + 1
                        }, {
                            title: '名称',
                            dataIndex: 'title',
                            align: 'center',

                        },{

                            title: '创建时间',
                            dataIndex: 'createdAt',
                            align: 'center',
                            width: '160px',
                            render: (t) => t ? U.date.format(new Date(t), 'yyyy-MM-dd HH:mm') : '-/-'
                        },
                        {
                            title: '状态',
                            dataIndex: 'isDefault',
                            align: 'center',
                            render: (isDefault) => Utils.getStatus(isDefault).tag
                        }, {
                            title: '操作',
                            dataIndex: 'option',
                            align: 'center',
                            width: '100px',
                            render: (obj, ui, index) => {
                                let { isDefault, id, } = ui;
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.add(ui)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="2">
                                        <a onClick={() => this.isDefault(id, isDefault)}>{isDefault == 1 ? '封禁' : '启用'}</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <DownOutlined />
                                    </a>
                                </Dropdown>
                            }

                        }]}
                        rowKey={(item) => item.id}
                        dataSource={list}
                        pagination={false}
                        loading={loading}
                    />
                </Card>
            </div>
        );
    }
}

export default Setting;