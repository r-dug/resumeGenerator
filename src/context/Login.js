import React, { useState, useContext } from 'react'
import { UserContext } from './UserContext'
import { useNavigate } from "react-router-dom"
import io from 'socket.io-client';

const Login = () => {
  const socket = io('http://localhost:8002');
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext);
  
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const loginAttempt = async (script, valueupdate) => {
    const options = {
    method: "POST",
    body: JSON.stringify({
        username: username,
        password: password

    }),
    headers:{
        "Content-Type": "application/json"
    },
    }
    try{
    const response = await fetch("http://localhost:8000/login", options)
    const data = await response.json()
    // console.log(data)
    if (data.message === "Login Successful") {
      // console.log(data)
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
    event.preventDefault();
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