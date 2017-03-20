import {
	connect
} from 'react-redux';

import {
	toggleTodo
} from 'actions/index.js';

import {
	SHOW_ALL,
	SHOW_COMPLETED,
	SHOW_ACTIVE
} from 'data/actionTypes/actionTypes';

import TodoList from 'components/TodoList/TodoList'

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case SHOW_ALL:
			return todos;
		case SHOW_COMPLETED:
			return todos.filter(t => t.completed)
		case SHOW_ACTIVE:
			return todos.filter(t => !t.completed)
	}
}

const mapStateToProps = (state) => {
	return {
		todos: getVisibleTodos(state.todos, state.VisibilityFilter)
	}
}

const mapDispatchToProps = (dispatch) => {
	return onTodoClick: (id) => {
		dispatch(toggleTodo(id))
	}
}

const VisibleTodoList = connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList);

export default VisibleTodoList;