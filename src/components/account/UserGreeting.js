import React, { useState } from 'react';

import Login from './Login';
import NewAccount from './NewAccount';

const UserGreeting = (props) => {
  const [loginScreen, setLoginScreen] = useState(true)

  let tabRender

  if (loginScreen) {
    tabRender = <Login setLoggedIn={props.setLoggedIn} setuuid={props.setuuid}></Login>
  } else {
    tabRender = <NewAccount setLoggedIn={props.setLoggedIn} setuuid={props.setuuid}></NewAccount>
  }

  return (
    <div>
      <button onClick={() => setLoginScreen(!loginScreen)}>{loginScreen ? 'Make new account' : 'Log in'}</button>
      {tabRender}
    </div>
  )
}

export default UserGreeting;
