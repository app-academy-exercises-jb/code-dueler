import React, { useEffect, useRef, useCallback, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ON_MESSAGE_ADDED } from "../../graphql/subscriptions";
import { GET_MESSAGES } from "../../graphql/queries";
import ChatMessageItem from "./ChatMessageItem";

const ChatView = ({ channelId, id }) => {
  const messagesRef = useRef(null);
  const [offset, setOffset] = useState(15);
  const [shouldFetch, setShouldFetch] = useState(true);

  const { data, loading, error, subscribeToMore, fetchMore } = useQuery(
    GET_MESSAGES,
    {
      variables: {
        channelId,
        offset: 0,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const setRef = useCallback((node) => {
    if (node !== null) {
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

  const lastMessage =
    data &&
    data.messages[data.messages.length - 1] &&
    data.messages[data.messages.length - 1]._id;

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, [lastMessage]);

  if (error) return <p>ERROR</p>;
  if (loading && !offset) return <p>Loading...</p>;

  if (!data) return <p>Not Found</p>;
  if (!data.messages) return <p>Messages not found</p>;

  const handleScroll = (e) => {
    if (e.target.scrollTop < 25 && !loading && shouldFetch) {
      fetchMore({
        query: GET_MESSAGES,
        variables: {
          channelId,
          offset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult.messages) return prev;
          const next = {
            messages: [...fetchMoreResult.messages, ...prev.messages],
          };
          setOffset(offset + 15);
          setShouldFetch(true);
          return next;
        },
      });
      setShouldFetch(false);
      e.target.scroll({ top: 25 });
    }
  };

  return (
    <div className="chatview-wrapper">
      <div className="chatview">
        <ul
          className="chatview-inner scroll-bar"
          ref={setRef}
          onScroll={handleScroll}
        >
          {data.messages.map((message) => (
            <ChatMessageItem key={message._id} message={message} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatView;
