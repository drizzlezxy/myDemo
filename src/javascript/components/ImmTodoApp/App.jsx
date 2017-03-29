import React from 'react'
import Footer from 'components/ImmTodoApp/Footer'
import AddTodo from 'containers/ImmTodoApp/AddTodo'
import VisibleTodoList from 'containers/ImmTodoApp/VisibleTodoList'

const App = () => (
	<div>
		<h2>Immutable-App</h2>
	    <AddTodo/>
	    <VisibleTodoList />
	    <Footer/>
	</div>
)

export default App