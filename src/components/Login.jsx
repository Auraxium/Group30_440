import { useEffect, useRef, useState } from 'react'
import {useNavigate} from "react-router-dom"
import '../styles.css'
import port from '../port.js'
import axios from 'axios'
import $ from "jquery"

export default function Login() {
	const [failed, setFailed] = useState()
	let nav = useNavigate()

	function Submit(event) {
		event.preventDefault()
		setFailed(false)

		let {username, password} = event.target.elements;
		if(!username.value || !password.value) return setFailed('Fill all fields')

		axios.post(port + '/signin', {username: username.value, password: password.value})
		.then(() => nav('/homepage')).catch(err => setFailed(err.response.data || "unknown error"))
	}

	return (
		<div className='container'>
			<form onSubmit={Submit}>
				<h2>Login</h2>
				<label for="username">Username:</label>
				<input type="text" id="username" />
				<label for="password">Password:</label>
				<input type="password" id="password" />

				{failed && <font color="red">{failed}</font>}
				<br/>
				<input type="submit" value="Login" />

				<div>
					<a onClick={() => nav('/signup')}>Dont have an account? Sign Up</a>
				</div>
			</form>
		</div>
	)
}