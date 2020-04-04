import React from 'react';
import NavBar from '../components/nav/NavBar.js';
import UserDetails from '../components/users/UserDetails.js';
import LogOutButton from '../components/users/LogOutButton.js';
import ChatBox from '../components/chat/ChatBox.js';

export default () => {
  return (
    <>
      <NavBar />
      <UserDetails />
      <LogOutButton />
      <ChatBox />
    </>
  )
}