import React, { Component } from 'react';
import { Tag } from 'antd';
import { Utils } from '../../common';
import ProductEdit from './ProductEdit';
import Specs from './Specs';

let ProductUtils = (() => {
    let edit = (item, loadData) => {
        Utils.common.renderReactDOM(<ProductEdit item={item} loadData={loadData} />);
    };
    let drawer = (productTemplateId) => {
        Utils.common.renderReactDOM(<Specs productTemplateId={productTemplateId} />);
    };
    let renderCateTags = (cateId, cates = []) => {

        return <React.Fragment>
            {cates.map((item1, index) => {
                let { children = [] } = item1;
                return <React.Fragment key={index}>
                    {children.map((item2, index2) => {
                        let { children = [] } = item2;
                        return <React.Fragment key={index2}>
                            {children.map((item3, index3) => {

                                if (item3.id == cateId) {
                                    return <React.Fragment key={index3}>
                                        <Tag color={item1.status == 1 ? 'blue' : item1.status == 2 ? 'orange' : item1.status == 3 ? 'red' : ''}>{item1.name}</Tag>
                                        <Tag color={item2.status == 1 ? 'blue' : item2.status == 2 ? 'orange' : item2.status == 3 ? 'red' : ''}>{item2.name}</Tag>
                                        <Tag color={item3.status == 1 ? 'blue' : item3.status == 2 ? 'orange' : item3.status == 3 ? 'red' : ''}>{item3.name}</Tag>
                                    </React.Fragment>
                                }

                            })}
                        </React.Fragment>
                    })}
                </React.Fragment>
            })}
        </React.Fragment>

    }
    let brandCategory = (productCategorySequences = [], categories = []) => {

        let arr = [];

        categories.map((item1, index1) => {

            let p2 = [];
            if (productCategorySequences.indexOf(item1.sequence) > -1) {
                p2.push(<Tag key={index1}>{item1.name}</Tag>)
            } else {
                let { children = [] } = item1;
                children.map((item2, index2) => {
                    if (productCategorySequences.indexOf(item2.sequence) > -1) {
                        p2.push(<Tag key={index2}>{item1.name} &gt; {item2.name}</Tag>)
                    } else {
                        let { children = [] } = item2;
                        children.map((item3, index3) => {
                            if (productCategorySequences.indexOf(item3.sequence) > -1) {
                                p2.push(<Tag key={index3}>{item1.name} &gt; {item2.name} &gt; {item3.name}</Tag>);
                            }
                        })
                    }
                })
            }
            p2.length > 0 && arr.push(p2);
        })

        return arr;

    }
    return {
        edit, drawer, renderCateTags, brandCategory
    }
})();

export default ProductUtils;