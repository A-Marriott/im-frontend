import React, { useState } from 'react';

import Login from './Login';
import NewAccount from './NewAccount';

const UserGreeting = () => {
  const [loginScreen, setLoginScreen] = useState(true)

  let tabRender

  if (loginScreen) {
    tabRender = <Login></Login>
  } else {
    tabRender = <NewAccount></NewAccount>
  }

  return (
    <div>
      <button onClick={() => setLoginScreen(!loginScreen)}>{loginScreen ? 'Make new account' : 'Log in'}</button>
      {tabRender}
    </div>
  )
}

export default UserGreeting;
