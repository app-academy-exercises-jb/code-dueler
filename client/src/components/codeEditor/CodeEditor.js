import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { useMutation } from "@apollo/react-hooks";
import {
  UPDATE_GAME_USER_CODE,
  UPDATE_GAME_LAST_SUBMITTED,
  SUBMIT_CODE,
} from "../../graphql/mutations";

const CodeEditor = ({ gameId, me, spectator, data }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(`var fizzBuzz = (n) => {
    
  };`);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  const [updateUserCode] = useMutation(UPDATE_GAME_USER_CODE);
  const [updateLastSubmission] = useMutation(UPDATE_GAME_LAST_SUBMITTED);
  const [pingJudge] = useMutation(SUBMIT_CODE);

  useEffect(() => {
    data && setCode(data);
  }, [spectator, data]);

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
          pingJudge({variables: { code: editorRef.current.props.value }});
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
