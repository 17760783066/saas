import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { Avatar, Divider, Modal, Popconfirm, Table, Dropdown, Menu, Tag } from 'antd';
import React, { Component } from 'react';
import '../../assets/css/common/message.scss';
import { App, U, Utils } from '../../common';
import MerchantUtils from './MerchantUtils';



const id_div = 'div-dialog-loginlogs';


class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            id: this.props.merchantId,
            loading: false,
            merchant: {},
            merchantAdmin: []
        }
    }
    componentDidMount() {
        this.loadData();
        Utils.addr.loadRegion(this);
        this.loadCates();
    }
    loadCates = () => {
        App.api('adm/product/list_category').then((categories) => {
            this.setState({
                categories
            })
        });
    }

    loadData = () => {
        this.setState({ loading: true });
        let { id } = this.state;

        App.api('adm/merchant/item', {
            id
        }).then((merchant) => {

            this.setState({
                merchant,
                loading: false
            })
        })

        App.api('adm/merchant/merchant_admins', {
            merchantAdminQo: JSON.stringify({
                merchantId: id
            })
        }).then((merchantAdmin) => {
            this.setState({
                merchantAdmin,
                loading: false
            })
        })
    }



    render() {
        let { id = {}, merchant = {}, merchantAdmin = [], loading, categories = [] } = this.state;

        let { name, location = {}, validThru, status, productCategorySequence = [] } = merchant;

        let { code, detail } = location;

        return (
            <Modal title={'商户详情'}
                getContainer={() => Utils.common.createModalContainer(id_div)}
                visible={true}
                footer={null}
                width={'800px'}
                onCancel={() => Utils.common.closeModalContainer(id_div)}>
                <div className='modal-scroll-500'>
                    <div className='top'>
                        <Avatar icon={<UserOutlined />} shape="square" size={100} style={{ marginRight: '10px' }} />
                        <div className='summary'>
                            <div className='line'>
                                <label >商户ID</label>
                                <span>{id}</span>
                            </div>
                            <div className='line'>
                                <label >商户名称</label>
                                <span>{name}</span>
                            </div>
                            <div className='line'>
                                <label>商户状态</label>
                                <span>{status}</span>
                                <Popconfirm title="确认执行此操作?"
                                    onConfirm={() => {
                                        App.api('adm/merchant/merchant_status', { id, status: status == 1 ? 2 : 1 }).then(() => { this.loadData(); this.props.loadData(); })
                                    }}>
                                    <a >{status == 1 ? '封禁用户' : '解封用户'}</a>
                                </Popconfirm>
                            </div>
                            <div className='line'>
                                <label>到期时间</label>
                                <span>{U.date.format(new Date(validThru), 'yyyy-MM-dd HH:mm')}</span>
                                <a >续费</a>
                            </div>
                            <div className='line'>
                                <label>地址</label>
                                <span>{Utils.addr.getPCD(code) + '  ' + detail}</span>
                            </div>

                        </div>
                    </div>
                    <div className='cross-title'>
                        <div className='block'>
                            <div className='title'>
                                <Divider>经营范围</Divider>
                                {
                                    productCategorySequence.map((sequence, index) => {
                                        return <React.Fragment>
                                            {categories.map((c, index) => {
                                                if (c.sequence == sequence) {
                                                    return <Tag>{c.name}</Tag>
                                                }
                                            })}
                                        </React.Fragment>
                                    })}
                                <Divider>管理员</Divider>
                            </div>
                        </div>
                    </div>
                    <div className='ant-table-wrapper'>
                        <div className='ant-spin-nested-loading'>
                            <div className='ant-table-body'>
                                <Table
                                    columns={[{
                                        title: '序号',
                                        dataIndex: 'id',
                                        align: 'center',
                                        width: '60px',
                                        render: (i) => i + 1
                                    }, {
                                        title: '手机号',
                                        dataIndex: 'mobile',
                                        align: 'center',
                                        width: '150px',
                                        render: (mobile) => mobile
                                    }, {
                                        title: '姓名',
                                        dataIndex: 'name',
                                        align: 'center',
                                        width: '140px',
                                        render: (name) => name
                                    }, {
                                        title: '操作',
                                        dataIndex: 'change',
                                        align: 'center',
                                        width: '140px',
                                        render: (aaa, merchantAdmin) => {
                                            return <Dropdown overlay={<Menu>
                                                <Menu.Item key="1">
                                                    <a onClick={() => { MerchantUtils.password(merchantAdmin) }}>修改密码</a>
                                                </Menu.Item>
                                            </Menu>} trigger={['click']}>
                                                <a className="ant-dropdown-link">
                                                    操作 <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }


                                    }]}
                                    rowKey={(item) => item.id}
                                    dataSource={merchantAdmin}
                                    pagination={false}
                                    loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>

        );
    }
}

export default Message;