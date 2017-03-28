import {
  connect
} from 'react-redux'
import {
  setVisibilityFilter
} from 'actions/TodoApp'
import Link from 'components/TodoApp/Link'

const mapStateToProps = (state, ownProps) => {
  let {todoApp} = state;
  return {
    active: ownProps.filter === todoApp.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink