import React, { Component } from 'react';
import {  message, Modal ,Form,Input} from 'antd';
import { App, CTYPE, Utils } from '../../common';
import '../../assets/css/common/password.scss';
const id_div = 'div-dialog-password';

const FormItem = Form.Item;


class Password extends Component {

    constructor(props) {
        super(props);
        this.state = {
            merchantAdmin: this.props.merchantAdmin,

            loading: false
        }
    }
    componentDidMount() {

    }
    close = () => {
        Utils.common.closeModalContainer(id_div);
    };
    hideModal = () => {
        let { merchantAdmin = {}} = this.state;
        this.setState({ loading: true });
        App.api('adm/merchant/save_merchantAdmin', { 'merchantAdmin': JSON.stringify(merchantAdmin) }).then(() => {
            message.success('保存成功');

            this.setState({ loading: false });
            this.close();
        }, () => this.setState({ loading: false }));
    };
    render() {
        let { merchantAdmin = {} } = this.state;
        let { password,name } = merchantAdmin;
        return (
            <Modal title={'修改密码'}
                getContainer={() => Utils.common.createModalContainer(id_div)}
                visible={true}
                onOk={this.hideModal
                }
                onCancel={() => Utils.common.closeModalContainer(id_div)}>

                <FormItem {...CTYPE.dialogItemLayout} label='名称'>
                    {name}
                </FormItem>
                <FormItem {...CTYPE.dialogItemLayout} required={true} label='新密码'>
                    <Input  placeholder='密码' maxLength={10} style={{ width: '300px' }}
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
            </Modal>
        );
    }
}

export default Password;