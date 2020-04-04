import React from 'react';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export default (props) => {
  // const { data, loading } = useSubscription(gql`
  //   subscription onMessageAdded {
  //     messageAdded {
  //       _id
  //     }
  //   }
  // `, { variables: { body: "hello world!" } });

  // console.log(loading, data);

  return null;
  // return <h1>{!loading && Object.keys(data)}</h1>
};
