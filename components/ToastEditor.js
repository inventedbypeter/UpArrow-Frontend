import { Editor } from '@toast-ui/react-editor';
import { forwardRef } from 'react';

const ToastEditor = forwardRef(({ editorRef }) => {
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
    </>
  );
});

export default ToastEditor;
