import UnitFactory from './units/UnitFactory';

export default class UnitBuilder {
	
	batchAssemble(unitGroupList) {
		let renderedUnitList = [];

		renderedUnitList = unitGroupList.map(function(unitVO, index) {
			let unit = UnitFactory.create(unitVO.unitId);
			let renderedUnit = unit._assemble(unitVO);
			return renderedUnit;
		});

		return renderedUnitList;
	}
}