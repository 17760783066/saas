import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Input, message, Modal, Row, Select, Table, Tag } from 'antd';
import React from 'react';
import '../../assets/css/common/common-edit.scss';
import { App, CTYPE, U, Utils } from '../../common';
import SuggestItems from '../common/SuggestItems';
import ProductUtils from '../product/ProductUtils';
import SettingUtils from "./SettingUtils";
// import '../../assets/css/common/common-edit.less';
// import TrainerUtils from "../trainer/TrainerUtils";
// import CourseUtils from "../course/CourseUtils";
// import AdminProfile from "../admin/AdminProfile";
const Option = Select.Option;
const InputSearch = Input.Search;
const id_div_banner = 'div-dialog-banenr-edit';
class BannerEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: SettingUtils.linkActions,
            banner: this.props.banner,
            uiType: this.props.type,
            list: []
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            banner: newProps.banner,
            uiType: newProps.type
        });
    }

    syncImg = (url) => {
        let banner = this.state.banner;
        this.setState({
            banner: {
                ...banner,
                img: url
            }
        });
    };

    syncPayload = (items) => {
        let banner = this.state.banner;
        this.setState({
            banner: {
                ...banner,
                payload: items[0]
            }
        });
    };

    doSave = () => {

        let banner = this.state.banner;
        let { img, act, payload = {} } = banner;

        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }

        if (act === 'LINK' && U.str.isEmpty(payload.url)) {
            message.warn('请填写跳转地址');
            return;
        }

        if (act !== 'NONE' && act !== 'LINK' && !payload.id) {
            message.warn('请选择关联明细');
            return;
        }

        this.props.syncBanner(banner);
        this.close();

    };

    pick = (act, item) => {
        let isTrainer = act === 'TRAINER';
        let isTop = act === 'TOP';
        let isArticle = act === 'ARTICLE';//推荐案例
        let isPutaway = act === 'PUTAWAY';//最近上架
        let isDecoration = act === 'DECORATION';//装修技巧
        let isAfflatus = act === 'AFFLATUS';//找灵感
        if (isTrainer) {
            SettingUtils.merchantPicker([item], this.syncPayload, false);
        } else if (isTop) {
            SettingUtils.productPicker([item], this.syncPayload, false);
        } else if (isPutaway) {
            SettingUtils.putawayPicker([item], this.syncPayload, false);
        } else if (isArticle) {
            SettingUtils.articlePicker([item], this.syncPayload, false);
        } else if (isDecoration) {
            SettingUtils.decorationPicker([item], this.syncPayload, false);
        } else if (isAfflatus) {
            SettingUtils.afflatusPicker([item], this.syncPayload, false);

        }
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_banner);
    };

    render() {
        let { banner, actions = [], uiType } = this.state;
        let { act = 'NONE', payload = { id: 0, title: '', url: '' }, img, type } = banner;
        let showLink = act === 'LINK';
        let showPicker = act !== 'NONE' && act !== 'LINK';

        let isBanner = type === 'BANNER';
        let isAd = type === 'AD';

        let txt = '轮播图';
        let ratio = (isBanner ? CTYPE.imgeditorscale.rectangle_h : CTYPE.imgeditorscale.rectangle_ad)
        if (isAd) {
            txt = '广告位';
        }
        let options = { canvasScale: uiType === 1 ? 1 : 2 };
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_banner)}
            visible={true}
            title={`编辑${txt}`}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            onOk={this.doSave}>
            <div className="common-edit-page">
                <div className="form">
                    {(isAd || isBanner) && <div className="line">
                        <div className="p required">图片</div>
                        <div className='upload-img-h'
                            onClick={() => Utils.common.showImgEditor(ratio, img, this.syncImg, options)}>
                            {img && <img src={img} className="img" />}
                        </div>
                        {uiType === 1 && <span style={{ marginTop: '50px', marginLeft: '10px' }}>
                            建议上传图片尺寸{isAd ? '345 * 100' : '345 * 200'}，.jpg、.png格式，文件小于1M
                        </span>}
                        {uiType === 2 && <span style={{ marginTop: '50px', marginLeft: '10px' }}>
                            建议上传图片尺寸{isAd ? '1200 * 190' : '1200 * 380'}，.jpg、.png格式，文件小于1M
                        </span>}
                    </div>}
                    <div className="line">
                        <div className='p'>跳转类型</div>
                        <Select
                            showSearch
                            style={{ width: 600 }}
                            optionFilterProp="children"
                            value={act}
                            onChange={(act) => {
                                this.setState({
                                    banner: {
                                        ...banner,
                                        act,
                                    },
                                    // payload:{
                                    //     ...payload,
                                    //     id:0,
                                    // }
                                });
                            }}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            {actions.map((act) => {
                                return <Option key={act.key}><span
                                    className={act.disabled ? 'font-red' : ''}>{act.name}</span></Option>;
                            })}
                        </Select>
                    </div>
                    {showPicker && <div className="line">
                        <div className='p'>关联明细</div>
                        {payload.id == 0 && <a onClick={() => {
                            this.pick(act, {});
                        }}>选择</a>}
                        {payload.id > 0 && <span>{payload.name || payload.title}&nbsp;&nbsp;<a onClick={() => {
                            this.pick(act, payload);
                        }}>修改</a></span>}
                    </div>}

                    {showLink && <div className="line">
                        <div className="p required">链接</div>
                        <Input.TextArea className=" textarea" placeholder="输入跳转链接"
                            value={payload.url}
                            onChange={(e) => {
                                this.setState({
                                    banner: {
                                        ...banner,
                                        payload: { url: U.str.trim(e.target.value) }
                                    }
                                });
                            }} />
                    </div>}
                </div>
            </div>
        </Modal>;
    }
}

const id_div_course = 'div-dialog-course-picker';

class CoursePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            categories: [],
            status: 1,
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
            },
            loading: false,
        };
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
        let { brandQo = {}, pagination = {}, status } = this.state;
        brandQo["status"] = status;
        App.api('adm/product/brands', {
            brandQo: JSON.stringify({
                ...brandQo,
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

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    refresh = () => {
        this.setState({
            list: [],
            q: '',
            pagination: {
                ...this.state.pagination,
                current: 1
            }
        }, () => {
            this.loadData();
        });
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_course);
    };

    render() {

        let { list = [], loading, categories = [], multi = false, items = [] } = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_course)}
            visible={true}
            title={'请选择品牌'}
            width='1100px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>

                <div className='clearfix-h20' />
                <Table
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
                        dataIndex: 'productCategorySequences',
                        align: 'center',
                        render: (productCategorySequences) =>
                            ProductUtils.brandCategory(productCategorySequences, categories)
                    }, {
                        title: 'LOGO',
                        dataIndex: 'cover',
                        align: 'center',
                        render: cover => <Avatar shape="square" src={cover} size={40} icon={<UserOutlined />} />

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
                        render: (obj, brand, index) => {
                            let has = items.find(item => item.id === brand.id) || {};
                            return <span>
                                {has.id && <span>-/-</span>}
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(brand);
                                    } else {
                                        this.singleClick(brand);
                                    }
                                }}>选择</a>}
                            </span>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading}
                />
            </div>
        </Modal>;
    }

}

const id_div_live = 'div-dialog-live-picker';

class LivePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            categories: [],
            productQo: {},
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
            },
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
        // CourseUtils.loadCategories(this);
        App.api('adm/product/categories').then((categories) => {
            this.setState({
                categories
            })
        });
    }

    loadData = () => {
        let { pagination, productQo = {} } = this.state;
        this.setState({ loading: true });
        App.api('adm/product/products', {
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
    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    refresh = () => {
        this.setState({
            list: [],
            q: '',
            pagination: {
                ...this.state.pagination,
                current: 1
            }
        }, () => {
            this.loadData();
        });
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_live);
    };

    render() {
        let { loading, list = [], categories = [], multi = false, items = [] } = this.state;
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_live)}
            visible={true}
            title={'请选择商品'}
            width='1100px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div>
                <Card>
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

                    <Table
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
                            render: (obj, product, index) => {
                                let has = items.find(item => item.id === product.id) || {};
                                return <span>
                                    {has.id && <span>-/-</span>}
                                    {!has.id && <a onClick={() => {
                                        if (multi) {
                                            this.multiClick(product);
                                        } else {
                                            this.singleClick(product);
                                        }
                                    }}>选择</a>}
                                </span>;
                            }

                        }]}
                        rowKey={(item) => item.id}
                        dataSource={list}
                        pagination={false}
                        loading={loading}
                    />
                </Card>
            </div>
        </Modal>
    }

}
const id_div_picker = 'div-dialog-putaway-picker';
class PutawayPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            productQo: {},
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
            },
            loading: false,

            status: 1,
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        let { pagination = {}, productQo } = this.state;
        this.setState({ loading: true });
        App.api('adm/product/products', {
            productQo: JSON.stringify({
                productQo,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };
    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    refresh = () => {
        this.setState({
            list: [],
            pagination: {
                ...this.state.pagination,
                current: 1
            }
        }, () => {
            this.loadData();
        });
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_picker);
    };

    render() {
        let { items = [], categories = [], list = [], pagination = {}, loading, categoryId, multi } = this.state;
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_picker)}
            visible={true}
            title={'请选择商品'}
            width='1100px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row>
                    <Col style={{ textAlign: 'right' }}>

                        <InputSearch style={{ width: '240px', float: 'right' }}
                            onChange={(e) => {
                                this.setState({
                                    q: e.target.value,
                                });
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字" />

                        <Select style={{ width: '150px', float: 'right', marginRight: '10px' }} value={categoryId}
                            onSelect={(v) => {
                                this.setState({
                                    list: [], categoryId: v
                                }, () => {
                                    this.refresh();
                                });
                            }}>
                            <Option value={0}>店铺分类</Option>
                            {categories.map((cate, i) => {
                                let { name, status } = cate;
                                if (status !== 1) {
                                    name = name + '  (已下架)';
                                }
                                return <Option key={i} value={cate.id}>{name}</Option>;
                            })}
                        </Select>
                    </Col>
                </Row>
                <div className='clearfix-h20' />
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => Utils.pager.getRealIndex(pagination, i)
                    }, {
                        title: '图片',
                        dataIndex: 'specs',
                        className: 'txt-center ',
                        render: (specs = []) => {
                            let imgs = specs.length > 0 ? specs[0].imgs : [];
                            return <img style={{ width: 60, height: 60 }} src={imgs[0]}
                                onClick={() => {
                                    Utils.common.showImgLightbox(imgs)
                                }} />
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                    }, {
                        title: '类别',
                        dataIndex: 'categoryId',
                        className: 'txt-center'
                    }, {
                        // title: '参数',
                        // dataIndex: 'params',
                        // align: 'center',
                        // render: (params = [], product) => {
                        //     return <a onClick={() => { ProductUtils.drawer(product.id) }}>【{params.length}】</a>
                        // }
                    }, {
                        // title: '规格',
                        // dataIndex: 'specs',
                        // className: 'txt-center',
                        // render: (specs = [], product) => {
                        //     return <a onClick={() => { ProductUtils.drawer(product.id) }}>【{specs.length}】</a>
                        // }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => status === 1 ? "正常" : <span style={{ color: '#f89406' }}>封禁</span>
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, trainer, index) => {
                            let has = items.find(item => item.id === trainer.id) || {};
                            return <span>
                                {has.id && <span>-/-</span>}
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(trainer);
                                    } else {
                                        this.singleClick(trainer);
                                    }
                                }}>选择</a>}
                            </span>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>;
    }

}

const id_div_nav = 'div-dialog-nav-edit';

class NavEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: this.props.nav,
            uiType: this.props.type,
            productQo: [],
        };
    }

    syncImg = (url) => {
        let nav = this.state.nav;
        this.setState({
            nav: {
                ...nav,
                icon: url
            }
        });
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({ loading: true });
        App.api('adm/product/list_category').then((productQo) => {
            this.setState({
                productQo,
                loading: false
            })
        });

    };

    doSave = () => {

        let { nav, uiType } = this.state;
        let { icon, title } = nav;
        if (U.str.isEmpty(icon)) {
            message.warn('请上传图标');
            return;
        }

        if (uiType === 1 && U.str.isEmpty(title)) {
            message.warn('请填写名称');
            return;
        }
        if (uiType === 1 && title.length > 5) {
            message.warn('名称不超过五个字');
            return;
        }

        this.props.syncBanner(nav);
        this.close();

    };

    close = () => {
        Utils.common.closeModalContainer(id_div_nav);
    };

    render() {
        let { nav = {}, uiType, productQo = [] } = this.state;
        let { icon, title, name } = nav;
        let ratio = CTYPE.imgeditorscale.square;
        const style = { width: '100px', height: '100px' };
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_nav)}
            visible={true}
            title={`编辑二级导航`}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            onOk={this.doSave}>
            <div className='common-edit-page'>
                <div className='form'>

                    <div className="line">
                        <div className="p required">图标</div>
                        <div className='upload-img-preview' style={style}
                            onClick={() => Utils.common.showImgEditor(ratio, icon, this.syncImg)}>
                            {icon && <img src={icon} className="img" />}
                        </div>
                    </div>

                    <div className="line">
                        <div className='p required'>名称</div>
                        <Input style={{ width: '200px' }} maxLength={5} value={title}
                            placeholder='请输入名称'
                            onChange={(e) => this.setState({
                                nav: {
                                    ...nav,
                                    title: e.target.value
                                }
                            })} />
                    </div>
                    <div className="line">
                        <div className='p required'>类型</div>
                        <Select style={{ width: '200px' }} value={productQo.id} placeholder='请选择导航类型'
                            onChange={(value) => this.setState({
                                nav: {
                                    ...nav,
                                    id: value
                                }
                            })}>
                            <Option value='0' key={-1}>请选择</Option>
                            {productQo.map((g, i) => {
                                if (g.parentId == 0) {
                                    return <Option key={i} value={g.id}>{g.name}</Option>
                                }
                            })}
                        </Select>
                    </div>
                </div>
            </div>
        </Modal>;

    }

}

const id_div_article = 'div-dialog-article-picker';

class ArticlePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            multi: this.props.multi,
            items: this.props.items,
            list: [],
            pagination: { pageSize: CTYPE.pagination.pageSize, current: 1, total: 0 },
            loading: false,
            articleQo: {}
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { pagination = {}, title } = this.state;
        this.setState({ loading: true });
        App.api('adm/article/articles', {
            articleQo: JSON.stringify({
                title,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                type: 1
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_article);
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    render() {

        let { items = [], list = [], pagination, loading, multi = false } = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_article)}
            visible={true}
            title={'请选择文章'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row style={{ padding: '10px 0' }}>
                    <Col span={12}>
                        <InputSearch
                            onChange={(e) => {
                                this.setState({
                                    title: e.target.value,
                                });
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询" />
                    </Col>
                </Row>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, item, index) => index + 1
                    }, {
                        title: '图片',
                        dataIndex: 'cover',
                        align: 'center',
                        render: cover => <Avatar shape="square" src={cover} size={40} icon={<UserOutlined />} />
                    }, {
                        title: '标题',
                        dataIndex: 'title',
                        align: 'center',
                        render: (title) => {
                            return <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{title}</div>;
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            switch (status) {
                                case 1:
                                    return <Tag color="#2db7f5">启用</Tag>;
                                case 2:
                                    return <Tag color="red">停用</Tag>;
                            }
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, article, index) => {
                            let has = items.find(item => item.id === article.id) || {};
                            return <span>
                                {has.id && <span>-/-</span>}
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(article);
                                    } else {
                                        this.singleClick(article);
                                    }
                                }}>选择</a>}
                            </span>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>;
    }
}
class DecorationPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            multi: this.props.multi,
            items: this.props.items,
            list: [],
            pagination: { pageSize: CTYPE.pagination.pageSize, current: 1, total: 0 },
            loading: false,
            articleQo: {},

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let { pagination = {}, title } = this.state;
        this.setState({ loading: true });
        App.api('adm/article/articles', {
            articleQo: JSON.stringify({
                title,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                type: 2
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_article);
    };


    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    render() {

        let { items = [], list = [], pagination, loading, multi = false } = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_article)}
            visible={true}
            title={'请选择文章'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row style={{ padding: '10px 0' }}>
                    <Col span={12}>
                        <InputSearch
                            onChange={(e) => {
                                this.setState({
                                    title: e.target.value,
                                });
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询" />
                    </Col>
                </Row>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, item, index) => index + 1
                    }, {
                        title: '图片',
                        dataIndex: 'cover',
                        align: 'center',
                        render: cover => <Avatar shape="square" src={cover} size={40} icon={<UserOutlined />} />
                    }, {
                        title: '标题',
                        dataIndex: 'title',
                        align: 'center',
                        render: (title) => {
                            return <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{title}</div>;
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            switch (status) {
                                case 1:
                                    return <Tag color="#2db7f5">启用</Tag>;
                                case 2:
                                    return <Tag color="red">停用</Tag>;
                            }
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, article, index) => {
                            let has = items.find(item => item.id === article.id) || {};
                            return <span>
                                {has.id && <span>-/-</span>}
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(article);
                                    } else {
                                        this.singleClick(article);
                                    }
                                }}>选择</a>}
                            </span>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>;
    }
}
const id_div_trainer = 'div-dialog-trainer-picker';
const { Search } = Input;
class ProductPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            productQo: {},
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
            },
            loading: false,
            categories: [],

            status: 1,
        };
    }
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
    componentDidMount() {
        this.loadData();
        App.api('adm/product/categories').then((categories) => {
            this.setState({
                categories
            })
        });
    }

    getQuery = () => {
        let { status, search, q = [] } = this.state;
        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                query = { title: q };
            }
        }
        if (status !== 0) {
            query.status = status;
        }
        return query;
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };


    loadData = () => {
        let { pagination, productQo } = this.state;
        this.setState({ loading: true });
        App.api('adm/product/products', {
            productQo: JSON.stringify({
                ...productQo,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
            })
        }).then((result) => {
            let pagination = Utils.pager.convert2Pagination(result);
            let { content = [] } = result;
            this.setState({
                list: content,
                pagination,
                loading: false
            });
            // TrainerUtils.setTrainerCurrentPage(pagination.current);
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_trainer);
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    render() {
        let { items = [], list = [], multi = false, loading, pagination = {}, categories = [] } = this.state;
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_trainer)}
            visible={true}
            title={'请选择商品'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row>
                    <Col style={{ textAlign: 'right' }}>
                        <SuggestItems type='merchant' syncItem={(merchant) => {
                            this.reloadDate('merchantId', merchant.id);
                        }} />
                        <Search
                            style={{ width: '300px', float: 'right', marginRight: '10px' }}
                            placeholder="输入名称查询"
                            onSearch={(val) => {
                                this.reloadDate("name", val);
                            }
                            }
                        />
                    </Col>
                </Row>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => Utils.pager.getRealIndex(pagination, i)
                    }, {
                        title: '图片',
                        dataIndex: 'specs',
                        className: 'txt-center ',
                        render: (specs = []) => {
                            let imgs = specs.length > 0 ? specs[0].imgs : [];
                            return <img style={{ width: 60, height: 60 }} src={imgs[0]}
                                onClick={() => {
                                    Utils.common.showImgLightbox(imgs)
                                }} />
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                    }, {
                        title: '类别',
                        dataIndex: 'categoryId',
                        className: 'txt-center',
                        render: (categoryId) => ProductUtils.renderCateTags(categoryId, categories)
                    },
                    // {
                    // title: '参数',
                    // dataIndex: 'params',
                    // align: 'center',
                    // render: (params = [], product) => {
                    //     return <a onClick={() => { ProductUtils.drawer(product.id) }}>【{params.length}】</a>
                    // }
                    // }, {
                    // title: '规格',
                    // dataIndex: 'specs',
                    // className: 'txt-center',
                    // render: (specs = [], product) => {
                    //     return <a onClick={() => { ProductUtils.drawer(product.id) }}>【{specs.length}】</a>
                    // }
                    // },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => status === 1 ? "正常" : <span style={{ color: '#f89406' }}>封禁</span>
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, trainer, index) => {
                            let has = items.find(item => item.id === trainer.id) || {};
                            return <span>
                                {has.id && <span>-/-</span>}
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(trainer);
                                    } else {
                                        this.singleClick(trainer);
                                    }
                                }}>选择</a>}
                            </span>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>;

    }
}
const id_div_merchant = 'div-dialog-merchant-picker';
class MerchantPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            categories: [],
            merchantQo: {},
            status: 1,
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
            },
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
        // CourseUtils.loadCategories(this);
        App.api('adm/product/categories').then((categories) => {
            this.setState({
                categories
            })
        });
    }
    reloadDate = (key, value) => {
        let { pagination = {}, merchantQo = {} } = this.state;
        if (key) {
            merchantQo[key] = value;
        }
        this.setState(
            {
                merchantQo,
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
    loadData = () => {
        let { pagination, merchantQo = {}, } = this.state;
        this.setState({ loading: true });
        App.api('adm/merchant/merchant-list', {
            merchantQo: JSON.stringify({
                ...merchantQo,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let { content = [] } = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
            // CourseUtils.setCurrentPage(pagination.current);
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    refresh = () => {
        this.setState({
            list: [],
            q: '',
            pagination: {
                ...this.state.pagination,
                current: 1
            }
        }, () => {
            this.loadData();
        });
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_merchant);
    };

    render() {

        let { items = [], multi = false, categories = [], list = [], pagination = {}, loading, categoryId, q, status } = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_merchant)}
            visible={true}
            title={'请选择店铺'}
            width='1100px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row>
                    <Col style={{ textAlign: 'right' }}>
                        <Select
                            defaultValue='状态'
                            style={{ float: 'right' }}
                            onChange={(value) =>
                                this.reloadDate('status', value)}>
                            <Option value="0">状态</Option>
                            <Option value="1">正常</Option>
                            <Option value="2">禁用</Option>
                        </Select>
                        <InputSearch
                            style={{ width: '300px', float: 'right', marginRight: '10px' }}
                            placeholder="输入手机号或者名称查询"
                            onSearch={(value) => {
                                this.reloadDate("nameOrMobile", value);
                            }
                            }
                        />
                    </Col>
                </Row>
                <div className='clearfix-h20' />
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => Utils.pager.getRealIndex(pagination, i)
                    }, {
                        title: '头像',
                        dataIndex: 'cover',
                        className: 'txt-center',
                        width: '80px',
                        render: cover => <Avatar shape="square" src={cover} size={40} icon={<UserOutlined />} />
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        className: 'txt-center',

                    }, {
                        title: '到期时间',
                        dataIndex: 'validThru',
                        className: 'txt-center',
                        render: (t) => t ? U.date.format(new Date(t), 'yyyy-MM-dd HH:mm') : '-/-'

                    }, {
                        title: '创建时间',
                        dataIndex: 'course.classHour',
                        className: 'txt-center',
                        render: (t) => t ? U.date.format(new Date(t), 'yyyy-MM-dd HH:mm') : '-/-'

                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            return <div className="status">
                                {status === 1 ? <span>上架</span> : <span className="warning">下架</span>}</div>;
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, course, index) => {
                            let has = items.find(item => item.id === course.id) || {};
                            return <span>
                                {has.id && <span>-/-</span>}
                                {!has.id && <a onClick={() => {
                                    if (multi) {
                                        this.multiClick(course);
                                    } else {
                                        this.singleClick(course);
                                    }
                                }}>选择</a>}
                            </span>;
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />
            </div>
        </Modal>

    }
}
const id_div_afflatus = 'div-dialog-afflatus-picker';

class AfflatusPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            multi: this.props.multi,
            artisanCaseImgQo: {},
            list: [],
            loading: false,
        }
    }
    componentDidMount() {

        this.loadData();
    }
    loadData = () => {
        let { artisanCaseImgQo = {}, } = this.state;
        this.setState({ loading: true });
        App.api('adm/img/artisanCaseImgs', {
            artisanCaseImgQo: JSON.stringify({
                artisanCaseImgQo,
            })

        }).then((result) => {
            this.setState({
                list: result,
                loading: false
            });
        });

    };
    close = () => {
        Utils.common.closeModalContainer(id_div_afflatus);
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
        this.close();

    };

    render() {
        let { list = [], items = [], multi = false, } = this.state;
        return (<Modal
            getContainer={() => Utils.common.createModalContainer(id_div_afflatus)}
            visible={true}
            title={'请选择图集'}
            width='1100px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='afflatus-page'>
                <Card >
                    <div className='bordered'>
                        {
                            list.map((i, index) => {
                                let { id, title } = i;
                                let has = items.find(item => item.id === id) || {};
                                return <Card
                                    style={{ width: 298, marginLeft: 10 }}
                                    cover={
                                        <img style={{ width: 298, height: 298 }}
                                            alt="图片出错"
                                            src={i.imgs[0]}
                                        />
                                    }
                                >
                                    {title}
                                    {
                                        <span>
                                            {has.id && <span>-/-</span>}
                                            {!has.id && <a onClick={() => {
                                                if (multi) {
                                                    this.multiClick(i);
                                                } else {
                                                    this.singleClick(i);
                                                }
                                            }}>选择</a>}
                                        </span>
                                    }
                                </Card>
                            })
                        }

                    </div>

                </Card>
            </div >
        </Modal>

        );
    }
}
export {
    BannerEdit, CoursePicker, LivePicker, MerchantPicker, DecorationPicker,
    ArticlePicker, NavEdit, ProductPicker, PutawayPicker, AfflatusPicker,
};
