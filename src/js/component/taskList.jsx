import React, { useEffect, useState } from 'react';

const initialTaskList = [];

const TaskList = ({user, tasksFromFetch}) =>{

	const [input, setInput] = useState('');
	const [taskList, setTaskList] = useState([...initialTaskList]);
	const [isHovered, setIsHovered] = useState(null);

	useEffect(() => {
		if(tasksFromFetch){
			setTaskList([...tasksFromFetch]);
		}
	},[tasksFromFetch]);

	function PostNewTask(){
		fetch('https://playground.4geeks.com/todo/todos/' + user.name, {
		method: "POST",
		headers: {
			'accept': 'application/json',
			'content-type': 'application/json'
		  },
		  body: JSON.stringify({
			'label': input,
			'is_done': false
		  })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Failed to add new task');
			}
		})
		.catch(error => {
			console.error(error);
		});
	}

	const addTask = () => {
		if (input.trim()) {
			setTaskList([...taskList, input]);
			PostNewTask();
			setInput('');
		}
	};

	const deleteTask = (index) => {
		const newTaskList = [...taskList];
		newTaskList.splice(index, 1);
		setTaskList(newTaskList);
	}

	const handleKeyPress = (e) =>{
		if (e.keyCode === 13){
			addTask();
		}
	}

	 return (
		<div className='full-component'>
			<div className='to-do-list'>
				<div className='list-header'>
					<p>{user.name}</p>
				</div>
				<div className='input-container'>
					<input className='input' type='text' placeholder='Add task here' onKeyDown={handleKeyPress} onChange={(e) => setInput(e.target.value)}/>
					<button className='add-button' onClick={addTask}>✔</button>
				</div>
				<div>
					{(taskList.length === 0) ? <div className='no-tasks'><p>No tasks. Add a task.</p></div> : <></>}
					<ul className='list'>
						{taskList.map((task, index) => (
							<li className='list-item'
								key={index}>
								<div className='list-item-div' onMouseEnter={() => setIsHovered(index)} onMouseLeave={() => setIsHovered(null)}>
									<span><p className='task'>{task}</p></span>
									<button 
										className={isHovered == index ? 'delete-button-active' : 'delete-button-hidden'}
										onClick={() => deleteTask(index)}
										>
										✖
									</button>
								</div>
							</li>
						))}
					</ul>
					{(taskList.length == 0) ? 
					<></> 
					: 
					(taskList.length == 1) ? 
					<div className='tasks-left'> 
						<p>{taskList.length} item left.</p>
					</div> 
					: 
					<div className='tasks-left'>
						<p>{taskList.length} items left.</p>
					</div>}
				</div>
			</div>
			<div className='extra-pages'>
				<div className='second-page'></div>
				<div className='third-page'></div>
			</div>
			<br></br>
		</div>
	) 
}

export default TaskList;