import UNIT_TYPES from './unitTypes.json';
import DividerUnit from './DividerUnit';


/**
 * 所有的单元类型工厂，由它来组装数据，生产所有的单元
 */
export default class UnitFactory {

	static create(unitId) {
		switch (unitId) {
			case UNIT_TYPES.DividerUnit$NO_NEED:
				return new DividerUnit();
				break;
			default:
				break;
		}

		return null;
	}
}