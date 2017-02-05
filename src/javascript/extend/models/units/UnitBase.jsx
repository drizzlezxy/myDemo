export default class UnitBase {
	_assemble() {
		throw new Error('Implement this _assemble method in this descendants');
	}

	_doRender() {
		throw new Error('Implement this _doRender method in this descendants');
	}
}