import {combineReducers} from 'redux';
import todoApp from 'reducers/TodoApp';
import immTodoApp from 'reducers/ImmTodoApp';

const allApp = combineReducers({
	todoApp,
	immTodoApp,
})

export default allApp