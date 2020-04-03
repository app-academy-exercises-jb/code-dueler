import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER } from '../../graphql/queries';


export default () => {
  const { data, loading, error } = useQuery(
    CURRENT_USER,
    {
      fetchPolicy: 'network-only'
    }
  );

  if (loading) return <p>Loading</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <>
      <h1>Hello {data.me.username}!</h1>
    </>
  );
}