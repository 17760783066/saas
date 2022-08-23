import React, { Component } from 'react';
import { FileAddOutlined, DownOutlined, ExclamationCircleOutlined } from '_@ant-design_icons@4.7.0@@ant-design/icons';
import { Card, Button, Form, Row, Col, Select, Table, Input, TreeSelect, Dropdown, Menu, Modal } from 'antd';
import { App, CTYPE, U, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import ProductUtils from './ProductUtils';
const FormItem = Form.Item;
const { Search } = Input;

class ProductTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
                selectedRowKeys: [],
                loading: false,
            },
            productQo: {},
            list: [],
            categories: [],

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
        let { pagination, productQo = {} } = this.state;
        this.setState({ loading: true });
        App.api('adm/product/templates', {
            productQo: JSON.stringify({
                ...productQo,
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
    start = () => {
        let { selectedRowKeys = [] } = this.state;
        this.setState({
            selectedRowKeys: [],
        });
        var ids = selectedRowKeys;
        App.api('adm/product/remove_template', {
            ids: JSON.stringify(ids)
        }).then(() => {
            this.loadData();
        })

    };

    edit = productTemplate => {

        App.go(`/app/product/product-edit/${productTemplate.id}`)
    }
    status = (id, status) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: `确认${status == 1 ? '封禁' : '启用'}操作`,
            onOk: () => {
                App.api(`adm/product/status_product_template`, { id, status: status == 1 ? 2 : 1 }).then(() => { this.loadData() })
            },
            onCancel() {
            },
        })
    }
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    reloadDate = (key, value) => {
        let { pagination = {}, productQo = {} } = this.state;
        if (key) {
            productQo[key] = value;
        }
        this.setState(
            {
                productQo,
                pagination: {
                    ...pagination,
                    current: 1,
                },
            },
            () => {
                this.loadData();
            }
        );
    };


    confirm = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '确认批量删除操作',
            onOk: () => { this.start() },
            onCancel() {
            },
        })
    }
    render() {
        let { loading, selectedRowKeys = [], list = [], categories = [] } = this.state;

        console.log(selectedRowKeys);

        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                <BreadcrumbCustom first={CTYPE.link.products_templates.txt} />
                <Card>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span={10}>
                            <Button type="primary" icon={<FileAddOutlined />} onClick={() => {
                                this.edit({ id: 0 })
                            }}>创建模版</Button>
                            <Button type="danger" onClick={this.confirm} disabled={!hasSelected} loading={loading}>
                                {(selectedRowKeys.length == 0) ? `批量删除` : `删除 ${selectedRowKeys.length} 条`}
                            </Button>

                        </Col>
                        <Col span={14}>
                            <Select
                                defaultValue='状态'
                                style={{ float: 'right' }}
                                onChange={(value) =>
                                    this.reloadDate('status', value)}>
                                <Option value="0">状态</Option>
                                <Option value="1">启用</Option>
                                <Option value="2">停用</Option>
                            </Select>
                            <Search
                                style={{ width: '300px', float: 'right', marginRight: '10px' }}
                                placeholder="输入名称查询"
                                onSearch={(val) => {
                                    this.reloadDate('name', val);
                                }
                                }
                            />
                            <TreeSelect
                                treeData={categories}
                                showSearch
                                style={{ width: '50%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeNodeFilterProp="label"
                                placeholder="请选择分类"
                                allowClear
                                treeDefaultExpandAll
                                treeCheckable
                                multiple
                                fieldNames={{ label: 'name', key: 'sequence', value: 'id' }}
                                onChange={(value) => {
                                    this.reloadDate('mixtureCategoryIds', value);
                                }}
                            />

                        </Col>
                    </Row>
                    {/* <Table rowSelection={rowSelection} columns={productQo} dataSource={productQo} /> */}
                    <Table
                        rowSelection={rowSelection}
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
                            dataIndex: 'categoryId',
                            align: 'center',
                            render: (categoryId) => ProductUtils.renderCateTags(categoryId, categories)
                        }, {
                            title: '图片',
                            dataIndex: 'specs',
                            align: 'center',
                            render: (specs = []) => {
                                let imgs = specs.length > 0 ? specs[0].imgs : [];
                                return <img style={{ width: 60, height: 60 }} src={imgs[0]}
                                    onClick={() => {
                                        Utils.common.showImgLightbox(imgs)
                                    }} />
                            }

                        }, {
                            title: '规格',
                            dataIndex: 'specs',
                            align: 'center',
                            render: (specs = [], productTemplate) => {
                                return <a onClick={() => { ProductUtils.drawer(productTemplate.id) }}>【{specs.length}】</a>
                            }
                        }, {
                            title: '参数',
                            dataIndex: 'params',
                            align: 'center',
                            render: (params = [], productTemplate) => {
                                return <a onClick={() => { ProductUtils.drawer(productTemplate.id) }}>【{params.length}】</a>
                            }
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
                            render: (obj, productTemplate, index) => {
                                let { status, id, } = productTemplate;
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(productTemplate)}>编辑</a>
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

export default ProductTemplates;