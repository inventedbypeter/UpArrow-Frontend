import styled from '@emotion/styled';
import '@toast-ui/editor/dist/toastui-editor.css';

import dynamic from 'next/dynamic';

const EditorBlock = styled.div``;
const ToastEditor = dynamic(() => import('../components/ToastEditor'), {
  ssr: false,
});

const App = () => {
  return (
    <EditorBlock>
      <ToastEditor />
    </EditorBlock>
  );
};

export default App;
