import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popover, Radio } from 'antd';
import React, { Component } from 'react';
import { App, CTYPE, Utils } from '../../common';

const id_div = 'div-dialog-option';
const FormItem = Form.Item;

class OptionStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renew: {},
            id: this.props.renewId,
            loading: false,
            visible: false,
        }
    }
    componentDidMount() {

    }
    submit = () => {
        let { id, renew = {}, renewQo
        } = this.state;
        let { status } = renew;

        renew.id = id;
        if (status == null) {
            renew.status = 1;
        }
        this.setState({ loading: true });
        App.api('adm/renew/option', { 'renew': JSON.stringify(renew) }).then(() => {
            message.success('保存成功');
            this.setState({ loading: false });
            this.close();
            setTimeout(() => {
                App.go('/app/renew/renews');
            }, 500);
        }, () => this.setState({ loading: false }));
        App.api('adm/renew/renews', {
            renewQo: JSON.stringify({
                ...renewQo,
            })

        }).then(() => {
            this.props.loadData();
        });
    };
    hide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = visible => {
        this.setState({ visible });
    };
    close = () => {
        Utils.common.closeModalContainer(id_div)
    }

    render() {
        let { renew={} } = this.state;
        let { status = 1, reason } = renew;
        return (
            <Modal title={'账单审核'}
                getContainer={() => Utils.common.createModalContainer(id_div)}
                visible={true}
                onOk={this.submit}
                width={'800px'}
                onCancel={() => Utils.common.closeModalContainer(id_div)}>
                <FormItem {...CTYPE.formItemLayout} required={true} label='审核结果'>
                    <Radio.Group value={status} onChange={(e) => {
                        this.setState({
                            renew: {
                                ...renew,
                                status: e.target.value
                            }
                        })
                    }}  >
                        <Radio value={1}>通过</Radio>
                        <Radio value={2}>失败</Radio>
                    </Radio.Group>
                </FormItem>
                {status == 2 && <div>
                    <FormItem {...CTYPE.formItemLayout} required={true} label='失败原因'>
                        <Input
                            value={reason}
                            placeholder="请填写失败原因"
                            onChange={(e) => {
                                this.setState({
                                    renew: {
                                        ...renew,
                                        reason: e.target.value,
                                    }
                                })
                            }}
                            suffix={
                                <div>
                                    {/* {U.str.isNotEmpty(reason) && <CloseCircleOutlined onClick={() => { this.setState({ reason: '' }) }} style={{ marginRight: '10px' }} />} */}

                                    <Popover
                                        title="失败原因"
                                        trigger="click"
                                        placement='right'
                                        visible={this.state.visible}
                                        onVisibleChange={this.handleVisibleChange}
                                        content={<ul>
                                            {['支付金额与应付金额不符', '交易单号错误', '店铺信息错误', '上传虚假凭证'].map((txt, i) => {
                                                return <li onClick={() => {
                                                    this.setState({
                                                        renew: {
                                                            ...renew,
                                                            reason: txt,
                                                        }, visible: false
                                                    })
                                                }} key={i} style={{ lineHeight: '25px' }}><a>{txt}</a></li>
                                            })}
                                        </ul>}
                                    >
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Popover>
                                </div>
                            }
                        />
                    </FormItem> </div>}
            </Modal>

        );
    }
}

export default OptionStatus;