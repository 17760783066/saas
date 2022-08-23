import { Card, Col, Row, Statistic, Button } from 'antd';
import React from 'react';
import '../../assets/css/home/home.scss';
import { App, CTYPE, Utils } from '../../common';
import BreadcrumbCustom from '../BreadcrumbCustom';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }
    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        App.api('adm/merchant/validThru', {
            day: 30
        }).then((count) => {
            this.setState({
                count
            });
        });
    }
    skip = () => {
        App.go(`/app/merchant/list/30`)
    }

    render() {
        let { count, } = this.state;
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom />
                <Card>
                    <div className='home-page'>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic title="店铺即将过期" precision={0} value={count} />
                                <Button style={{ marginTop: 16 }} type="primary"
                                    onClick={() => {
                                        this.skip()
                                    }}>
                                    前往处理
                                </Button>
                            </Col>
                        </Row>

                    </div>
                </Card>

            </div>
        );
    }
}

export default Dashboard;
