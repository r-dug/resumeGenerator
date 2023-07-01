import React, { useState, useContext } from 'react'
import { UserContext } from './UserContext'
import { useNavigate } from "react-router-dom"
import io from 'socket.io-client'
// we will want to create a config file to the actual socket connection url upon launch


const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost'
  const SOCK_URL = process.env.REACT_APP_SOCK_URL || 'WSS://localhost'
  const socket = io(`${SOCK_URL}:8002`)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)
  
  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)
  const loginAttempt = async (script, valueupdate) => {
    const options = {
    method: "POST",
    body: JSON.stringify({
        username: username,
        password: password
    }),
    headers:{
        "Content-Type": "application/json"
    }
    }
    try{
      console.log(API_URL)
    const response = await fetch(`${API_URL}:8000/login`, options)
    const data = await response.json()
    console.log(data)
    if (data.message === "Login Successful") {
      setUser(data.user)
      socket.emit('login', data.user)
      navigate('/main')
    }
    return data
    } catch(error){
    console.error(error)
    }
}
  const handleSubmit = (event) => {
    event.preventDefault()
    loginAttempt()

  }
  return (
    <form className='login' onSubmit={handleSubmit}>
      <label className='uName'>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label className='pWord'>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <input type="submit" value="Log In" />
    </form>
  )
}
export default Login