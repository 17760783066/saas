import { Form, Input, message, Modal, Divider, InputNumber, Space, Radio } from 'antd';
import React, { Component } from 'react';
import { App, CTYPE, U, Utils, OSSWrap } from '../../common';
import { CommonPeriodSelector } from '../../components/common/CommonComponents'
import copy from '_copy-to-clipboard@3.3.1@copy-to-clipboard';

const id_div = 'div-dialog-duration';
const iconUP = require('../../assets/image/common/upload_placeholder_h.png')


const FormItem = Form.Item;
const { TextArea } = Input;


class Duration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renew: {},
            words: [],
            merchantId: this.props.merchantId
        }
    }
    componentDidMount() {
    }

    save = () => {
        let { renew = {}, merchantId } = this.state;

        let { duration, renewType, payType, status, amount ,payImg,payNumber} = renew;
        if (U.str.isEmpty(duration)) {
            renew.duration = '1Y';
        }
        if (U.str.isEmpty(renewType)) {
            renew.renewType = 1;
        }
        if (U.str.isEmpty(payType)) {
            renew.payType = 1;
        }

        if (U.str.isEmpty(status)) {
            renew.status = 2;
        }
        if (U.str.isEmpty(amount)) {
            renew.amount = 1;
        }
        if (U.str.isEmpty(payImg)) {
            message.warn('请提交支付凭证')
        }
        if (U.str.isEmpty(payNumber)) {
            message.warn('请填写流水号')
        }
        renew.merchantId = merchantId;
        this.setState({ loading: true });

        App.api('adm/merchant/create', { 'renew': JSON.stringify(renew) }).then(() => {
            message.success('保存成功');

            this.setState({ loading: false });
            this.close();
        }, () => this.setState({ loading: false }));
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    }
    handleNewImage = e => {

        let { uploading = false, renew } = this.state;

        let payImg = e.target.files[0];

        if (!e.target.files[0] || !(e.target.files[0].type.indexOf('jpg') > 0 || e.target.files[0].type.indexOf('png') > 0 || e.target.files[0].type.indexOf('jpeg') > 0)) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }
        if (uploading) {
            message.loading('上传中');
            return;
        }
        this.setState({ uploading: true });
        OSSWrap.upload(payImg).then((result) => {
            App.api("/common/get_paynumber", { url: result.url }).then(
                (words) => {
                    this.setState({
                        renew: {
                            ...renew,
                            payImg: result.url,
                        },
                        words,
                        uploading: false,
                    });
                }
            );
            }).catch((err) => {
                    message.error(err);
                });
    };
    render() {
        let { renew,words=[] } = this.state;
        let { duration = '1Y', amount, remark, payImg, renewType = 1, payType = 1, payNumber } = renew;

        console.log(renew)
        return (
            <Modal title={'开户/续费'}
                getContainer={() => Utils.common.createModalContainer(id_div)}
                width={800}
                visible={true}
                onOk={this.save}
                onCancel={() => Utils.common.closeModalContainer(id_div)}

            >

                <div className="common-edit-page">
                    <FormItem {...CTYPE.dialogItemLayout} required={true} label='续费周期'>

                        <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                            syncPeriod={(val) => {
                                this.setState({
                                    renew: {
                                        ...renew,
                                        duration: val
                                    }
                                })
                            }}
                        />
                    </FormItem>
                    <FormItem {...CTYPE.dialogItemLayout} required={true} label='开户类型'>
                        <Radio.Group value={renewType} onChange={(e) => {
                            this.setState({
                                renew: {
                                    ...renew,
                                    renewType: e.target.value
                                }
                            })
                        }}  >
                            <Radio value={1}>支付续费</Radio>
                            <Radio value={2}>赠送续费</Radio>
                        </Radio.Group>

                    </FormItem>
                    {renewType == 1 && <div>

                        <FormItem {...CTYPE.dialogItemLayout} required={true} label='费用金额'>
                            <Space>
                                <InputNumber
                                    min={1}
                                    defaultValue={1}
                                    value={amount}
                                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g)}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(v) => {
                                        this.setState({
                                            renew: {
                                                ...renew,
                                                amount: v
                                            }
                                        })
                                    }}
                                />

                            </Space>
                        </FormItem>
                        <FormItem {...CTYPE.dialogItemLayout} required={true} label='支付方式'>
                            <Radio.Group
                                value={payType}
                                onChange={(e) => {
                                    this.setState({
                                        renew: {
                                            ...renew,
                                            payType: e.target.value
                                        }
                                    })
                                }}  >
                                <Radio value={1}>支付宝</Radio>
                                <Radio value={2}>微信支付</Radio>
                                <Radio value={3}>银行卡转账</Radio>
                            </Radio.Group>
                        </FormItem>
                        <FormItem required={true}   {...CTYPE.dialogItemLayout} label="支付凭证">
                            <div className="common-edit-page" style={{ position: 'relative', width: '140px', height: '140px', }} >
                                <img src={payImg || iconUP} style={{ width: '140px', height: '140px' }} />
                                <input className="file" type='file' onChange={this.handleNewImage} style={{ width: '140px', height: '140px', position: ' absolute', left: '0', top: '0', opacity: '0' }} />
                            </div>
                        </FormItem>

                        {words.length > 0 && <FormItem
                            {...CTYPE.dialogItemLayout}
                            label="凭证信息"
                        >
                            <ul>
                                {words.map((w, i) => {
                                    return <li key={i} >{w}
                                        <Divider type="vertical" />
                                        <a onClick={() => {
                                            copy(w);
                                        }}>复制</a>
                                        <Divider type="vertical" />
                                        <a onClick={() => {
                                            this.setState({
                                                renew: {
                                                    ...renew,
                                                    payNumber: w
                                                },
                                            });
                                        }}>使用</a> </li>
                                })}
                            </ul>
                        </FormItem>}

                        <FormItem
                            required={true}
                            {...CTYPE.dialogItemLayout}
                            label="流水号"
                        >
                            <Input
                                style={{ width: "300px" }}
                                value={payNumber}
                                onChange={(e) => {
                                    this.setState({
                                        renew: {
                                            ...renew,
                                            payNumber: e.target.value,
                                        },
                                    });
                                }}
                            />
                        </FormItem>

                    </div>}

                    <FormItem {...CTYPE.dialogItemLayout} required={true} label='备注'>
                        <TextArea rows={4}
                            value={remark}
                            onChange={(e) => {
                                this.setState({
                                    renew: {
                                        ...renew,
                                        remark: e.target.value
                                    }
                                })
                            }} />
                    </FormItem>
                </div>
            </Modal>
        );
    }
}

export default Duration;