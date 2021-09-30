import React, { useState, useEffect } from 'react';
import { usePubNub } from 'pubnub-react';
import styled from 'styled-components'

function Chat(props) {
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('');
  const [messages, addMessage] = useState({});
  const [message, setMessage] = useState('');
  const [msg, newmsg] = useState({});
  const [listenerAdded, setListenerAdded] = useState(false);

  const getMessages = () => {
    addMessage([])
    pubnub.fetchMessages(
        {
            channels: channels,
            end: '15343325004275466',
            count: 100
        },
        (status, response) => {
          const obj = {}
          channels.forEach(ch => {
            obj[ch] = []
            const channelAccessString = ch.replace(' ', '%20')
            response.channels[channelAccessString]?.forEach(msg => {
              obj[ch].push({message: msg.message, user: msg.uuid})
            })
          })
          addMessage(obj)
        }
    );
  }

  useEffect(() => {
    if (channels.length > 0) {
      getMessages();
    }
  }, [channels]);

  const getMyChannels = () => {
    fetch(`http://localhost:3000/api/v1/channels/1?username=${props.uuid}`, {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      let channelArray = []
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
      data.forEach(channel => setAllChannels(channels => [...channels, channel.name]))
    })
  }

  useEffect(() => {
    getMyChannels();
    getAllChannels();
  }, []);

  useEffect(() => {
    pubnub.subscribe({ channels });
    if (!listenerAdded) {
      pubnub.addListener({ message: handleMessage });
      setListenerAdded(true)
    }
  }, [pubnub, channels]);

  const handleMessage = event => {
    const channel = event.channel
    const publisher = event.publisher
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      newmsg({message: text, user: publisher})
    }
  };

  useEffect(() => {
    if (Object.keys(msg).length > 0) {
      doThing();
    }
  }, [msg]);

  const doThing = () => {
    addMessage({...messages, [currentChannel]: [...messages[currentChannel], msg]})
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
          <Avatar src="robot1.png" alt=""/>
          <Username>{props.uuid}</Username>
        </ProfileContainer>
        <ChannelsContainer>
          {channels?.map(channel => {
            return <ChannelButton onClick={() => setCurrentChannel(channel)}>{channel}</ChannelButton>
          })}
        </ChannelsContainer>
      </LeftScreen>
      <RightScreen>
        <ChatContainer>
          {messages[currentChannel]?.map(msg => msg).reverse().map((message, index) => {
            return (
              <Message key={`message-${index}`}>
                {message.user} - {message.message}
              </Message>
            );
          })}
        </ChatContainer>
        <InputContainer>
          <Input
            type="text"
            placeholder="Type your message"
            value={message}
            onKeyPress={e => {
              if (e.key !== 'Enter') return;
              sendMessage(message);
            }}
            onChange={e => setMessage(e.target.value)}
          />
          <a
            onClick={e => {
              e.preventDefault();
              sendMessage(message);
            }}
          >
            <SendButton src="send.png" alt=""/>
          </a>
        </InputContainer>
      </RightScreen>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  padding: 25px;
  height: 100%;
  // overflow: hidden;
  background-color: #150050;
  color: white;
`;

const LeftScreen = styled.div`
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

const RightScreen = styled.div`
  padding-left: 24px;
  flex-basis: 75%;
`;

const ChatContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column-reverse;
  flex-grow: 1;
  overflow: auto;
  height: 80vh;
`;

const Message = styled.div`
  background-color: #eee;
  border-radius: 6px;
  color: #333;
  // fontSize: 1.1rem;
  margin: 5px;
  padding: 8px 15px;
`;

const InputContainer = styled.div`
  margin-top: 8px;
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  height: 24px;
  border-radius: 6px 0 0 6px;
`;

const SendButton = styled.img`
  height: 30px;
  border-radius: 0 6px 6px 0;
  &:hover {
    cursor: pointer;
  }
`;

export default Chat;
