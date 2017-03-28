import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import UrlUtil from "extend/common/UrlUtil";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import 'scss/base.scss';
import 'scss/Test/index.scss';

import Immu, {Map} from 'immutable'

class MyComponent extends Component {
	constructor (props) {
		super(props);
	}

	render () {
		const map1 = Map( {a: 1, b: 2, c: 3 })
		console.log('map1:', map1)

		const map2 = map1.set('b', 2)
		console.log('map1', map1)
		console.log('map2', map2)
		console.log('map1.equals(map2) === true', map1.equals(map2) === true)


		const map3 = map1.set('b', 50)
		console.log('map1', map1)
		console.log('map3', map3)
		console.log('map1.equals(map3) === false', map1.equals(map3) === false)
		return (
			<div className="m-test">
				<div className="m-header"></div>
				<div className="m-body">
					test Component to implement
				</div>
				<div className="m-footer"></div>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);