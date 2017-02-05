let refTargetTypes = {
    NO_NEED: 0,
    WHOLE_UNIT: 1,
    SINGLE_PIC: 2,
    ICON_BEFORE_TEXT: 3,
    SINGLE_ITEM_PIC: 4,
};

let units = [
	{
		unitId: 100,
		unitName: '间距分隔单元',
		dataStructure: 'DividerUnit',
		refTarget: refTargetTypes.NO_NEED,
	},
	{
		unitId: 101,
		unitName: '图文单元：多图轮播',
		dataStructure: 'SingleImageUnit',
		refTarget: refTargetTypes.WHOLE_UNIT,
	},
	{
		unitId: 102,
		unitName: '单列2图',
		dataStructure: 'SingleImageUnit',
		refTarget: refTargetTypes.SINGLE_ITEM_PIC,
	},
	{
		unitId: 103,
		unitName: '单列3图',
		dataStructure: 'SingleImageUnit',
		refTarget: refTargetTypes.SINGLE_ITEM_PIC,
	},
	{
		unitId: 104,
		unitName: '3图混排',
		dataStructure: 'SingleImageUnit',
		refTarget: refTargetTypes.WHOLE_UNIT,
	},
	{
		unitId: 105,
		unitName: '单列4图',
		dataStructure: 'SingleImageUnit',
		refTarget: refTargetTypes.SINGLE_PIC,
	},
	{
		unitId: 106,
		unitName: '5图混排',
		dataStructure: 'SingleImageUnit',
		refTarget: refTargetTypes.WHOLE_UNIT,
	},
	{
		unitId: 107,
		unitName: '多图文横滑',
		dataStructure: 'ImageTextUnlimitUnit',
		refTarget: refTargetTypes.SINGLE_PIC,
	},
	{
		unitId: 108,
		unitName: '滚动文本',
		dataStructure: 'ScrollTextUnit',
		refTarget: refTargetTypes.ICON_BEFORE_TEXT,
	},
	{
		unitId: 109,
		unitName: '单一纯文本',
		dataStructure: 'SingleTextUnit',
		refTarget: refTargetTypes.NO_NEED,
	},
	{
		unitId: 201,
		unitName: '商品单元：单列2商品',
		dataStructure: 'PrdtUnit',
		refTarget: refTargetTypes.SINGLE_ITEM_PIC,
	},
	{
		unitId: 202,
		unitName: '多商品横滑',
		dataStructure: 'PrdtUnlimitUnit',
		refTarget: refTargetTypes.SINGLE_ITEM_PIC,
	},
];

module.exports = units;
