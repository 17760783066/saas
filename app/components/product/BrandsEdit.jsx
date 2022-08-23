import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Space, TreeSelect, Input, InputNumber, message } from 'antd';
import { App, CTYPE, U } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { EnvironmentOutlined, SaveOutlined } from '@ant-design/icons';
import { PosterEdit } from '../common/CommonEdit';

const FormItem = Form.Item;
const { SHOW_PARENT } = TreeSelect;

class BrandsEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            categories: [],
            brand: {}
        }
    }
    componentDidMount() {
        let { id } = this.state;
        if (id !== 0) {
            App.api('adm/product/brand', { id }).then((brand) => {
                this.setState({ brand });
            })

        }
        this.loadData();
    }
    loadData = () => {
        App.api('adm/product/categories').then((categories) => {
            this.setState({
                categories
            })
        });
    }

    handleSubmit = () => {

        let { brand = {} } = this.state;
        let { cover,status, name, categoryId } = brand;
        if (U.str.isEmpty(name)) {
            message.warn('请选择名称');
            return;
        }

        if (categoryId === 0) {
            message.warn('请选择分类');
            return;
        }
       
        if (U.str.isEmpty(status)) {
            brand.status = 1;
        }
        if (U.str.isEmpty(cover)) {
            message.warn('请选择Logo');
            return;
        }
        this.setState({ saving: true });
        App.api('adm/product/save_brand', {
            brand: JSON.stringify(brand)
        }).then((res) => {
            this.setState({ saving: false });
            message.success('已保存');
            window.history.back();
        }, () => {
            this.setState({ saving: false });
        });
    }
    onChange = value => {
        let { brand = {} } = this.state;
        this.setState({
            brand: ({
                ...brand,
                productCategorySequences: value
            })
        });
    }
    render() {
        let { categories = [], brand = {} } = this.state;
        let {  name, cover, priority,productCategorySequences } = brand;
        const tProps = {
            treeData: categories,
            onChange: this.onChange,
            fieldNames: {
                label: 'name',
                value: 'sequence'
            },
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            placeholder: '请选择分类',
            style: {
                width: '100%',
            },
        };
        return (
            <div className='common-edit-page'>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.brands.path}>{CTYPE.link.brands.txt}</Link>}
                    second='编辑品牌' />
                <Card
                    extra={<Button type='primary' icon={<SaveOutlined />} onClick={() => {
                        this.handleSubmit()
                    }}
                    >提交</Button>}>

                    <FormItem {...CTYPE.formItemLayout} required={true} label='品牌名称'>
                        <Input value={name} placeholder='请输入名称,最多十个字' maxLength={10} style={{ width: '300px' }}
                            onChange={(e) => {
                                this.setState({
                                    brand: {
                                        ...brand,
                                        name: e.target.value
                                    }
                                })
                            }}
                        />
                    </FormItem>
                    <PosterEdit title='Logo' required={true} type='s' scale={'800*800'} img={cover} syncPoster={(url) => {
                        brand.cover = url;
                        this.setState({
                            brand
                        });
                    }} />
                    <FormItem {...CTYPE.formItemLayout} required={true} label='适用范围'>
                    <TreeSelect value={productCategorySequences} {...tProps} />

                    </FormItem>
                    <FormItem {...CTYPE.formItemLayout} required={true} label='排序权重'>
                        <Space>
                            <InputNumber
                                min={1}
                                value={priority}
                                onChange={(v) => {
                                    this.setState({
                                        brand: {
                                            ...brand,
                                            priority: v
                                        }
                                    })
                                }}
                            />

                        </Space>
                    </FormItem>
                </Card>

            </div>
        );
    }
}

export default BrandsEdit;