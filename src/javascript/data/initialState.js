import {
	VisibilityFilters
} from 'actionTypes/TodoApp';
import {
	fromJS,
} from 'immutable';

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
	},
	immTodoApp: fromJS({
		visibilityFilter: VisibilityFilters.SHOW_ALL,
		todos: [{
			text: '初始化任务1',
			completed: false,
		}, {
			text: '初始化任务2',
			completed: true,
		}],
	})
}