import {
	ADD_TODO,
	TOGGLE_TODO,
} from 'actionTypes/TodoApp';
import {List, Map} from 'immutable';

function todos(state = List([]), action) {
	switch (action.type) {
		case ADD_TODO:
			return state.push(
				Map({
					text: action.text,
					completed: false
				})
			);
		case TOGGLE_TODO:
			return state.map((todo, index) => {
				if(index === action.index) {
					return todo.update('completed', value => !value)
				}
				return todo
			});
		default:
			return state
	}
}


export default todos;