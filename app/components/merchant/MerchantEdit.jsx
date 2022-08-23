import { EnvironmentOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Cascader, Divider, Form, Input, message, Popover, Tabs, TreeSelect } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { App, CTYPE, OSSWrap, U } from '../../common';
import Utils from "../../common/Utils";
import BreadcrumbCustom from '../BreadcrumbCustom';
import { PosterEdit } from "../common/CommonEdit";

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { SHOW_PARENT } = TreeSelect;

const oemLogos = [{
    key: 'logoMobile',
    label: '手机登录logo',
    spec: '建议240*200',
    width: 120,
    height: 100,
    url: 'https://fs.huituozx.com/assets/image/oem/logo_mob.png'
}, {
    key: 'logoPC',
    label: 'PC/管理端logo',
    spec: '建议700*180',
    width: 350,
    height: 90,
    url: 'https://fs.huituozx.com/assets/image/oem/logo_pc.png'
}, {
    key: 'logoAdm',
    label: '管理端内页大logo',
    spec: '建议650*165',
    width: 325,
    height: 82,
    url: 'https://fs.huituozx.com/assets/image/oem/logo_adm.png'
}, {
    key: 'logoSAdm',
    label: '管理端内页小logo',
    spec: '建议200*200',
    width: 120,
    height: 120,
    url: 'https://fs.huituozx.com/assets/image/oem/logo_sadm.png'
}];


class MerchantEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            categories: [],
            regions: [],
            merchant: {},
            oemLogoKey: 'logoMobile'

        }
    }
    componentDidMount() {
        let { id } = this.state;
        if (id !== 0) {
            App.api('adm/merchant/item', { id }).then((merchant) => {
                this.setState({ merchant });
            })

        }
        Utils.addr.loadRegion(this);
        this.loadCates();
    }
    loadCates = () => {
        App.api('adm/product/categories').then((categories) => {
            this.setState({
                categories
            })
        });
    }
    handleSubmit = () => {
        let { merchant = {} } = this.state;
        let { name, mobile, cover, productCategorySequence,location } = merchant;
        let { code, lat, detail } = location;
        if (U.str.isEmpty(name)) {
            message.warn('请添加商户名称');
            return
        } else if (name.length > 10) {
            message.warn('名称长度不能超过10');
            return
        } else if (!U.str.isChinaMobile(mobile)) {
            message.warn('请添加电话');
            return
        } else if (mobile.length > 11) {
            message.warn('电话长度不能超过11');
            return
        } else if (U.str.isEmpty(cover)) {
            message.warn('请添加封面图');
            return
        } else if (U.str.isEmpty(code)) {
            message.warn('请选择地区')
            return
        } else if (U.str.isEmpty(lat)) {
            message.warn('请使用地图选址')
            return
        } else if (U.str.isEmpty(detail)) {
            message.warn('请输入详细地址')
            return
        } else if (U.str.isEmpty(productCategorySequence)) {
            message.warn('请选择经营范围')
            return
        } {
            this.setState({ loading: true });
            App.api('adm/merchant/save', { merchant: JSON.stringify(merchant) }).then(() => {
                message.success('保存成功');
                this.setState({ loading: false });
                setTimeout(() => {
                    App.go('/app/merchant/list/0');
                }, 500);
            }, () => this.setState({ loading: false }));
        }
    };
    handleNewImage = (e) => {

        let { uploading } = this.state;
        if (uploading) {
            message.loading('上传中');
            return;
        }
        let file = e.target.files[0];
        if (!file || file.type.indexOf('png') < 0) {
            message.error('文件类型不正确,请选择png格式图片');
            this.setState({
                uploading: false,
            });
            return;
        }
        this.setState({ uploading: true });
        OSSWrap.upload(file).then((result) => {
            this.setState({ uploading: false });
            let { merchant = {}, oemLogoKey } = this.state;
            let { oem = {} } = merchant;
            oem[oemLogoKey] = result.url;
            merchant.oem = oem;
            console.log(merchant);
            this.setState({ merchant });
        }).catch((err) => {
            message.error(err);
        });
    };
    syncLocation = (loc, _code) => {
        let { merchant = {} } = this.state;
        let { latlng = {}, poiaddress, poiname, code } = loc;

        let { location = {} } = merchant;

        location = {
            ...location,
            lat: latlng.lat,
            lng: latlng.lng,
            poiaddress, poiname, code: _code || code
        };

        this.setState({
            merchant: {
                ...merchant,
                location
            }
        });
    };
    onChange = value => {
        let { merchant = {} } = this.state;
        this.setState({
            merchant: ({
                ...merchant,
                productCategorySequence: value
            })
        });
    }
    render() {
        let { merchant = {}, regions = [], oemLogoKey, categories = [] } = this.state;
        let { name, cover, mobile, location = {}, oem = {}, productCategorySequence } = merchant;

        let { poiaddress = '', poiname = '', code, detail = '' } = location;

        let codes = Utils.addr.getCodes(code);

        let currOem = oemLogos.find(item => item.key == oemLogoKey) || {};

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
                <Card
                    title={<BreadcrumbCustom
                        first={<Link to={CTYPE.link.merchant_list.path}>{CTYPE.link.merchant_list.txt}</Link>}
                        second='创建商户' />}
                    extra={<Button type='primary' icon={<SaveOutlined />} onClick={() => {
                        this.handleSubmit()
                    }}
                    >提交</Button>}>

                    <FormItem {...CTYPE.formItemLayout} required={true} label='商户名称'>
                        <Input value={name} placeholder='请输入名称,最多十个字' maxLength={10} style={{ width: '300px' }}
                            onChange={(e) => {
                                this.setState({
                                    merchant: {
                                        ...merchant,
                                        name: e.target.value
                                    }
                                })
                            }}
                        />
                    </FormItem>
                    <PosterEdit title='Logo' required={true} type='s' scale={'800*800'} img={cover} syncPoster={(url) => {
                        merchant.cover = url;
                        this.setState({
                            merchant
                        });
                    }} />
                    <FormItem required={true} {...CTYPE.formItemLayout} label="经营范围">
                        <TreeSelect value={productCategorySequence} {...tProps} />
                    </FormItem>

                    <FormItem {...CTYPE.formItemLayout} required={true} label='店铺联系方式'>
                        <Input value={mobile} placeholder='请输入电话号码' maxLength={11} style={{ width: '300px' }}
                            onChange={(e) => {
                                this.setState({
                                    merchant: {
                                        ...merchant,
                                        mobile: e.target.value
                                    }
                                })
                            }}
                        />
                    </FormItem>

                    <FormItem required={true}
                        {...CTYPE.formItemLayout}
                        label='地图选址'>
                        <Input value={poiaddress + '' + poiname} disabled={true}
                            addonAfter={<EnvironmentOutlined type="environment" onClick={() => {
                                Utils.common.locationPicker(this.syncLocation);
                            }} />} />
                    </FormItem>

                    <FormItem required={true}
                        {...CTYPE.formItemLayout}
                        label='区域'>
                        <Cascader style={{ width: '300px' }}
                            value={codes}
                            options={regions}
                            placeholder="请选择省市区"
                            onChange={(codes) => {
                                location.code = codes[2];
                                this.setState({
                                    merchant: {
                                        ...merchant,
                                        location
                                    }
                                });
                            }} />
                    </FormItem>
                    <FormItem required={true}
                        {...CTYPE.formItemLayout}
                        label='详细地址'>
                        <Input value={detail} onChange={(e) => {
                            location.detail = e.target.value;
                            this.setState({
                                merchant: {
                                    ...merchant,
                                    location
                                }
                            });
                        }} />

                    </FormItem>
                    <FormItem {...CTYPE.formItemLayout}
                        label='OEM'  >

                        <Divider children='OEM LOGO' style={{ marginTop: '5px' }} />

                        <Tabs activeKey={oemLogoKey} onChange={(key) => {
                            this.setState({ oemLogoKey: key });
                        }}>
                            {oemLogos.map((oem) => {
                                let { label, key } = oem;
                                return <TabPane tab={label} key={key} />;
                            })}
                        </Tabs>

                        <div className=''>
                            <div className='upload-logo'
                                style={{ width: currOem.width, height: currOem.height }}>
                                <img src={oem[oemLogoKey]}
                                    style={{ width: currOem.width, height: currOem.height }} />
                                <input className="file"
                                    type='file' onChange={this.handleNewImage} />
                            </div>
                            {currOem.spec}
                            &nbsp;&nbsp;&nbsp;
                            <Popover content={<div style={{ background: 'rgba(0,0,0,.3)' }}>
                                <img src={currOem.url} style={{ maxWidth: '300px' }} />
                            </div>}
                                title={`示例图片-${currOem.label}`}>
                                <a>查看示例</a>
                            </Popover>
                        </div>

                    </FormItem>

                </Card>
            </div>
        );
    }
}

export default MerchantEdit;