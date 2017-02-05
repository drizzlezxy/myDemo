import Util from 'extend/common/util';

export default class Logger {
	static level = 0;

	static setLevel(level) {
		Logger.level = level;
	}

	static log(...args) {
		if (!Util.isExisty(console) || !Util.isExisty(console.log)) return;
		
		console.log(`log =============> ${new Date().getTime()} <=================`);
		switch(Logger.level) {
			case 0:
				console.log.apply(console, args);
				break;
			case 1:
				console.warn.apply(console, args);
				break;
			case 2:
				console.error.apply(console, args);
				break;
		}
	}

	static warn(...args) {
		if (!Util.isExisty(console) || !Util.isExisty(console.warn)) return;
		console.warn.apply(console, args);
	}

	static error(...args) {
		if (!Util.isExisty(console) || !Util.isExisty(console.error)) return;
		console.error.apply(console, args);
	}
}