import React from 'react'
import Footer from 'components/TodoApp/Footer'
import AddTodo from 'containers/TodoApp/AddTodo'
import VisibleTodoList from 'containers/TodoApp/VisibleTodoList'

const App = () => (
	<div>
	    <AddTodo />
	    <VisibleTodoList />
	    <Footer />
	</div>
)

export default App