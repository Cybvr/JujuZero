import React from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  height?: string;
}

const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on' as const,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  theme,
  options,
  height = '400px',
}) => {
  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage={language}
        defaultValue={value}
        theme={theme || 'vs-dark'}
        value={value}
        onChange={handleEditorChange}
        options={{ ...defaultOptions, ...options }}
      />
    </div>
  );
};

export default CodeEditor;