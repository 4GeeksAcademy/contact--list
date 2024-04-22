import React, { useEffect, useState } from "react";
import TaskList from './taskList';
import { string } from "prop-types";

const Home = () =>{

	const [users, setUsers] = useState([]);
	const [tasks, setTasks] = useState([]);

	function PrintUsers() {
		console.log('total users, supposedly in order:');
		for(let i=0;i<users.length;i++){
			console.log(users[i].name);
		}
	}

	function PrintTasks() {
		console.log('printing tasks');
		for(let i = 0; i < tasks.length; i++){
			for (let j=0; j < tasks[i].length; j++) {
				console.log(users[i].name + "'s task " + j + ': ' + tasks[i][j]);
			}
		}
	}

	function FetchUsers() {
		fetch('https://playground.4geeks.com/todo/users/', {
		method: "GET",
		})
		.then((response) => response.json())
		.then((json) => {
		console.log(json);
		console.log(json.users);
		setUsers(json.users);
		})
		.catch(error => {
			console.error(error);
		});
	}

	async function FetchTasks() {
		console.log('FetchTasks() was called')
		console.log('users.length: ' + users.length);
		let userName = '';
		let task = '';
		let arrayOfArrays = [];
		async function fetchTasksForUser(userIndex) {
			const user = users[userIndex];
			const response = await fetch('https://playground.4geeks.com/todo/users/' + user.name);
			const json = await response.json();
			
			userName = user.name;
			console.log("user: " + userName + '. ' + userName + "'s tasks amount: " + json.todos.length);
			let array = [];
			for(let j=0; j < json.todos.length; j++){
				task = json.todos[j].label;
				console.log(json.name + "'s task " + j + ': ' + task);
				array.push(task);
			}
			arrayOfArrays.push(array);
			
			if (userIndex < users.length - 1) {
				await fetchTasksForUser(userIndex + 1); // Fetch tasks for the next user
			} else {
				setTasks(arrayOfArrays); // If all tasks are fetched, update tasks
			}
		}
		
		if (users.length > 0) {
			await fetchTasksForUser(0); // Start fetching tasks for the first user
		}
		
	}

	useEffect(() => {
		FetchUsers();
	}, [])

	useEffect(() => {
		if (users.length > 0){
			PrintUsers();
			FetchTasks();
		}
	}, [users]);

	useEffect(() => {
		if (tasks.length > 0) {
			PrintTasks();
		}
	}, [tasks]);

	return (
		<div className='full-page'>
			<p className='title'>todos</p>
			{users.map((user, index) => (
				<TaskList key={index} user={user} tasksFromFetch={tasks[index]}/>
			))}
			<button onClick={FetchUsers}>Fetch</button>
		</div>
	) 
}

export default Home;
