import { ApartmentOutlined, AppstoreOutlined, ProfileOutlined, HomeOutlined, SettingOutlined, DotChartOutlined,ShopOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Utils } from "../common";
import CTYPE from "../common/CTYPE";
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];

        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }

        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        });
    };

    render() {

        let {
            ROLE_LIST,
            ROLE_EDIT,
            MERCHANT_LIST,
            ADMIN_LIST,
            RENEW_LIST,
            PRODUCT_EDIT,
            SETTING,
            ARTICLE_EDIT,
        } = Utils.adminPermissions;

        let withAdmin = ADMIN_LIST || ROLE_LIST || ROLE_EDIT;
        let withArticle = ARTICLE_EDIT;
        let withMerchant = MERCHANT_LIST;
        let withSetting=SETTING;

        let withProduct = PRODUCT_EDIT;
        let withFinance = RENEW_LIST;

        let { firstHide, selectedKey, openKey } = this.state;

        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'} />
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><HomeOutlined /><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>




                    {withMerchant && <SubMenu key='/app/merchant'
                        title={<span><ShopOutlined /> <span
                            className="nav-text">商户管理</span></span>}>
                        {MERCHANT_LIST && <Menu.Item key={CTYPE.link.merchant_list.key}><Link
                            to={CTYPE.link.merchant_list.path}>{CTYPE.link.merchant_list.txt}</Link></Menu.Item>}
                            {MERCHANT_LIST && <Menu.Item key={CTYPE.link.three.key}><Link
                            to={CTYPE.link.three.path}>{CTYPE.link.three.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withFinance && <SubMenu key='/app/finance'
                        title={<span><ProfileOutlined /><span
                            className="nav-text">财务管理</span></span>}>
                        {RENEW_LIST && <Menu.Item key={CTYPE.link.renews.key}><Link
                            to={CTYPE.link.renews.path}>{CTYPE.link.renews.txt}</Link></Menu.Item>}
                    </SubMenu>}


                    {withProduct && <SubMenu key='/app/product'
                        title={<span><AppstoreOutlined /><span
                            className="nav-text">产品管理</span></span>}>
                        {PRODUCT_EDIT && <Menu.Item key={CTYPE.link.products.key}><Link
                            to={CTYPE.link.products.path}>{CTYPE.link.products.txt}</Link></Menu.Item>}

                        {PRODUCT_EDIT && <Menu.Item key={CTYPE.link.products_templates.key}><Link
                            to={CTYPE.link.products_templates.path}>{CTYPE.link.products_templates.txt}</Link></Menu.Item>}

                        {PRODUCT_EDIT && <Menu.Item key={CTYPE.link.brands.key}><Link
                            to={CTYPE.link.brands.path}>{CTYPE.link.brands.txt}</Link></Menu.Item>}
                    </SubMenu>}
                    {withSetting && <SubMenu key='/app/setting'
                        title={<span><SettingOutlined /><span
                            className="nav-text">基础配置</span></span>}>
                         <Menu.Item key={CTYPE.link.uis.key}><Link
                            to={CTYPE.link.uis.path}>{CTYPE.link.uis.txt}</Link></Menu.Item>
                    </SubMenu>}
                    {withArticle && <SubMenu key='/app/article'
                        title={<span><ProfileOutlined /><span
                            className="nav-text">内容管理</span></span>}>
                         <Menu.Item key={CTYPE.link.article.key}><Link
                            to={CTYPE.link.article.path}>{CTYPE.link.article.txt}</Link></Menu.Item>
                             <Menu.Item key={CTYPE.link.artisanCaseImg.key}><Link
                            to={CTYPE.link.artisanCaseImg.path}>{CTYPE.link.artisanCaseImg.txt}</Link></Menu.Item>
                    </SubMenu>}

                    {withAdmin && <SubMenu key='/app/admin'
                        title={<span><SettingOutlined /><span
                            className="nav-text">系统管理</span></span>}>
                        {ADMIN_LIST && <Menu.Item key={CTYPE.link.admin_admins.key}><Link
                            to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link></Menu.Item>}
                        {ROLE_LIST && <Menu.Item key={CTYPE.link.admin_roles.key}><Link
                            to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link></Menu.Item>}
                    </SubMenu>}

                </Menu>
            </Sider>
        );
    }
}

export default SiderCustom;
