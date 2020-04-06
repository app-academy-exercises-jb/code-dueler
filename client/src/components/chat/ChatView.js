import React, { useEffect, useRef, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ON_MESSAGE_ADDED } from "../../graphql/subscriptions";
import { GET_MESSAGES } from "../../graphql/queries";
import ChatMessageItem from "./ChatMessageItem";

const ChatView = (props) => {
  const messagesRef = useRef(null);

  const { data, loading, error, subscribeToMore } = useQuery(GET_MESSAGES);

  const setRef = useCallback((node) => {
    if (node !== null) {
      console.log("setting current");
      messagesRef.current = node;
    }
  }, []);

  useEffect(() => {
    subscribeToMore({
      document: ON_MESSAGE_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const message = subscriptionData.data.messageAdded,
          next = { messages: [...prev.messages, message] };

        return next;
      },
    });
  }, []);

  useEffect(() => {
    messagesRef.current &&
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: "auto",
      });
  }, [messagesRef.current, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;
  if (!data.messages) return <p>Messages not found</p>;

  const messages = data.messages.map((message) => {
    return <ChatMessageItem key={message._id} message={message} />;
  });

  return (
    <div className="chatview-wrapper">
      <div className="chatview">
        <ul className="chatview-inner scroll-bar" ref={setRef}>
          {messages}
        </ul>
      </div>
    </div>
  );
};

export default ChatView;
