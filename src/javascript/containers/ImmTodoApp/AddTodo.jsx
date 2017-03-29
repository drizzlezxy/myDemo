import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from 'actions/ImmTodoApp'

let AddTodo = ({ dispatch }) => {
	let inputNode;
	let handleSubmit = (e) => {
		e.preventDefault();

		let value = inputNode.value;

		if(!value.trim()) {
			return;
		}

		dispatch(addTodo(value));
		inputNode.value = '';
	}
	return (
		<form onSubmit = {handleSubmit}>
			<input ref = {thisNode => inputNode = thisNode}/>
			<button type = "submit">添加任务</button>		
		</form>
	)
}

AddTodo =  connect()(AddTodo)
export default AddTodo