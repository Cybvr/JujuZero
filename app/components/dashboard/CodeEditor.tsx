import React from 'react';
import dynamic from 'next/dynamic';
import { loader } from '@monaco-editor/react';

// Load Monaco Editor using dynamic import to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

// Specify the CDN version of Monaco Editor to use
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs' } });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  options?: Record<string, any>;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'html',
  theme = 'vs-dark',
  options = {},
}) => {
  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  const defaultOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
  };

  return (
    <MonacoEditor
      height="600px"
      language={language}
      theme={theme}
      value={value}
      onChange={handleEditorChange}
      options={{ ...defaultOptions, ...options }}
      loading={<div>Loading editor...</div>}
    />
  );
};

export default CodeEditor;