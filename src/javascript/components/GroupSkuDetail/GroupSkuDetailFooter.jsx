import React, {Component} from 'react';
import Footer from 'components/Footer/Footer';
import './GroupSkuDetailFooter.scss';


export default
class GroupSkuDetailFooter extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {

		return (
			<footer className="m-groupskudetailfooter">
				<Footer />
			</footer>
		)
	}
}