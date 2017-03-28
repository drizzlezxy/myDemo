import {
	VisibilityFilters
}from 'actionTypes/TodoApp';

export const initialState = {
	todoApp: {
		visibilityFilter: VisibilityFilters.SHOW_ALL,
		todos: [{
			text: '初始化任务1',
			completed: false,
		}, {
			text: '初始化任务2',
			completed: true,
		}],
	}
}