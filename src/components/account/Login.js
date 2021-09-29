import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const getUser = () => {
    fetch(`http://localhost:3000/api/v1/users?username=${username}&password=${password}`, {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
  }

  return (
    <div>
      <h3>Login</h3>
      <div>
        <label>Username</label>
        <input
          type='text'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
      </div>
      <div>
        <label>Password</label>
        <input
          type='text'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
      </div>
      <button onClick={getUser}>Submit</button>
    </div>
  )
}

export default Login;
