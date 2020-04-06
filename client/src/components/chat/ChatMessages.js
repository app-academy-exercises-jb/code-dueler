import React, { useEffect, useRef, useCallback } from 'react';

export default ({ data, loading, error, subscribeToMessageEvents }) => {
  const messagesRef = useRef(null);
  
  const setRef = useCallback(node => {
    if (node !== null) {
      console.log("setting current")
      messagesRef.current = node;
    }
  }, []);

  useEffect(() => {
    subscribeToMessageEvents();
  }, []);

  useEffect(() => {
    messagesRef.current && messagesRef.current.scroll({
      top: messagesRef.current.scrollHeight,
      behavior: 'auto',
    })
  }, [messagesRef.current, data]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;
  if (!data.messages) return <p>Messages not found</p>;

  return (
    <div
      ref={setRef}
      style={{
        height: '80vh',
        overflow: 'auto',
      }}
    >
      <ul>
        {data.messages.map(message => (
        <li key={message._id}>
          <p>
            {message.author.username} at {message.createdAt} said:
          </p>
          <p>
            {message.body}
          </p>
        </li>
      ))}
      </ul>
    </div>)
};
