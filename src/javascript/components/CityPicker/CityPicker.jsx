import React, {Component} from 'react';
import Util from "extend/common/util";
import { CityPicker } from 'react-pickers';
import 'react-pickers/lib/css/picker.css';

import city3 from './addrJson.json'

export default class MyCityPicker extends Component{
    constructor(props) {
    	super(props);

    	// let info = this.props.info;
    	this.state = {
	        showCity3Picker: false,
	        city3: city3.list
    	}
  	}

    componentWillReceiveProps(props) {
        if(Util.isExisty(props.isShow) && props.isShow == true) {
            this.showCity3Picker();
        }
    }

    showCity3Picker(){
        this.setState({showCity3Picker: true })
    }

    hideCity3Picker(){
        this.setState({
            showCity3Picker: false
        },()=>{
            this.props.hide();
        })
    }

    getData3(ret){
        this.props.exportData(ret);
        // console.log("你选择的城市是:" + (ret[0] || {}).text + (ret[0] || {}).code + " " + (ret[1] || {}).text + " " + (ret[2] || {}).text);
    }

    render(){
        return (
            <CityPicker visible={ this.state.showCity3Picker } layer='3' setData={this.state.city3} getData={ this::this.getData3 } confirm={ this::this.hideCity3Picker } cancel={ this::this.hideCity3Picker } />
        )
    }
}
