import React, { useState, useEffect } from 'react';
import { usePubNub } from 'pubnub-react';

function Chat(props) {
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('');
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');

  const getChannels = () => {
    fetch(`http://localhost:3000/api/v1/channels?username=${props.uuid}`, {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      let channelArray = []
      // data.forEach(channel => setChannels(channels => [...channels, channel.name]))
      data.forEach(channel => channelArray.push(channel.name))
      setCurrentChannel(channelArray[0])
      setChannels(channelArray)
    })
  }

  const getMessages = () => {
    addMessage([])
    pubnub.fetchMessages(
        {
            channels: [currentChannel],
            end: '15343325004275466',
            count: 100
        },
        (status, response) => {
          const channelAccessString = currentChannel.replace(' ', '%20')
          response.channels[channelAccessString]?.forEach(msg => {
            addMessage(messages => [...messages, msg.message]);
          })
        }
    );
  }

  useEffect(() => {
    getChannels();
  }, []);

  useEffect(() => {
    pubnub.removeListener({ message: handleMessage })

    if (channels.length > 0) {
      pubnub.addListener({ message: handleMessage });
      pubnub.subscribe({ channels });
    }
  }, [pubnub, channels]);

  useEffect(() => {
    if (currentChannel.length > 0) {
      getMessages();
    }
  }, [currentChannel]);

  const handleMessage = event => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      addMessage(messages => [...messages, text]);
    }
  };

  const sendMessage = message => {
    if (message) {
      pubnub
        .publish({ channel: channels[1], message })
        .then(() => setMessage(''));
    }
  };

  return (
    <div style={pageStyles}>
      <div style={chatStyles}>
        <div style={headerStyles}>React Chat Example</div>
        <div style={listStyles}>
          {messages.map((message, index) => {
            return (
              <div key={`message-${index}`} style={messageStyles}>
                {message}
              </div>
            );
          })}
        </div>
        <div style={footerStyles}>
          <input
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
          <button
            style={buttonStyles}
            onClick={e => {
              e.preventDefault();
              sendMessage(message);
            }}
          >
            Send Message
          </button>
          {channels?.map(channel => {
            return <button onClick={() => setCurrentChannel(channel)}>{channel}</button>
          })}
        </div>
      </div>
    </div>
  );
}

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

const headerStyles = {
  background: '#323742',
  color: 'white',
  fontSize: '1.4rem',
  padding: '10px 15px',
};

const listStyles = {
  alignItems: 'flex-start',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  padding: '10px',
};

const messageStyles = {
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


// class Chat extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {channels: [], messages: [], createMessage: []}
//     this.pubnub = usePubNub();
//   }

//   // componentDidMount() {
//   //   this.getChannels();
//   //   this.pubnub.addListener({ message: this.handleMessage });
//   //   this.pubnub.subscribe({ this.state.channels });
//   // }

//   getChannels = () => {
//     fetch(`http://localhost:3000/api/v1/channels?username=${props.uuid}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Accepts: "application/json",
//       },
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach(channel => this.setState(prevState => {channels: [...prevState, channel.name]}))
//     })
//   }

//   handleMessage = event => {
//     const message = event.message;
//     if (typeof message === 'string' || message.hasOwnProperty('text')) {
//       const text = message.text || message;
//       this.setState(prevState => {messages: [...prevState, text]})
//     }
//   };

//   sendMessage = message => {
//     if (message) {
//       pubnub
//         .publish({ channel: this.state.channels[0], message })
//         .then(() => setMessage(''));
//     }
//   };

//   // useEffect(() => {
//   //   pubnub.addListener({ message: handleMessage });
//   //   pubnub.subscribe({ channels });
//   // }, [pubnub, channels]);
//   render() {
//     return <p>hey</p>
//   }

//   // render() {
//   //   return (
//   //     <Container>
//   //       <Button onClick={this.randomiseWord}>Next word</Button>
//   //       <h1>{this.capitalize(this.state.randomWord)}</h1>
//   //       <WordGrid>
//   //         {this.state.rhymingWords.map((word, i) => {
//   //           return <p>{this.capitalize(word["word"])}</p>
//   //         })}
//   //       </WordGrid>
//   //     </Container>
//   //   )
//   // }
// }

export default Chat;
