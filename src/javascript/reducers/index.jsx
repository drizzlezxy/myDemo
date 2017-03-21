import {
	VisibilityFilters
} from 'actionTypes/actionTypes';

import todos from 'reducers/todo';
import visibilityFilter from 'reducers/visibilityFilter';

import {
	combineReducers
} from 'redux';

const todoApp = combineReducers({
	visibilityFilter,
	todos
})

export default todoApp