import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import AdminEdit from './components/admin/AdminEdit';
import MerchantEdit from './components/merchant/MerchantEdit';

import Admins from './components/admin/Admins';

import MerchantList from './components/merchant/MerchantList';
import RoleEdit from './components/admin/RoleEdit';
import Roles from './components/admin/Roles';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Page from './components/Page';
import Index from './Index';
import Renew from './components/renew/Renew';
import ProductCategories from './components/product/ProductCategories';
import ProductTemplates from './components/product/ProductTemplates';
import ProductAdd from './components/product/ProductAdd';
import Brands from './components/product/Brands';
import BrandsEdit from './components/product/BrandsEdit';
import Setting from './components/setting/Setting';
import UiEdit from './components/setting/UiEdit';
import Article from './components/article/Article';
import ArticleEdit from './components/article/ArticleEdit';
import Afflatus from './components/setting/Afflatus';
import AfflatueEdit from './components/setting/AfflatueEdit';
import Three from './components/Three'
const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        <Redirect exact from='/' to='/app/dashboard/index' />

                        <Route path='/' exact component={Index} />

                        <Route path='/login' exact component={Login} />

                        <Route path='/app' children={() => (
                            <Index>

                                <Route path='/app/dashboard/index' component={Dashboard} />

                                <Route path={'/app/admin/admins'} component={Admins} />
                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit} />
                                <Route path={'/app/admin/roles'} component={Roles} />
                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit} />
                                <Route path={'/app/merchant/list/:expireDay'} component={MerchantList} />
                                <Route path={'/app/merchant/merchant-edit/:id'} component={MerchantEdit} />
                                <Route path={'/app/renew/renews'} component={Renew} />
                                <Route path={'/app/product/product-categories'} component={ProductCategories} />
                                <Route path={'/app/product/product-templates'} component={ProductTemplates} />
                                <Route path={'/app/product/product-edit/:id'} component={ProductAdd} />
                                <Route path={'/app/product/brands'} component={Brands} />
                                <Route path={'/app/product/brands-edit/:id'} component={BrandsEdit} />
                                <Route path={'/app/setting/uis'} component={Setting} />
                                <Route path={'/app/setting/ui-edit/:id'} component={UiEdit} />
                                <Route path={'/app/article/articles'} component={Article} />
                                <Route path={'/app/article/article-edit/:id'} component={ArticleEdit} />
                                <Route path={'/app/artisanCaseImg/artisanCaseImg'} component={Afflatus} />
                                <Route path={'/app/artisanCaseImg/edit/:id'} component={AfflatueEdit} />
                                <Route path={'/app/three/three'} component={Three} />

                            </Index>
                        )} />
                    </Switch>
                </Page>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);


export default routes;
