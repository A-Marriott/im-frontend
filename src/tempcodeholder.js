<div style={pageStyles}>
      <div style={chatStyles}>
        <div style={listStyles}>
          {messages[currentChannel]?.map(msg => msg).reverse().map((message, index) => {
            return (
              <div key={`message-${index}`} style={messageStyles}>
                {message.user} - {message.message}
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
