import React from 'react';

const GamesList = ({ games, joinGame }) => {
  if (!games) games = [];

  return (
  <div className="games-lobby">
    <h1>Games</h1>
    <table className="games-list">
      <tr className="games-list-heading">
        <th scope="col">Host</th>
        <th scope="col">Challenge</th>
        <th scope="col"># of Users</th>
        <th scope="col">Status</th>
      </tr>
      {games.map(game => (
      <tr
        key={game._id}
        className="games-item"
        cell
        onClick={() => joinGame({game: game._id})}
      >
        <th scope="row">{game.host}</th>
        <th>{game.challenge}</th>
        <th>{game.connections}</th>
        <th>{game.status}</th>
      </tr>
      ))}
    </table>
  </div>
  );
}

export default GamesList;
