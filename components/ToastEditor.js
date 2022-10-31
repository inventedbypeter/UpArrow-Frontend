import { Editor } from '@toast-ui/react-editor';
import { forwardRef, useEffect, useRef } from 'react';

const ToastEditor = ({ content, setPostForm }) => {
  const editorRef = useRef();
  return (
    <>
      <Editor
        initialValue={content}
        onChange={() => {
          setPostForm((s) => ({
            ...s,
            content: editorRef.current.getInstance().getHTML(),
          }));
        }}
        previewStyle='vertical'
        height='600px'
        initialEditType='markdown'
        useCommandShortcut={true}
        ref={editorRef}
      />
    </>
  );
};

export default ToastEditor;
