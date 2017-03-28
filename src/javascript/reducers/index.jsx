import {combineReducers} from 'redux';
import todoApp from 'reducers/TodoApp';

const allApp = combineReducers({
	todoApp,
})

export default allApp