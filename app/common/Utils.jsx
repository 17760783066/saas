import { ConfigProvider, Tag } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom';
import DialogQRCode from "../components/common/DialogQRCode";
import ImgEditor from "./ImgEditor";
import ImgLightbox from "./ImgLightbox";
import { CTYPE, KvStorage, U } from "./index";
import LocationPicker from "./LocationPicker";
import Spider from "./Spider";
import XiumiEditor from "./XiumiEditor";

const statusArr = [{ key: 1, label: '启用', tag: '启用' }, { key: 2, label: '停用', tag: <Tag color="warning">停用</Tag> }];
const statusAdm = [{ key: 1, label: '待审核', tag: '待审核' }, { key: 2, label: '审核失败', tag: <Tag color="red">审核失败</Tag> },{ key: 3, label: '审核成功', tag: <Tag color="blue">审核成功</Tag> }];
const renewTypes =[{ key: 1, label: '开户续费', tag: '开户续费' }, { key: 2, label: '赠送续费', tag: '赠送续费' }];
const payTypes=[{ key: 1, label: '支付宝', tag: '支付宝' }, { key: 2, label: '微信支付', tag: '微信支付' },{ key: 3, label: '银行卡支付', tag:'银行卡支付'}];
const statusPro = [{ key: 1, label: '下架', tag: '下架' }, { key: 2, label: '上架', tag: '上架' }];

let Utils = (function () {

    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1;
    };

    let _setTabIndex = (key, index) => {
        sessionStorage.setItem(key, index);
    };

    let _getTabIndex = (tabKey) => {
        return sessionStorage.getItem(tabKey) ? parseInt(sessionStorage.getItem(tabKey)) : 0;
    };

    let qrcode = (() => {

        let show = (url, avatar, title, copyStr) => {
            common.renderReactDOM(<DialogQRCode url={url} avatar={avatar} title={title} copyStr={copyStr} />);
        };

        return { show };
    })();


    let common = (() => {

        let renderReactDOM = (child, options = {}) => {

            let div = document.createElement('div');
            let { id } = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            }

            document.body.appendChild(div);
            ReactDOM.render(<ConfigProvider locale={zhCN}>{child}</ConfigProvider>, div);
        };

        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        let showImgLightbox = (images, index) => {
            common.renderReactDOM(<ImgLightbox images={images} index={index} show={true} />);
        };

        let showImgEditor = (aspectRatio, img, syncImg) => {
            common.renderReactDOM(<ImgEditor aspectRatio={aspectRatio} img={img}
                syncImg={syncImg} />, { id: 'div-img-editor' });
        };

        let xiumiEditor = (syncContentWrap) => {
            common.renderReactDOM(<XiumiEditor syncContentWrap={syncContentWrap} />);
        };

        let wxSpider = (onSpiderOK) => {
            common.renderReactDOM(<Spider onSpiderOK={onSpiderOK} />);
        };

        let locationPicker = (syncLocation) => {
            common.renderReactDOM(<LocationPicker syncLocation={syncLocation} />);
        };

        return {
            renderReactDOM, closeModalContainer, createModalContainer, showImgLightbox, showImgEditor,
            xiumiEditor, wxSpider, locationPicker
        };
    })();

    let addr = (() => {

        let regions = [];

        let loadRegion = (component) => {
            if (regions && regions.length > 0) {
                component.setState({
                    regions: regions
                });
            } else {
                fetch(CTYPE.REGION_PATH).then(res => {
                    res.json().then((_regions) => {
                        regions = _regions;
                        component.setState({
                            regions: _regions
                        });
                    });
                });
            }
        };

        let getCodes = (code) => {
            let codes = ['41','4101','410104'];
            if (code && code.length === 6) {
                codes[0] = code.substr(0, 2);
                codes[1] = code.substr(0, 4);
                codes[2] = code;
            } 
            return codes;
        };

        
        let getPCD = (code) => {
            console.log(code);
            if (!regions || regions.length === 0 || !code || code === '') {
                return null;
            }
            let codes = getCodes(code);
            let pcd = '';
            regions.map((r1, index1) => {
                if (r1.value === codes[0]) {
                    pcd = r1.label;
                    r1.children.map((r2, index2) => {
                        if (r2.value === codes[1]) {
                            pcd += ' ' + r2.label;
                            r2.children.map((r3, index3) => {
                                console.log(r3);
                                if (r3.value === code) {
                                    pcd += ' ' + r3.label;
                                }
                            })
                        }
                    })
                }
            });
            console.log(pcd);
            return pcd;
        };

        return { loadRegion, getPCD, getCodes };

    })();

    let adminPermissions = null;

    let adm = (() => {

        let avatar = (img) => {
            return img ? img : '';
        };

        let savePermissions = (permissions) => {
            KvStorage.set('admin-permissions', permissions);
            initPermissions();
        };

        let getPermissions = () => {
            return KvStorage.get('admin-permissions') || '';
        };

        let authPermission = (f) => {
            return getPermissions().includes(f);
        };

        let initPermissions = () => {
            if (getPermissions() === '') {
                return;
            }
            Utils.adminPermissions = {
                ROLE_LIST: authPermission("ROLE_LIST"),
                ROLE_EDIT: authPermission('ROLE_EDIT'),
                ARTICLE_EDIT: authPermission('ARTICLE_EDIT'),
                ADMIN_EDIT: authPermission('ADMIN_EDIT'),
                ADMIN_LIST: authPermission('ADMIN_LIST'),
                PRODUCT_EDIT:authPermission('PRODUCT_EDIT'),
                MERCHANT_LIST: authPermission('MERCHANT_LIST'),
                SETTING:authPermission('SETTING'),

                RENEW_LIST:authPermission('RENEW_LIST'),


            };
        };

        let clearPermissions = () => {
            Utils.adminPermissions = null;
            KvStorage.remove('admin-permissions');
        };

        return { avatar, savePermissions, initPermissions, clearPermissions };

    })();


    let num = (() => {

        let formatPrice = value => {
            value = value / 100;
            value += '';
            const list = value.split('.');
            const prefix = list[0].charAt(0) === '-' ? '-' : '';
            let num = prefix ? list[0].slice(1) : list[0];
            let result = '';
            while (num.length > 3) {
                result = `,${num.slice(-3)}${result}`;
                num = num.slice(0, num.length - 3);
            }
            if (num) {
                result = num + result;
            }
            return `¥ ${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
        };

        let num2Chinese = (num) => {
            let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            let chnUnitChar = ["", "十", "百", "千"];

            let strIns = '', chnStr = '';
            let unitPos = 0;
            let zero = true;
            while (num > 0) {
                let v = num % 10;
                if (v === 0) {
                    if (!zero) {
                        zero = true;
                        chnStr = chnNumChar[v] + chnStr;
                    }
                } else {
                    zero = false;
                    strIns = chnNumChar[v];
                    strIns += chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                num = Math.floor(num / 10);
            }

            chnStr = U.str.replaceAll(chnStr, '一十', '十');

            return chnStr;
        };

        return {
            formatPrice, num2Chinese
        };

    })();

    let pager = (() => {

        let convert2Pagination = (result) => {

            let { pageable = {}, totalElements } = result;

            let pageSize = pageable.pageSize || CTYPE.pagination.pageSize;
            let current = pageable.pageNumber + 1;

            return {
                current,
                total: totalElements,
                pageSize
            };
        };

        let getRealIndex = (pagination, index) => {
            return (pagination.current - 1) * pagination.pageSize + index + 1;
        };

        return { convert2Pagination, getRealIndex };

    })();

    let getStatus = (status) => {
        return statusArr.find(item => item.key == status) || { label: '错误', tag: '错误' };
    };
    let getChangeStatus = (status) => {
        return statusPro.find(item => item.key == status) || { label: '错误', tag: '错误' };
    };
    let getStatusRenew = (status) =>{
        return statusAdm.find(item => item.key == status)|| { label: '错误', tag: '错误' };
    }
    let getRenewType = (renewType) =>{
        return renewTypes.find(item => item.key == renewType) || {label:'无',tag:'无'};
    }
    let getPayType = (payType) =>{
        return payTypes.find(item => item.key == payType) || {label:'无',tag:'无'};
    }
    let renderStatusCol = () => {
        return {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: '60px',
            render: (status) => Utils.getStatus(status).tag
        }
    }
    let duration2DateStr = (duration) => {

        if (U.str.isEmpty(duration)) {
            return ''
        }

        const day = [{ key: 'D', label: '天' },
        { key: 'M', label: '个月' },
        { key: 'H', label: '小时' },
        { key: 'Y', label: '年' },
        { key: 'I', label: '分钟' },
        { key: 'W', label: '周' }];
        var str = duration.substr(duration.length - 1, 1);
        let day1 = day.find(d => d.key === str) || {};
        let { label } = day1;
        var s = duration.substr(0, duration.length - 1);
        return s + label;
    };

    return {
        common, adm, num, pager, qrcode, adminPermissions,
        addr, getStatus, renderStatusCol,getStatusRenew,getRenewType,getPayType,duration2DateStr,
        _setCurrentPage, _getCurrentPage, _setTabIndex, _getTabIndex,getChangeStatus
    };

})();

export default Utils;
