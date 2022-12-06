import { Editor } from '@toast-ui/react-editor';
import { forwardRef, useEffect, useRef } from 'react';

const ToastEditor = ({ content, setPostForm, placeholder }) => {
  const editorRef = useRef();
  return (
    <>
      <Editor
        initialValue={content}
        placeholder={placeholder}
        onChange={() => {
          setPostForm((s) => ({
            ...s,
            content: editorRef.current.getInstance().getHTML(),
          }));
        }}
        previewStyle='vertical'
        height='1000px'
        initialEditType='wysiwyg'
        useCommandShortcut={true}
        ref={editorRef}
      />
    </>
  );
};

export default ToastEditor;
