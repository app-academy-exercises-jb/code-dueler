import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

const CodeEditor = (props) => {
  const [code, setCode] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  return (
    <>
    <div className="editor-info">
      <p>
        charCount: {charCount}
      </p>
      <p>
        lineCount: {lineCount}
      </p>
      <button 
        style={{
          background: "white",
          border: "1px solid black",
          borderRadius: "4px",
          margin: "1rem",
        }}
        onClick={e => {
          fetch("https://us-central1-code-dueler.cloudfunctions.net/parseCode", {
            method: 'POST',
            mode: 'cors',
            // e.target.value must have text which defines a function fizzBuzz
            body: JSON.stringify({data: { codeToRun: e.target.value }}),
            headers: {
              'Content-Type': 'application/json',
              authorization: localStorage.getItem('token'),
            }
          })
            .then(res => res.json())
            .then(res => {
              // res is the server response
            })
            .catch(err => console.log(err))
        }}
      >
        Submit Code
      </button>
    </div>
    <div className="editor">

      <div className="editor-text"></div>

      <Editor
        value={code}
        onValueChange={(code) => {
          setCharCount(code.length);
          setLineCount(code.split(/\r*\n/).length);
          setCode(code);
        }}
        highlight={(code) => Prism.highlight(code, Prism.languages.js)}
        padding={10}
        textareaClassName="editor"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </div>
    </>
  );
};

export default CodeEditor;
