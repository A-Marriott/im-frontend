import React, { useState } from 'react';

const NewAccount = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)

  const error = <p>Sorry, something went wrong when making your account. This is likely because you have chosen the same username as another user.</p>

  const submitUser = () => {
    fetch('http://localhost:3000/api/v1/users', {
      method: 'post',
      body: JSON.stringify({username: username, password: password}),
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => {
      if (response.status === 500) {
        setErrorMessage(true)
      }
      return response.json()
    })
    .then((data) => {
      if (data) {
        props.setuuid(username)
        props.setLoggedIn(true)
      }
    })
  }

  return (
    <div>
      <h3>New Account</h3>
      <div>
        <label>Username</label>
        <input
          type='text'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              submitUser();
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
              submitUser();
            }
          }}
          />
          <p>n.b. passwords are stored as strings, please do not use a real password</p>
      </div>
      {errorMessage && error}
      <img src="robot1.png" width="100" height="100"/>
      <img src="robot2.png" width="100" height="100"/>
      <img src="robot3.png" width="100" height="100"/>
      <img src="robot4.png" width="100" height="100"/>
      <img src="robot5.png" width="100" height="100"/>
      <img src="robot6.png" width="100" height="100"/>
      <button onClick={submitUser}>Submit</button>
    </div>
  )
}

export default NewAccount;
