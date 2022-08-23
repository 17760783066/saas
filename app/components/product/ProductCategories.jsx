import React, { Component } from 'react';
import { Card, Button, Tree, Divider, Modal, message, Tag } from 'antd';
import { App, CTYPE, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { FileAddOutlined, CaretDownOutlined } from '@ant-design/icons';
import ProductUtils from './ProductUtils';
import '../../assets/css/common/productCategories.scss';


class ProductCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productQo: [],
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({ loading: true });
        App.api('adm/product/categories').then((result) => {
            this.setState({
                productQo: result,
                loading: false
            })
        });

    };
    status = (id, status) => {
        let tip = status === 1 ? "下架" : "上架";
        let _status = status === 1 ? 2 : 1;
       Modal.confirm({
          title: `确认${tip}?`,
          onOk: () => {
            App.api("/adm/product/status_category", { id, status: _status }).then(() => {           
              message.success("操作成功");
              this.loadData();
            });
          },
        });
      };


    renderNode = (item = {}, level) => {

        let { name, icon, priority, id, status } = item;

        return <div className="tree" style={{ width: 600 - (level - 1) * 22.5 }}>
            <div className='level'>{level}</div>
            {level != 2 && < img className="icon" src={icon} />}
            <div className="detail">
                <p>{name}</p >
                <label>
                    权重:{priority}
                    {status == 2 &&<Tag  color="rgb(255, 85, 0)">已下架</Tag>}
                </label>
            </div>
            <div className="opt">
                <a onClick={() => ProductUtils.edit(item, this.loadData)}>编辑</a >
                <Divider type="vertical" />
                <a onClick={() => ProductUtils.edit({ parentId: id, level: level + 1 }, this.loadData)}>新建子分类</a >
                <Divider type="vertical" />
                <a onClick={() => this.status(id,status)}>{Utils.getChangeStatus(status).tag}</a >
            </div>
        </div>
    }


    render() {
        let { productQo = [] } = this.state;

        return (
            <div>
                <BreadcrumbCustom first={CTYPE.link.products.txt} />
                <Card extra={<Button type="primary" icon={<FileAddOutlined />} onClick={() => {
                    ProductUtils.edit({ parentId: 0, level: 1 },this.loadData)
                }}>新建一级分类</Button>}>
                    <div className='product'>
                        <Tree
                            switcherIcon={<CaretDownOutlined />}
                        >{productQo.map((item, index) => {
                            let { children = [] } = item;
                            return <Tree.TreeNode title={this.renderNode(item, 1)} key={index}>
                                {children.map((item, index2) => {
                                    let { children = [] } = item;
                                    return <Tree.TreeNode title={this.renderNode(item, 2)} key={index + ' ' + index2}>
                                        {children.map((item, index3) => {
                                            return <Tree.TreeNode title={this.renderNode(item, 3)} key={index + ' ' + index2 + ' ' + index3} />
                                        })}
                                    </Tree.TreeNode>
                                })}
                            </Tree.TreeNode>
                        })}</Tree>
                    </div>
                </Card>
            </div>
        );
    }
}

export default ProductCategories;