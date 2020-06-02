import React, { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { useMutation } from "@apollo/react-hooks";
import {
  UPDATE_GAME_USER_CODE,
  SUBMIT_CODE,
} from "../../graphql/mutations";

const CodeEditor = ({ gameId, me, spectator, data, questionData }) => {
  const editorRef = useRef(null);
  let defaultCode = '';

  switch (questionData.language) {
    case "javascript":
      defaultCode = `var ${questionData.fnName} = (${questionData.fnArgs}) => {
  
};`
      break;
    case "ruby":
      defaultCode = `def ${questionData.fnName}(${questionData.fnArgs})

end`
      break;
    default:
      throw "unknown language"
  }


  const [code, setCode] = useState(defaultCode);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  const [updateUserCode] = useMutation(UPDATE_GAME_USER_CODE);
  const [submitCode] = useMutation(SUBMIT_CODE);

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
          submitCode({variables: { code: editorRef.current.props.value }});
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
          highlight={(code) => {
            switch (questionData.language) {
              case "ruby": 
                require("prismjs/components/prism-ruby");
                return Prism.highlight(code, Prism.languages.ruby);
              case "javascript":
              default: 
                return Prism.highlight(code, Prism.languages.js);
            }
          }}
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
