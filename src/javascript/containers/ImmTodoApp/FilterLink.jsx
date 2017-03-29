import React from 'react'
import {connect} from 'react-redux'

import Link from 'components/ImmTodoApp/Link'
import {setVisibilityFilter} from 'actions/ImmTodoApp'

const mapStateToProps = ({immTodoApp}, ownProps) => {
	return {
		active: immTodoApp.visibilityFilter === ownProps.filter
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		handleTabClick: () => {
			dispatch(setVisibilityFilter(ownProps.filter))
		}
	}
}

const FilterLink = connect(
	mapStateToProps,
	mapDispatchToProps
)(Link)

export default FilterLink