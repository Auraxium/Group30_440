import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import port from '../port.js'
import axios from 'axios'

export default function Homepage() {
	const [message, setMessage] = useState()
	const [credential, setCredential] = useState()
	let nav = useNavigate()

	useEffect(() => {
		axios.post(port + '/signin', JSON.parse(localStorage.getItem("login")))
		.then(() => setCredential(true))
		.catch(() => nav('/login'))
	}, [])

	function Reinitialize() {
		axios.get(port + '/reinit').then(res => setMessage("Database Reinitialized"))
	}

	return (
		<>
			{credential && 
			<div>
				<a onClick={() => {
					localStorage.removeItem("login")
					nav('/login');
				}}>Logout</a>
				<h2>Home Page</h2>
				<br /><br />

				<button onClick={Reinitialize}>Initialize Database</button><br />
				{message && <font color='green'>{message}</font>}
			</div>}
		</>
	)
}