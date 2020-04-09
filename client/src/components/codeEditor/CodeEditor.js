import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

const CodeEditor = (props) => {
  const [code, setCode] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  return (
    <>
      <div className="editor">
        <Editor
          value={code}
          onValueChange={(code) => {
            setCharCount(code.length);
            setLineCount(code.split(/\r*\n/).length);
            setCode(code);
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
          <button className="code-submit" onClick={(e) => {}}>
            Submit Code
          </button>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
