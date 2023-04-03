import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import '../styles.css'
import port from '../port.js'
import axios from 'axios'
import $ from "jquery"

export default function Signup() {
	const [failed, setFailed] = useState()
	let nav = useNavigate()

	function Submit(event) {
		event.preventDefault()
		setFailed(false)

		let {username, password, confirm, firstname, lastname, email} = event.target.elements;

		for (const [key, value] of Object.entries({username, password, confirm, firstname, lastname, email}))
			if(!value.value) return setFailed("Fill all fields")
		
		if (password.value !== confirm.value)
			return setFailed('Passwords do not match')

		axios.post(port + '/signup', { username: username.value, password: password.value, firstname: firstname.value, lastname: lastname.value, email: email.value })
			.then(() => nav('/login')).catch(err => {
				console.log(err)
				setFailed(err.response && err.response.data || "unknown error")
			})
	}

	return (
		<div className='container'>
			<form onSubmit={Submit}>
				<h2>Sign up</h2>

				<label for="username">Username:</label>
				<input type="text" name="username" id="username" />

				<label for="password">Password:</label>
				<input id="password" type="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*?[#?!@$%^&*-\]\[]).{8,}"
					title="The password must bx 8 characters, at least one letter, one number, and one special character." /><br /><br />

				<label for="confirm">Confirm Password:</label>
				<input type="password" id="confirm" name="confirm" pattern="(?=.*\d)(?=.*[a-z])(?=.*?[#?!@$%^&*-\]\[]).{8,}"
					title="The password must be 8 characters, at least one letter, one number, and one special character." /><br />

				<p style={{ color: 'red' }}>The password must be 8 characters, at least one letter, one number, and one special
					character.</p>

				<label for="firstName">First Name:</label>
				<input type="text" name="firstName" id='firstname' /><br /><br />

				<label for="lastName">Last Name:</label>
				<input type="text" name="lastName" id='lastname' /><br />

				<label for="email">email:</label>
				<input type="text" name="email" /><br />

				{failed && <font color="red">{failed}</font>}
				<br />
				<br />

				<input type="submit" value="Sign Up" /><br /><br />

				<a onClick={() => nav('/login')}>Already have an account? Log in</a><br /><br />

			</form>
		</div>
	)
}