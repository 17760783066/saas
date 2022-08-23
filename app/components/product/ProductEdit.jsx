import React, { Component } from 'react';
import { Modal, Input, Form, Space, InputNumber, message } from 'antd';
import { App, CTYPE, U, Utils } from '../../common';
import { PosterEdit } from "../common/CommonEdit";


const id_div = 'div-dialog-products';
const FormItem = Form.Item;

class ProductEdit extends Component {
    constructor(prosp) {
        super(prosp);
        this.state = {
            
            productCategory: this.props.item,
        }
    }

    componentDidMount() {

    }
    hideModal = () => {
        let { productCategory = {} } = this.state;
        let { name, priority, level } = productCategory;
        if (U.str.isEmpty(name)) {
            message.info('请填名称');
            return;
        }
        if (U.str.isEmpty(priority)) {
            message.info('请填权重');
            return;
        }
        if (U.str.isEmpty(level)) {
            productCategory.parentId = 0;
        }
       
        App.api('adm/product/save_category', {
            'productCategory': JSON.stringify(productCategory)
        }).then(() => {
            message.success('操作成功');
            this.setState({ loading: false });
            this.close();
            this.props.loadData && this.props.loadData();
        }, () => this.setState({ loading: false }));
    };
    close = () => {
        Utils.common.closeModalContainer(id_div)
    }
    render() {
        let { productCategory = {} } = this.state;
        let { name, icon, priority, level } = productCategory;
        return (
            <Modal title={'商户详情'}
                getContainer={() => Utils.common.createModalContainer(id_div)}
                visible={true}
                onOk={this.hideModal}
                onCancel={() => Utils.common.closeModalContainer(id_div)}>
                <FormItem {...CTYPE.formItemLayout} required={true} label='名称'>
                    <Input value={name} maxLength={10} style={{ width: '300px' }}
                        onChange={(e) => {
                            this.setState({
                                productCategory: {
                                    ...productCategory,
                                    name: e.target.value
                                }
                            })
                        }}
                    />
                </FormItem>
                {level != 2 && (
                    <PosterEdit title='图标' type='k' img={icon} required={true} syncPoster={(url) => {
                        productCategory.icon = url;
                        this.setState({
                            productCategory
                        });
                    }} />)}

                <FormItem {...CTYPE.formItemLayout} required={true} label='权重'>
                    <Space>
                        <InputNumber
                            min={1}
                            max={10}
                            value={priority}
                            onChange={(v) => {
                                this.setState({
                                    productCategory: {
                                        ...productCategory,
                                        priority: v
                                    }
                                })
                            }}
                        />

                    </Space>
                </FormItem>
            </Modal>
        );
    }
}

export default ProductEdit;