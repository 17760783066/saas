import React, { Component } from 'react';
import { Utils } from '../../common';
import AdmAdd from './AdmAdd';
import Message from './Message';
import MerchantAdmin from './MerchantAdmin';
import Password from './Password';
import Duration from './Duration'



let MerchantUtils = (() => {

    let message = (merchantId, loadData) => {
        Utils.common.renderReactDOM(<Message merchantId={merchantId} loadData={loadData} />);
    };

    let admAdd = (merchant) => {
        Utils.common.renderReactDOM(<AdmAdd merchant={merchant} />)
    }

    let merchantAdm = (merchantAdminId) => {
        Utils.common.renderReactDOM(<MerchantAdmin merchantAdminId={merchantAdminId} />)
    }
    let password = (merchantAdmin) => {
        Utils.common.renderReactDOM(<Password merchantAdmin={merchantAdmin} />)
    }
    let duration = (merchantId) => {
        Utils.common.renderReactDOM(<Duration merchantId={merchantId} />)

    }
    return {
        message, admAdd, merchantAdm, password, duration
    }

})();

export default MerchantUtils;