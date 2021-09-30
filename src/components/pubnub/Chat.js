import React, { useState, useEffect } from 'react';
import { usePubNub } from 'pubnub-react';
import styled from 'styled-components';

import ChatScreen from './ChatScreen';

function Chat(props) {
  const pubnub = usePubNub();
  const [listenerAdded, setListenerAdded] = useState(false);

  const [channels, setChannels] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('');

  const [messages, addMessage] = useState({});
  const [message, setMessage] = useState('');
  const [incomingMessage, setIncomingMessage] = useState(['', {}]);

  // init pubnub

  useEffect(() => {
    pubnub.subscribe({ channels });
    if (!listenerAdded) {
      pubnub.addListener({ message: handleMessage });
      setListenerAdded(true)
    }
  }, [pubnub, channels]);

  // Channel functions

  useEffect(() => {
    getMyChannels();
    getAllChannels();
  }, []);

  const getMyChannels = () => {
    fetch(`http://localhost:3000/api/v1/channels/1?username=${props.uuid}`, {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      const channelArray = []
      data.forEach(channel => channelArray.push(channel.name))
      setCurrentChannel(channelArray[0])
      setChannels(channelArray)
    })
  }

  const getAllChannels = () => {
    fetch('http://localhost:3000/api/v1/channels/', {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) =>  {
      const channelArray = []
      data.forEach(channel => channelArray.push(channel.name))
      setAllChannels(channelArray)
    })
  }

  const joinChannel = () => {
    fetch('http://localhost:3000/api/v1/user_channels', {
      method: 'post',
      body: JSON.stringify({user_id: [props.uuid], channel_id: [currentChannel]}),
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then(() => setChannels(channels => [...channels, currentChannel]))
  }

  const leaveChannel = () => {
    fetch('http://localhost:3000/api/v1/user_channels/1', {
      method: 'delete',
      body: JSON.stringify({user_id: [props.uuid], channel_id: [currentChannel]}),
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      const channelIndex = channels.indexOf(currentChannel)
      setChannels(ch => channels.splice(channelIndex, 1))
    })
  }

  // Message functions

  useEffect(() => {
    if (channels.length > 0) {
      getMessages();
    }
  }, [channels]);

  useEffect(() => {
    if (Object.keys(incomingMessage[1]).length > 0) {
      addIncomingMessage();
    }
  }, [incomingMessage]);

  const getMessages = () => {
    pubnub.fetchMessages(
        {
            channels: channels,
            end: '15343325004275466',
            count: 100
        },
        (status, response) => {
          const messageList = {}
          channels.forEach(channel => {
            messageList[channel] = []
            const channelAccessString = channel.replace(' ', '%20')
            response.channels[channelAccessString]?.forEach(msg => {
              messageList[channel].push({message: msg.message, user: msg.uuid})
            })
          })
          addMessage(messageList)
        }
    );
  }

  const handleMessage = event => {
    const channel = event.channel;
    const publisher = event.publisher;
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      setIncomingMessage([channel, {message: text, user: publisher}])
    }
  };

  // The pubnub event listener doesn't seem to update state inside of its event listeners
  // This method is therefore needed to collect the incoming message and pass it to messages without overwriting the state of messages

  const addIncomingMessage = () => {
    addMessage({...messages, [incomingMessage[0]]: [...messages[incomingMessage[0]], incomingMessage[1]]})
  }

  const sendMessage = message => {
    if (message) {
      pubnub
        .publish({ channel: currentChannel, message })
        .then(() => setMessage(''));
    }
  };

  return (
    <Container>
      <LeftScreen>
        <ProfileContainer>
          <Avatar src={`robot${props.avatarNum}.png`} alt=""/>
          <Username>{props.uuid}</Username>
        </ProfileContainer>
        <ChannelsContainer>
          <p>My channels</p>
          {channels?.map(channel => {
            return <ChannelButton
              onClick={() => setCurrentChannel(channel)}
              style={ currentChannel === channel ? {backgroundColor: '#3B889B'} : {}}>
              {channel}
            </ChannelButton>
          })}
          <p>Other channels</p>
          {allChannels.filter(el => !channels.includes(el))?.map(channel => {
            return <ChannelButton
              onClick={() => setCurrentChannel(channel)}
              style={ currentChannel === channel ? {backgroundColor: '#3B889B'} : {}}>
              {channel}
            </ChannelButton>
          })}
        </ChannelsContainer>
      </LeftScreen>
      <ChatScreen channels={channels} currentChannel={currentChannel} messages={messages} message={message} leaveChannel={leaveChannel} sendMessage={sendMessage} setMessage={setMessage} joinChannel={joinChannel}></ChatScreen>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #150050;
  color: white;
`;

const LeftScreen = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  background-color: #3D2C8D;
  border-radius: 10px 0 0 10px;
`;

const ProfileContainer = styled.div`
  border-bottom: solid 2px grey;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 2px solid white;
`;

const Username = styled.p`
  margin-left: 12px;
  font-size: 20px;
  font-weight: bold;
`

const ChannelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-left: 8px;
  height: 80vh;
`;

const ChannelButton = styled.button`
  width: 100%;
  margin-bottom: 12px;
  height: 32px;
  color: white;
  border-radius: 16px 0 0 16px;
  border: none;
  font-weight: bold;
  background-color: #3D2C8D;
  font-size: 14px;
  transition: background 0.3s ease;
  &:hover {
    background: #3B889B;
    cursor: pointer;
  }
`;

export default Chat;
