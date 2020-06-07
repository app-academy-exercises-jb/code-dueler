import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { HOST_GAME } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';
import { GET_QUESTIONS } from '../../graphql/queries';

const GameHost = () => {
  const [host] = useMutation(HOST_GAME);
  const history = useHistory();

  const [filter, setFilter] = useState("");

  const {
    data
  } = useQuery(GET_QUESTIONS, {variables: { filter }});

  const hostGame = async question => {
    let {challenge, chosenLang: language} = question;
    if (language === undefined) language = question.languages[0];

    await host({
      variables: {challenge, language}})
      .then(async ({data: { hostGame: gameId }}) => {
        if (gameId === "not ok") return;
        history.push(`/game/${gameId}`);
      })
  }

  return (
  <div className="games-lobby">
    <h1>Host a New Game</h1>

    <input
      type="text"
      value={filter}
      onChange={(e) => {
        setFilter(e.target.value)
      }}
      className="text-input-area"
      placeholder="Search"
    />

    {data && data.getQuestions.map((q, idx) => (
      <div key={q._id} className="games-item host-game-item">
        <div>{idx+1}.</div>
        <div>{q.challenge}</div>

        <select onChange={e => q.chosenLang = e.target.value}>
        {q.languages.map(l => (
          <option key={l} value={l}>
            {l[0].toUpperCase() + l.slice(1)}
          </option>
        ))}
        </select>

        <div onClick={() => hostGame(q)}>Go!</div>
      </div>
    ))}
  </div>
  );
}

export default GameHost;
