import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_GAME_USER_CODE } from "../../graphql/mutations";

const CodeEditor = ({ gameId }) => {
  const [code, setCode] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [updateUserCode] = useMutation(UPDATE_GAME_USER_CODE);

  const handleValueChange = (code) => {
    setCharCount(code.length);
    setLineCount(code.split(/\r*\n/).length);
    setCode(code);
    console.log("attempting to mutate");
    updateUserCode({
      variables: { charCount, lineCount, currentCode: code, gameId },
    });
  };

  return (
    <>
      <div className="editor">
        <Editor
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
        <div className="editor-info">
          <div className="editor-counts">
            <p className="editor-count">charCount: {charCount}</p>
            <p className="editor-count">lineCount: {lineCount}</p>
          </div>
          <button
            className="code-submit"
            onClick={(e) => {
              fetch(
                "https://us-central1-code-dueler.cloudfunctions.net/parseCode",
                {
                  method: "POST",
                  mode: "cors",
                  // e.target.value must have text which defines a function fizzBuzz
                  body: JSON.stringify({
                    data: { codeToRun: e.target.value },
                  }),
                  headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("token"),
                  },
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  // res is the server response
                })
                .catch((err) => console.log(err));
            }}
          >
            Submit Code
          </button>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
