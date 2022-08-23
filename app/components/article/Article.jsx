import React, { Component } from 'react';
import { DownOutlined, UserAddOutlined, UserOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { Row, Col, Avatar, Button, Card, Dropdown, Menu, Tabs, Modal, Table, Tag, Descriptions, Select, Input } from 'antd';
import { App, CTYPE, U, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
const { Search } = Input;
const { TabPane } = Tabs;

class Article extends Component {
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
            list: [],
            articleQo:{}
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        let { pagination, articleQo = {},type } = this.state;
        articleQo["type"] = type;
        this.setState({ loading: true });
        App.api('adm/article/articles', {
            articleQo: JSON.stringify({
                ...articleQo,
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
                App.api(`adm/article/update_status`, { id, status: status == 1 ? 2 : 1 }).then(() => { this.loadData() })
            },
            onCancel() {
            },
        })
    }
    edit = article => {
        App.go(`/app/article/article-edit/${article.id}`)
    }
    reloadDate = (key, value) => {
        let { pagination = {}, articleQo = {} } = this.state;
        if (key) {
            articleQo[key] = value;
        }
        this.setState(
            {
                articleQo,
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
    render() {
        let { articleQo = {}, list, loading } = this.state;

        return (
            <div>
                <BreadcrumbCustom first={CTYPE.link.article.txt} />
                <Card title={
                    <Tabs defaultActiveKey="0" onChange={(key) =>
                        this.setState({ type: key }, this.loadData)
                    }>
                        <TabPane tab="推荐案例" key="1" />
                        <TabPane tab="装修技巧" key="2" />
                    </Tabs>
                }>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span={4}>
                            <Button type="primary" icon={<UserAddOutlined />} onClick={() => {
                                this.edit({ id: 0 })
                            }}>创建商户</Button>
                        </Col>
                        <Col span={20}>
                            <Search
                                style={{ width: '300px', float: 'right', marginRight: '10px' }}
                                placeholder="输入标题或内容查询"
                                onSearch={(val) => {
                                    this.reloadDate("titleOrContent", val);
                                }
                                }
                            />
                        </Col>
                    </Row>

                    <Table
                        columns={[{
                            title: '序号',
                            dataIndex: 'id',
                            align: 'center',
                            width: '80px',
                            render: (col, row, i) => i + 1
                        }, {
                            title: '图片',
                            dataIndex: 'cover',
                            align: 'center',
                            width: '100px',
                            render: cover => <Avatar shape="square" src={cover} size={40} icon={<UserOutlined />} />
                        }, {
                            title: '标题',
                            dataIndex: 'title',
                            align: 'center',
                            // render: (name, merchant,) => {
                            //     return <a onClick={() => { MerchantUtils.message(merchant.id, this.loadData) }}>{name}</a>
                            // }
                        }, {
                            title: '浏览量',
                            dataIndex: 'pv',
                            align: 'center',
                            // render: (mobile) => mobile

                        }, {
                            title: '点赞量',
                            dataIndex: 'likeNum',
                            align: 'center',
                            width: '160px',
                            // render: (t) => <span style={{ color: t < new Date().getTime() + 2592000000 ? 'red' : '' }}>{t ? U.date.format(new Date(t), 'yyyy-MM-dd HH:mm') : '-/-'} </span>

                        }, {
                            title: '收藏量',
                            dataIndex: 'collectNum',
                            align: 'center',
                            width: '160px',
                            // render: (t) => <span style={{ color: t < new Date().getTime() + 2592000000 ? 'red' : '' }}>{t ? U.date.format(new Date(t), 'yyyy-MM-dd HH:mm') : '-/-'} </span>
                        }, {
                            title: '发布时间',
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
                            render: (obj, article, index) => {
                                let {status,id} = article;
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(article)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(article.id, index)}>删除</a>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                    <a onClick={() => this.status(id, status)}>{status == 1 ? '下架' : '上架'}</a>                                    </Menu.Item>

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

export default Article;