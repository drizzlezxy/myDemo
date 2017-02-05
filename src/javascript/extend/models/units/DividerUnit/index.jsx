import React from 'react';
import Util from 'extend/common/util';
import UnitBase from 'extend/models/units/UnitBase';
import './index.scss';

export default class DividerUnit extends UnitBase {

	_assemble(model) {
		let marginRem = Util.px2rem(parseFloat(model.data.margin));
		let styleObj = {
			height:  `${marginRem}rem`,
		};

		return this._doRender({
			uuid: Util.uuid(),
			styleObj: styleObj,
		});
	}


	_doRender(options) {
		let {
			uuid,
			styleObj,
		} = options;

		return (
			<div id={uuid} className="m-unit-container">
				<div style={styleObj}></div>
			</div>
		)
	}
}