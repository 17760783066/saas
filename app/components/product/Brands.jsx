import React, { Component } from 'react';
import { Card, Tabs, Button, Table, Dropdown, Menu, Avatar, Modal } from 'antd';
import { App, CTYPE, U, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { PlusCircleOutlined, DownOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProductUtils from './ProductUtils';

const { TabPane } = Tabs;



class Brands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
                loading: false,
            },
            brandQo: {},
            list: [],
            categories: []
        }
    }
    componentDidMount() {
        this.loadData();
        App.api('adm/product/categories').then((categories) => {
            this.setState({
                categories
            })
        });
    }

    loadData = () => {
        let { brandQo = {}, pagination = {}, status } = this.state;
        brandQo["status"] = status;
        App.api('adm/product/brands', {
            brandQo: JSON.stringify({
                ...brandQo,
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
    status = (id, status) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: `确认${status == 1 ? '封禁' : '启用'}操作`,
            onOk: () => {
                App.api(`adm/product/status_brand`, { id, status: status == 1 ? 2 : 1 }).then(() => { this.loadData() })
            },
            onCancel() {
            },
        })
    }
    edit = brand => {
        App.go(`/app/product/brands-edit/${brand.id}`)
    }
    onClick = (brands) => {
        App.go(`/app/product/brands-edit/${brands.id}`)
    }
    render() {
        let { list = [], loading, categories = [] } = this.state;

        return (
            <div>
                <BreadcrumbCustom first={CTYPE.link.brands.txt} />
                <Card title={
                    <Tabs defaultActiveKey="0" onChange={(key) =>
                        this.setState({ status: key }, this.loadData)
                    }>
                        <TabPane tab="全部" key="0" />
                        <TabPane tab="启用" key="1" />
                        <TabPane tab="停用" key="2" />
                    </Tabs>
                }
                >
                    <Button onClick={() => {
                        this.onClick({ id: 0 })
                    }} type="primary" icon={<PlusCircleOutlined />}>添加品牌</Button>
                    <Table
                        columns={[{
                            title: '序号',
                            dataIndex: 'id',
                            align: 'center',
                            width: '80px',
                            render: (col, row, i) => i + 1
                        }, {
                            title: '名称',
                            dataIndex: 'name',
                            align: 'center',

                        }, {
                            title: '类别',
                            dataIndex: 'productCategorySequences',
                            align: 'center',
                            render: (productCategorySequences) =>
                                ProductUtils.brandCategory(productCategorySequences, categories)
                        }, {
                            title: 'LOGO',
                            dataIndex: 'cover',
                            align: 'center',
                            render: cover => <Avatar shape="square" src={cover} size={40} icon={<UserOutlined />} />

                        }, {

                            title: '创建时间',
                            dataIndex: 'createdAt',
                            align: 'center',
                            width: '160px',
                            render: (t) => t ? U.date.format(new Date(t), 'yyyy-MM-dd HH:mm') : '-/-'
                        },
                        {
                            title: '状态',
                            dataIndex: 'status',
                            align: 'center',
                            render: (status) => Utils.getStatus(status).tag
                        }, {
                            title: '操作',
                            dataIndex: 'option',
                            align: 'center',
                            width: '100px',
                            render: (obj, brand, index) => {
                                let { status, id, } = brand;
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(brand)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="2">
                                        <a onClick={() => this.status(id, status)}>{status == 1 ? '封禁' : '启用'}</a>
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

export default Brands;