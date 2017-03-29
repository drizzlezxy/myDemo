import { connect } from 'react-redux'
import Imm from 'immutable'
import { toggleTodo } from 'actions/ImmTodoApp'
import TodoList from 'components/ImmTodoApp/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  let {immTodoApp} = state;
  return {
    todos: getVisibleTodos(immTodoApp.get('todos').toJS(), immTodoApp.get('visibilityFilter'))
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList