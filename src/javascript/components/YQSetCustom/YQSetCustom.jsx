import React, { PropTypes } from 'react';
import './YQSetCustom.scss';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import RedirectUtil from "extend/common/RedirectUtil";
import Logger from "extend/common/Logger";
import shareData from "data/YQData/shareData.json";
import icon from "images/YQGift/icon.png";

class YQSetCustom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"benediction":this.props.benediction || "",
			"strlen":this.props.benediction.length,
            "disabled":this.props.disabled
		}
	}

    static propTypes = {
    	"benediction":React.PropTypes.string,
        "disabled":React.PropTypes.string,
    };

    _handleChange(event) {
        /*
        if(e && e.preventDefault) {  
        　　e.preventDefault();  
        } else {  
        　　window.event.returnValue = false;   
        }  */
        
    	let v = event.target.value.substr(0,30);
        let len = v.length;
    	this.setState({[event.target.name]:v,"strlen":len},() =>{
    		this.props.updateState(v);
    	});
    }

    render() {
    	let that = this;
        let tip;
        
        if(this.state.disabled !="disabled" ) {
            tip = <span className="limit" >{this.state.strlen}/30</span>
        }
    	
        return (
        	<div className="m-custom-text">
	        	<img src={icon} className="logo"/>
	        	<div className="m-conent">
	        		<textarea  autoFocus="true" placeholder={shareData.defaultTitle} name="benediction" value={this.state.benediction} onChange={that._handleChange.bind(that)} disabled={this.state.disabled} />
	        		{tip}
	        	</div>
	      	</div>
        );
    }
}

export default YQSetCustom;