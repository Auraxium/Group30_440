import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles.css'
import port from './port'
import axios from 'axios'

import Login from './components/Login'
import Homepage from './components/Homepage'
import Signup from './components/Signup'

function App() {

	return (
		<Router>
			<Routes>
				<Route path="" exact element={<Login/>} />
				<Route path="/login" element={<Login/>} />
				<Route path="/signup" element={<Signup/>} />
				<Route path="/homepage" element={<Homepage/>} />
			</Routes>
		</Router>
	)
}

export default App
