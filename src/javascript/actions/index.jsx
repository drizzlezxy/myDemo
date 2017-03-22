import {
	ADD_TODO,
	TOGGLE_TODO,
	SET_VISIBILITY_FILTER
} from 'data/actionTypes/actionTypes';

/*
 * action 创建函数
 */

function doAddTodo(text) {
	return {
		type: ADD_TODO,
		text
	}
}

export function addTodo(text) {
	return dispatch => dispatch(doAddTodo(text))
}

function doToggleTodo(index) {
	return {
		type: TOGGLE_TODO,
		index
	}
}

export function toggleTodo(index) {
	return dispatch => dispatch(doToggleTodo(index))
}

function doSetVisibilityFilter(filter) {
	return {
		type: SET_VISIBILITY_FILTER,
		filter
	}
}

export function setVisibilityFilter(filter) {
	return dispatch => {
		confirm('您希望选择'+filter+'部分内容显示么？') && dispatch(doSetVisibilityFilter(filter));
	}
}