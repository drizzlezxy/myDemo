import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'scss/base.scss';
import 'scss/Test/index.scss';

class MyComponent extends Component {
	
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="m-test">
				Hello World!
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);