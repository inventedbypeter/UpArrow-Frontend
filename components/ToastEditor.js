import { Editor } from '@toast-ui/react-editor';
import { useRef } from 'react';
const ToastEditor = () => {
  const editorRef = useRef();
  return (
    <>
      <Editor
        initialValue='hello react editor world!'
        previewStyle='vertical'
        height='600px'
        initialEditType='markdown'
        useCommandShortcut={true}
        ref={editorRef}
      />
      <button
        onClick={() => {
          console.log(editorRef.current.getInstance().getHTML());
        }}
      ></button>
    </>
  );
};

export default ToastEditor;
