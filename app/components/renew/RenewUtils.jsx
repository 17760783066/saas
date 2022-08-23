import React, { Component } from 'react';
import { Utils } from "../../common";
import OptionStatus from './OptionStatus';


let RenewUtils = (() => {
    let option = (renewId, loadData) => {
        Utils.common.renderReactDOM(<OptionStatus renewId={renewId} loadData={loadData} />);
    };
   
    return {
        option
    }

})();

export default RenewUtils;