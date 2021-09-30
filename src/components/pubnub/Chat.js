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
      <ChatContainer>
        {messages[currentChannel]?.map(msg => msg).reverse().map((message, index) => {
          return (
            <Message key={`message-${index}`}>
              {message.user} - {message.message}
            </Message>
          );
        })}
        <Input
          type="text"
          style={inputStyles}
          placeholder="Type your message"
          value={message}
          onKeyPress={e => {
            if (e.key !== 'Enter') return;
            sendMessage(message);
          }}
          onChange={e => setMessage(e.target.value)}
        />
        <SendButton
          style={buttonStyles}
          onClick={e => {
            e.preventDefault();
            sendMessage(message);
          }}
        >
        Send Message
        </SendButton>
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  padding: 25px;
  height: 100vh;
  // background-color: #171F24;
  // color: white;
`;

const LeftScreen = styled.div`
`;

const ProfileContainer = styled.div`
  border-bottom: solid 2px grey;
  padding: 12px;
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 1px solid black;
`;

const Username = styled.p`
  margin-left: 12px;
`

const ChannelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  padding: 4px;
`;

const ChannelButton = styled.button`
  width: 100%;
  margin-bottom: 8px;
  height: 24px;
  color: white;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  background: #4FB0C6;
  transition: background 0.3s ease;
  &:hover {
    background: #3B889B;
    cursor: pointer;
  }
`;

const ChatContainer = styled.div`
  padding: 24px;
  width: 700px;
`;

const Message = styled.div`
`;

const Input = styled.input`
`;

const SendButton = styled.button`
`;

const PageStyles = styled.div`
  alignItems: center;
  background: #282c34;
  display: flex;
  justifyContent: center;
  minHeight: 100vh;
`;

const ChatStyles = styled.div`
  display: flex;
  flexDirection: column;
  height: 50vh;
  width: 50%;
`;

const ListStyles = styled.div`
  alignItems: flex-start;
  backgroundColor: white;
  display: flex;
  flexDirection: column-reverse;
  flexGrow: 1;
  overflow: auto;
  padding: 10px;
`;

const MessageStyles = styled.div`
  position: relative;
  right: 0px;
  backgroundColor: #eee;
  borderRadius: 5px;
  color: #333;
  fontSize: 1.1rem;
  margin: 5px;
  padding: 8px 15px;
`;

const FooterStyles = styled.div`
  display: flex;
`;

const InputStyles = styled.input`
  flexGrow: 1;
  fontSize: 1.1rem;
  padding: 10px 15px;
`;

const ButtonStyles = styled.button`
  fontSize: 1.1rem;
  padding: 10px 15px;
`;

const pageStyles = {
  alignItems: 'center',
  background: '#282c34',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
};

const chatStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '50vh',
  width: '50%',
};

const listStyles = {
  alignItems: 'flex-start',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column-reverse',
  flexGrow: 1,
  overflow: 'auto',
  padding: '10px',
};

const messageStyles = {
  position: 'relative',
  right: '0px',
  backgroundColor: '#eee',
  borderRadius: '5px',
  color: '#333',
  fontSize: '1.1rem',
  margin: '5px',
  padding: '8px 15px',
};

const footerStyles = {
  display: 'flex',
};

const inputStyles = {
  flexGrow: 1,
  fontSize: '1.1rem',
  padding: '10px 15px',
};

const buttonStyles = {
  fontSize: '1.1rem',
  padding: '10px 15px',
};

export default Chat;
