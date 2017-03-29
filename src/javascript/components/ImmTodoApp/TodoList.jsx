import React, {
  Component,
  PropTypes
} from 'react'
import Todo from 'components/ImmTodoApp/Todo'

export default class TodoList extends Component {
  render() {
    let items = this.props.todos.map((todo, index) =>{
      return <Todo {...todo}
            key={index}
            onClick={() => this.props.onTodoClick(index)} />
    })
    return (
      <ul>
        {items}
      </ul>
    )
  }
}

TodoList.propTypes = {
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
}