import React, { useState } from 'react';
import styled from 'styled-components';

const UserGreeting = (props) => {
  const [loginScreen, setLoginScreen] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)

  const submitUser = () => {
    fetch('http://localhost:3000/api/v1/users', {
      method: 'post',
      body: JSON.stringify({username: username, password: password, avatar_num: props.avatarNum}),
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
        props.setAvatarNum(data.avatar_num)
        props.setuuid(username)
        props.setLoggedIn(true)
      } else {
        setErrorMessage(true)
      }
    })
  }

  let error
  let welcome
  let submit
  let avatars

  if (loginScreen) {
    error = <p>Either your username or password was incorrect</p>
    welcome = <h1>Login</h1>
    submit = <Button onClick={getUser}>Submit</Button>
  } else {
    error = <p>Sorry, something went wrong when making your account. This is likely because you have chosen the same username as another user.</p>
    welcome = <h1>Sign up</h1>
    submit = <Button onClick={submitUser}>Submit</Button>
    avatars =
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
      <h3>Choose an avatar</h3>
      <AvatarContainer>
        {[1, 2, 3, 4, 5, 6].map(num => {
          return <Avatar
                   src={`robot${num}.png`}
                   onClick={() => props.setAvatarNum(num)}
                   style={ props.avatarNum === num ? {  border: '2px solid white', } : {}}/>
        })}
      </AvatarContainer>
    </div>
  }

  return (
      <Container>
        <Box>
          {welcome}
          <FormInput>
            <label>Username</label>
            <InputBox
              type='text'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  loginScreen ? getUser() : submitUser()
                }
              }}
            />
          </FormInput>
          <FormInput>
            <label>Password</label>
            <InputBox
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  loginScreen ? getUser() : submitUser()
                }
              }}
              />
          </FormInput>
          {avatars}
          {submit}
          <Button onClick={() => {
            setLoginScreen(!loginScreen)
            setErrorMessage(false)
          }}>{loginScreen ? 'Make new account' : 'Log in'}</Button>
          {errorMessage && error}
        </Box>
      </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #150050;
  color: white;
`;

const Box = styled.div`
  width: 500px;
  background-color: #3D2C8D;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 24px;
  padding-bottom: 48px;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
`;

const InputBox = styled.input`
  margin-top: 8px;
  border-radius: 4px;
  border: none;
  height: 24px;
  &:focus {
    border: none;
  }
`;

const Button = styled.button`
  margin-top: 12px;
  height: 32px;
  padding: 18px;
  color: white;
  line-height: 0px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  background-color: #150050;
  font-size: 14px;
  transition: background 0.3s ease;
  &:hover {
    background: #3B889B;
    cursor: pointer;
  }
`;

const AvatarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 6px;
  grid-gap: 6px;
`;

const Avatar = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;

export default UserGreeting;
