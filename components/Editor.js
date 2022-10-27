import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { env } from '../config';
import api from '../apis';

const EditorBlock = styled.div``;
const ToastEditor = dynamic(() => import('../components/ToastEditor'), {
  ssr: false,
});

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const { data: stocks } = useQuery(['stock'], api.stock.get);
  const { user } = useUser();
  const titleRef = useRef();
  const thumbnailRef = useRef();
  const stockIdRef = useRef();
  const editorRef = useRef();

  return (
    <EditorBlock>
      <InputWrapper>
        <input ref={titleRef} placeholder='title' />
        <input ref={thumbnailRef} placeholder='thumbnail image url' />
        <select ref={stockIdRef} placeholder='stock'>
          {stocks?.map((stock) => {
            return (
              <option key={stock._id} value={stock._id}>
                {stock.name}
              </option>
            );
          })}
        </select>
        <ToastEditor editorRef={editorRef} />
      </InputWrapper>

      <button
        onClick={() => {
          const content = editorRef.current.getInstance().getHTML();
          const title = titleRef.current.value;
          const thumbnailImageUrl = thumbnailRef.current.value;
          const stockId = stockIdRef.current.value;

          axios.post(env.serverUrl + '/post', {
            content,
            title,
            thumbnailImageUrl,
            stockId,
            email: user.email,
          });
        }}
      >
        Post
      </button>
    </EditorBlock>
  );
};

export default App;
