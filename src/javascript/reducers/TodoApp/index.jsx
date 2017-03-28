import {combineReducers} from 'redux';
import {VisibilityFilters} from 'actionTypes/TodoApp';
import todos from './todo';
import visibilityFilter from './visibilityFilter';


const todoApp = combineReducers({
	visibilityFilter,
	todos
})

export default todoApp