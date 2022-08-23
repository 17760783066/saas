import { Form, Input, message, Modal, Select } from 'antd';
import React, { Component } from 'react';
import '../../assets/css/common/message.scss';
import { App, CTYPE, U, Utils } from '../../common';



const id_div = 'div-dialog-loginlogs';

const FormItem = Form.Item;
const { Option } = Select;


class AdmAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            merchant: this.props.merchant,
            loading: false,
            merchantAdmin: {},
            roles: []
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        let { merchant } = this.state;
        App.api('adm/merchant/roles', {
            merchantRoleQo: JSON.stringify({
                merchantId: merchant.id,
            })
        }).then((result) => {
            if (result.length === 0) {
                message.warn('请设置管理组');
            }
            this.setState({
                roles: result
            })
        })
    }

    hideModal = () => {
        let { merchantAdmin = {}, merchant = {} } = this.state;
        let { name, mobile, password ,merchantRoleId} = merchantAdmin;
        let { id } = merchant;
        merchantAdmin.merchantId = id;
        if (U.str.isEmpty(name)) {
            message.warn('请添加姓名');
            return
        } else if (name.length > 10) {
            message.warn('名称长度不能超过10');
            return
        } else if (!U.str.isChinaMobile(mobile)) {
            message.warn('请添加手机号');
            return
        } else if (U.str.isEmpty(password)) {
            message.warn('请输入密码');
            return
        }else if (merchantRoleId == null) {
            message.warn('请选择权限');
            return
        }
        this.setState({ loading: true });
        App.api('adm/merchant/save_merchantAdmin', { 'merchantAdmin': JSON.stringify(merchantAdmin) }).then(() => {
            message.success('保存成功');

            this.setState({ loading: false });
            this.close();
        }, () => this.setState({ loading: false }));
    };
    close = () => {
        Utils.common.closeModalContainer(id_div)
    }


    render() {
        let { merchant = {}, merchantAdmin = {}, roles = [] } = this.state;
        let { name, mobile, password, merchantRoleId = 0 } = merchantAdmin;

        return (
            <Modal title={'添加商户管理员'}
                getContainer={() => Utils.common.createModalContainer(id_div)}
                visible={true}
                onOk={this.hideModal
                }

                width={'500px'}
                onCancel={() => Utils.common.closeModalContainer(id_div)}
            >

                <FormItem {...CTYPE.dialogItemLayout} label='商户名称'>
                    {merchant.name}
                </FormItem>
                <FormItem {...CTYPE.dialogItemLayout} required={true} label='姓名'>
                    <Input value={name} placeholder='姓名' maxLength={10} style={{ width: '300px' }}
                        onChange={(e) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    name: e.target.value
                                }
                            })
                        }}
                    />
                </FormItem>
                <FormItem {...CTYPE.dialogItemLayout} required={true} label='手机号'>
                    <Input value={mobile} placeholder='手机号' maxLength={11} style={{ width: '300px' }}
                        onChange={(e) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    mobile: e.target.value
                                }
                            })
                        }}
                    />
                </FormItem>
                <FormItem {...CTYPE.dialogItemLayout} required={true} label='密码'>
                    <Input value={password} placeholder='密码' maxLength={10} style={{ width: '300px' }}
                        onChange={(e) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    password: e.target.value
                                }
                            })
                        }}
                    />
                </FormItem>
                <FormItem {...CTYPE.dialogItemLayout} required={true} label='权限组'>
                    <Select
                        style={{ width: '300px' }}
                        value={merchantRoleId}

                        onChange={(v) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    merchantRoleId: v
                                }
                            })
                        }}>
                        <Option value={0}>请选择</Option>
                        {roles.map((g, i) => {
                            return <Option key={i + 1} value={g.id}>{g.name}</Option>
                        })}
                    </Select>

                </FormItem>

            </Modal>
        );
    }
}

export default AdmAdd;