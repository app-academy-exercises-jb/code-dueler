import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

const CodeEditor = (props) => {
  const [code, setCode] = useState("");

  const styling = {};

  return (
    <div className="editor">
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => Prism.highlight(code, Prism.languages.js)}
        padding={10}
        textareaClassName="editor"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </div>
  );
};

export default CodeEditor;
