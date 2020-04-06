import React from "react";
import ChatMessages from "./ChatMessages";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { CURRENT_USER, GET_MESSAGES } from "../../graphql/queries";
import { ADD_MESSAGE } from "../../graphql/mutations";
import { ON_MESSAGE_ADDED } from "../../graphql/subscriptions";

export default (props) => {
  const { data, loading, error } = useQuery(CURRENT_USER, {
    fetchPolicy: "network-only",
  });
  const [addMessage, { data: mData }] = useMutation(ADD_MESSAGE);
  const { subscribeToMore, ...result } = useQuery(GET_MESSAGES);

  if (error) console.log(error);
  if (loading || error) return null;

  function handleChange(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      addMessage({ variables: { author: data.me._id, body: e.target.value } });
      e.target.value = "";
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 4,
      }}
      className="chat-box"
    >
      <ChatMessages
        {...result}
        subscribeToMessageEvents={() =>
          subscribeToMore({
            document: ON_MESSAGE_ADDED,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const message = subscriptionData.data.messageAdded,
                next = { messages: [...prev.messages, message] };

              return next;
            },
          })
        }
      />
      <textarea
        style={{
          background: "white",
          height: "4rem",
        }}
        onKeyDown={handleChange}
      />
    </div>
  );
};
