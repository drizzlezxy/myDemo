import {
	SET_VISIBILITY_FILTER,
	SHOW_ALL
} from 'data/actionTypes/actionTypes';

const visibilityFilter = (state = SHOW_ALL, action) => {
	switch (action.type) {
		case SET_VISIBILITY_FILTER:
			return action.visibilityFilter;
		default:
			return state
	}
}

export default visibilityFilter;