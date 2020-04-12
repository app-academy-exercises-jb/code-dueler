import React, { useState, useRef } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { useMutation } from "@apollo/react-hooks";
import {
  UPDATE_GAME_USER_CODE,
  UPDATE_GAME_LAST_SUBMITTED,
} from "../../graphql/mutations";

const CodeEditor = ({ gameId, me, spectator }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(`var fizzBuzz = (n) => {
    
  };`);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  const [updateUserCode] = useMutation(UPDATE_GAME_USER_CODE);
  const [updateLastSubmission] = useMutation(UPDATE_GAME_LAST_SUBMITTED);

  const handleValueChange = (code) => {
    setCharCount(code.length);
    setLineCount(code.split(/\r*\n/).length);
    setCode(code);
    const variables = {
      charCount,
      lineCount,
      currentCode: code,
      gameId,
      player: me._id,
    };
    updateUserCode({ variables });
  };

  const disabled = spectator ? true : false;
  let button = null;
  if (!disabled) {
    button = (
      <button
        className="code-submit"
        onClick={(e) => {
          fetch(
            "https://us-central1-code-dueler.cloudfunctions.net/parseCode",
            {
              method: "POST",
              mode: "cors",
              body: JSON.stringify({
                data: { codeToRun: editorRef.current.props.value },
              }),
              headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token"),
              },
            }
          )
            .then((res) => res.json())
            .then(({ data: { ...result } }) => {
              updateLastSubmission({
                variables: {
                  lastSubmittedResult: JSON.stringify(result),
                  player: me._id,
                  gameId,
                },
              });
            })
            .catch((err) => console.log(err));
        }}
      >
        <h1>Submit your code</h1>
      </button>
    );
  }

  return (
    <>
      <div className="editor">
        <Editor
          disabled={disabled}
          autoFocus
          ref={editorRef}
          value={code}
          onValueChange={(code) => {
            handleValueChange(code);
          }}
          highlight={(code) => Prism.highlight(code, Prism.languages.js)}
          padding={10}
          preClassName="editorPre"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </div>
      {button}
    </>
  );
};

export default CodeEditor;
