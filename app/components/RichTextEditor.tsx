import React, { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onSave }) => {
  const [editorState, setEditorState] = useState(() => {
    const contentBlock = htmlToDraft(initialContent);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    onSave(html);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName="border rounded-md p-2"
      editorClassName="min-h-[100px]"
    />
  );
};

export default RichTextEditor;