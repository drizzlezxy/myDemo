import {
	ADD_TODO,
	TOGGLE_TODO,
	SET_VISIBILITY_FILTER
} from 'data/actionTypes/actionTypes';

let nextTodoId = 0;

export const addTodo = (text) => {
	return {
		tpye: ADD_TODO,
		id: nextTodoId++,
		text,
	}
}

export const toggleTodo = (id) => {
	return {
		tpye: TOGGLE_TODO,
		id
	}
}

export const setVisibilityFilter = (filter) => {
	return {
		tpye: SET_VISIBILITY_FILTER,
		filter,
	}
}