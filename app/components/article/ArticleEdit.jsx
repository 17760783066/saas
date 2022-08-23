import { type } from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SaveOutlined } from '_@ant-design_icons@4.7.0@@ant-design/icons';
import { Button, Card, InputNumber, message, Space, Input, Switch, Select } from 'antd';
import FormItem from '_antd@4.19.2@antd/lib/form/FormItem';
import { App, CTYPE, U } from '../../common';
import HtmlEditor from '../../common/HtmlEditor';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { PosterEdit } from '../common/CommonEdit';

class ArticleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            article: {}
        }
    }
    componentDidMount() {
        let { id } = this.state;
        if (id !== 0) {
            App.api('adm/article/article', { id }).then((article) => {
                this.setState({ article });
            })

        }
    }

    handleSubmit = () => {
        let { article = {} } = this.state;
        let { title, cover,type } = article;
        if (U.str.isEmpty(title)) {
            message.warn('请添加商户名称');
            return
        } else if (title.length > 10) {
            message.warn('名称长度不能超过10');
            return
        } else if (U.str.isEmpty(cover)) {
            message.warn('请添加封面图');
            return
        } 
        if (U.str.isEmpty(type)) {
            message.warn('请选择类型');
            return
        }{
            this.setState({ loading: true });
            App.api('adm/article/save', { article: JSON.stringify(article) }).then(() => {
                message.success('保存成功');
                this.setState({ loading: false });
                setTimeout(() => {
                    App.go('/app/article/articles');
                }, 500);
            }, () => this.setState({ loading: false }));
        }
    };
    onChange = value => {
        let { article = {} } = this.state;
        this.setState({
            article: ({
                ...article,
                productCategorySequence: value
            })
        });
    }
    render() {
        let { article = {} } = this.state;
        let { title, cover, descr, pv, likeNum, collectNum, status, content, type } = article;

        return (
            <div className='common-edit-page'>
                <BreadcrumbCustom
                    first={<Link to={CTYPE.link.article.path}>{CTYPE.link.article.txt}</Link>}
                    second='新建文章' />
                <Card
                    extra={<Button type='primary' icon={<SaveOutlined />} onClick={() => {
                        this.handleSubmit()
                    }}
                    >保存</Button>}>

                    <FormItem {...CTYPE.formItemLayout} required={true} label='文章标题'>
                        <Input value={title} placeholder='请输入名称,最多十个字' maxLength={10} style={{ width: '700px' }}
                            onChange={(e) => {
                                this.setState({
                                    article: {
                                        ...article,
                                        title: e.target.value
                                    }
                                })
                            }}
                        />
                    </FormItem>
                    <FormItem {...CTYPE.formItemLayout} required={true} label='文章简介'>
                        <Input value={descr} placeholder='请输入简介' maxLength={10} style={{ width: '700px', height: '200px' }}
                            onChange={(e) => {
                                this.setState({
                                    article: {
                                        ...article,
                                        descr: e.target.value
                                    }
                                })
                            }}
                        />
                    </FormItem>
                    <PosterEdit title='Logo' required={true} type='s' scale={'800*800'} img={cover} syncPoster={(url) => {
                        article.cover = url;
                        this.setState({
                            article
                        });
                    }} />
                    <FormItem {...CTYPE.formItemLayout} required={false} label='权重'>
                        <Space>
                            <InputNumber
                                min={1}
                                value={pv}
                                onChange={(v) => {
                                    this.setState({
                                        article: {
                                            ...article,
                                            pv: v
                                        }
                                    })
                                }}
                            />
                        </Space>
                    </FormItem>
                    <FormItem {...CTYPE.formItemLayout} required={false} label='点赞量'>
                        <Space>
                            <InputNumber
                                min={1}
                                value={likeNum}
                                onChange={(v) => {
                                    this.setState({
                                        article: {
                                            ...article,
                                            likeNum: v
                                        }
                                    })
                                }}
                            />
                        </Space>
                    </FormItem>
                    <FormItem {...CTYPE.formItemLayout} required={false} label='收藏量'>
                        <Space>
                            <InputNumber
                                min={1}
                                value={collectNum}
                                onChange={(v) => {
                                    this.setState({
                                        article: {
                                            ...article,
                                            collectNum: v
                                        }
                                    })
                                }}
                            />
                        </Space>
                    </FormItem>
                    <FormItem
                        required={false}
                        {...CTYPE.formItemLayout} label='上架'>
                        <Switch checked={status === 1} onChange={(chk) => {
                            this.setState({
                                article: {
                                    ...article,
                                    status: chk ? 1 : 2
                                }
                            })
                        }} />
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='类型'>
                        <Select style={{ width: 300 }}
                            value={type}
                            onChange={(type) => {
                                this.setState({
                                    article: {
                                        ...article,
                                        type
                                    }
                                })
                            }}>
                            <Option value='1' key={1}>推荐案例</Option>
                            <Option value='2' key={2}>装修技巧</Option>
                        </Select>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="文章内容">
                        <HtmlEditor content={content} syncContent={(content) => {
                            this.setState({
                                article: {
                                    ...article,
                                    content
                                }
                            })
                        }} />
                    </FormItem>
                </Card>
            </div>
        );
    }
}

export default ArticleEdit;