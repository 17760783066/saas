import React from 'react';
import {Utils} from "../../common";
import {ArticlePicker,DecorationPicker,AfflatusPicker, BannerEdit, CoursePicker, LivePicker, NavEdit, ProductPicker,PutawayPicker,MerchantPicker} from "./SettingComps";

let SettingUtils = (() => {

    const UITypes = [{type: 1, label: '微信首页', disabled: false}, {type: 2, label: 'PC首页', disabled: false}];

    const UIComponentTypes = [
        {
            "key": "AD",
            "name": "广告位"
        },
        {
            "key": "BANNER",
            "name": "轮播图"
        },
        {
            "key": "NAV",
            "name": "一级分类"
        },
        {
            "key": "TOP",
            "name": "推荐商品"
        },
        {
            "key": "COURSE",
            "name": "推荐品牌"
        },
        {
            "key": "TRAINER",
            "name": "推荐门店"
        },
        {
            "key": "LIVE",
            "name": "热销商品"
        },
        {
            "key": "ARTICLE",
            "name": "推荐案例"
        },
        {
            "key": "PUTAWAY",
            "name": "最近上架"
        },
        {
            "key": "DECORATION",
            "name": "装修技巧"
        },{
            "key": "AFFLATUS",
            "name": "找灵感"
        }
    ];

    const linkActions = [
        {
            "key": "NONE",
            "name": "无"
        },
        {
            "key": "LINK",
            "name": "链接"
        },
        {
            "key": "TRAINER",
            "name": "店铺"
        },
        {
            "key": "TOP",
            "name": "商品"
        },
        {
            "key": "ARTICLE",
            "name": "推荐案例"
        },
        {
            "key": "PUTAWAY",
            "name": "最近上架"
        },
        {
            "key": "DECORATION",
            "name": "装修技巧"
        },{
            "key": "AFFLATUS",
            "name": "找灵感"
        }

    ];

    let bannerEdit = (banner, syncBanner, type) => {
        Utils.common.renderReactDOM(<BannerEdit banner={banner} syncBanner={syncBanner} type={type}/>);
    };
    //brand
    let coursePicker = (items, syncItems, multi) => {
        Utils.common.renderReactDOM(<CoursePicker items={items} syncItems={syncItems} multi={multi}/>);
    };
    //article
    let articlePicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<ArticlePicker items={items} syncItems={syncItems}/>);
    };
    let decorationPicker = (items, syncItems) => {
        Utils.common.renderReactDOM(<DecorationPicker items={items} syncItems={syncItems}/>);
    };
    //afflatus
    let afflatusPicker = (items, syncItems,multi) => {
        Utils.common.renderReactDOM(<AfflatusPicker items={items} syncItems={syncItems} multi={multi}/>);
    };
    //merchant
    let merchantPicker = (items,syncItems,multi)=>{
        Utils.common.renderReactDOM(<MerchantPicker items={items} syncItems={syncItems} multi={multi}/>);
    }
    let navEdit = (nav, syncBanner,type) => {
        Utils.common.renderReactDOM(<NavEdit nav={nav} syncBanner={syncBanner} type={type}/>);
    };
    //product
    let productPicker = (items, syncItems, multi) => {
        Utils.common.renderReactDOM(<ProductPicker items={items} syncItems={syncItems} multi={multi}/>);
    };
    let livePicker = (items, syncItems,multi) => {
        Utils.common.renderReactDOM(<LivePicker items={items} syncItems={syncItems} multi={multi}/>);
    };
    //putaway
    let putawayPicker = (items,syncItems,multi)=>{
        Utils.common.renderReactDOM(<PutawayPicker items={items} syncItems={syncItems} multi={multi}/>);

    }

    let parseAct = (b) => {
        let act = '';
        if (b.act === 'NONE') {
            act = '不跳转';
        } else if (b.act === 'LINK') {
            act = '跳转链接';
        } else {
            if (b.payload) {
                act = b.payload.name
            } else {
                act = (SettingUtils.linkActions.find(bn => bn.key === b.act) || {}).name;
            }
        }
        return act;
    };

    return {
        UITypes, UIComponentTypes, linkActions, bannerEdit, coursePicker,
        articlePicker, navEdit,livePicker,decorationPicker,afflatusPicker,
        productPicker, parseAct,putawayPicker,merchantPicker
    }

})();

export default SettingUtils;
