export default class Hook {
	static hookAndAddPrefix(items, strategy) {
		return Hook._hookStretagy(items, strategy);
	}

	static _hookStretagy(items, stra) {
		let stretagy = {
			'navItems': function (items) {
				let PREFIX = '../../../../res/images/CalendarNav/';
				return items.map(function(item, index) {
					let swipeItems = item.swipeItems;
					swipeItems.map(function(swipe, idx) {
						swipe.image = PREFIX + swipe.image;
						return swipe;
					});
					return item;
				});
			}
		};

		return stretagy[stra](items);
	}
}