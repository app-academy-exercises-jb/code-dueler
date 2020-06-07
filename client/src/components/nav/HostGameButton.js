import React from 'react';

const HostGameButton = ({
  refetchMe,
  setShowUsers,
  setShowHost,
  showHost,
  showUsers,
}) => {
  const handleClick = () => {
    if (showUsers) {
      setShowUsers(false);
      return setShowHost(!showHost);
    } else {
      if (showHost) setShowUsers(true);
      return setShowHost(!showHost);
    }
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>{showHost ? "Global Lobby" : "Host Game"}</button>
    </div>
    );
};

export default HostGameButton;
