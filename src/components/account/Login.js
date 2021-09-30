import React, { useState } from 'react';

const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)

  const error = <p>Either your username or password was incorrect</p>

  const getUser = () => {
    fetch('http://localhost:3000/api/v1/verify', {
      method: 'post',
      body: JSON.stringify({username: username, password: password}),
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        props.setuuid(username)
        props.setLoggedIn(true)
      } else {
        setErrorMessage(true)
      }
    })
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
          onKeyPress={e => {
            if (e.key === 'Enter') {
              getUser();
            }
          }}
          />
      </div>
      <div>
        <label>Password</label>
        <input
          type='password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              getUser();
            }
          }}
          />
      </div>
      <button onClick={getUser}>Submit</button>
      {errorMessage && error}
    </div>
  )
}

export default Login;
