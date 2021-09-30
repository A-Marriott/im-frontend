import React, { useState } from 'react';
import styled from 'styled-components';

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
    <Container>
      <Box>
        <h1>Login</h1>
        <FormInput>
          <label>Username</label>
          <InputBox
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
                getUser();
              }
            }}
            />
        </FormInput>
        <Button onClick={getUser}>Submit</Button>
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
  height: 320px;
  background-color: #3D2C8D;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
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

export default Login;
