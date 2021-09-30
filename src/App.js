import React, { useState } from 'react';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

import UserGreeting from './components/account/UserGreeting';
import Chat from './components/pubnub/Chat';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [uuid, setuuid] = useState('')
  const [avatarNum, setAvatarNum] = useState(1)

  if (loggedIn) {
    const pubnub = new PubNub({
      publishKey: 'pub-c-854fa4a9-e5f4-42f0-9bf4-b060ac55fd65',
      subscribeKey: 'sub-c-6fb4329a-2042-11ec-8d5d-a65b09ab59bc',
      uuid: uuid
    });

    return (
    <PubNubProvider client={pubnub}>
      <Chat uuid={uuid} avatarNum={avatarNum}/>
    </PubNubProvider>
    )
  } else {
    return <UserGreeting setLoggedIn={setLoggedIn} setuuid={setuuid} avatarNum={avatarNum} setAvatarNum={setAvatarNum}/>;
  }
}

export default App;
