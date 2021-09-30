import styled from 'styled-components';

function ChatScreen(props) {
  if (props.channels.includes(props.currentChannel)) {
    return (
      <RightScreen joinChannel={false}>
        <ChatContainer>
          {props.messages[props.currentChannel]?.map(msg => msg).reverse().map((message, index) => {
            return (
              <MessageContainer>
                <p>{message.user}</p>
                <Message key={`message-${index}`}>
                  {message.message}
                </Message>
              </MessageContainer>
            );
          })}
         <DeleteButton src="delete-button.svg" alt="" onClick={() => props.leaveChannel()}/>
       </ChatContainer>
       <InputContainer>
         <Input
           type="text"
           placeholder="Type your message"
           value={props.message}
           onKeyPress={e => {
             if (e.key !== 'Enter') return;
             props.sendMessage(props.message);
           }}
           onChange={e => props.setMessage(e.target.value)}
         />
         <SendButton src="send-icon.png" alt="" onClick={() => props.sendMessage(props.message)}/>
       </InputContainer>
     </RightScreen>
   )
  } else {
    return (
      <RightScreen joinChannel={true}>
        <JoinChannel onClick={() => props.joinChannel()}>Join Channel?</JoinChannel>
      </RightScreen>
    )
  }
}

const RightScreen = styled.div`
  padding: 24px;
  flex-basis: 75%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => (props.joinChannel ? 'center' : 'space-between')};
`;

const ChatContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column-reverse;
  flex-grow: 1;
  overflow: auto;
  height: 80vh;
`;

const MessageContainer = styled.div`
  margin-left: 5px;
`;

const Message = styled.div`
  display: flex;
  min-height: 30px;
  align-items: center;
  background-color: #eee;
  border-radius: 6px;
  color: #333;
  // fontSize: 1.1rem;
  margin: 5px;
  margin-left: -2px;
  padding: 8px 15px;
`;

const DeleteButton = styled.img`
  position: absolute;
  height: 30px;
  right: 0px;
  top: 0px;
  &:hover {
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  margin-top: 32px;
  display: flex;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 24px;
  padding: 8px;
  border-radius: 6px 0 0 6px;
`;

const SendButton = styled.img`
  position: absolute;
  right: 2px;
  top: 5px;
  height: 35px;
  width: 40px;
  border-radius: 0 6px 6px 0;
  &:hover {
    cursor: pointer;
  }
`;

const JoinChannel = styled.button`
  color: white;
  height: 64px;
  border-radius: 16px;
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

export default ChatScreen
