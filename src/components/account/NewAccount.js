import React, { useState } from 'react';

const NewAccount = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submitUser = () => {
    fetch('https://rap-app-backend.herokuapp.com/api/v1/youtube_videos', {
      method: 'post',
      body: JSON.stringify({username: username, password: password}),
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => console.log(response))
  }

  return (
    <div>
      <h3>New Post</h3>
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
      <button onClick={submitUser}>Submit</button>
    </div>
  )
}

export default NewAccount;
