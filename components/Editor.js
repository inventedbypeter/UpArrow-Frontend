import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
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

const Editor = ({ editData }) => {
  console.log('editdata : ', editData);
  const { data: stocks } = useQuery(['stock'], api.stock.get);
  const { user } = useUser();
  const [postForm, setPostForm] = useState(
    editData || { title: '', content: '', thumbnailImageUrl: '', stockId: '' }
  );

  const submit = () => {
    if (editData) {
      axios.put(`${env.serverUrl}/post/${editData._id}`, {
        ...postForm,
        email: user.email,
      });
    } else {
      axios.post(env.serverUrl + '/post', {
        ...postForm,
        email: user.email,
      });
    }
  };
  return (
    <EditorBlock>
      <InputWrapper>
        <input
          value={postForm.title}
          onChange={(e) =>
            setPostForm((s) => ({ ...s, title: e.target.value }))
          }
          placeholder='title'
        />
        <input
          value={postForm.thumbnailImageUrl}
          onChange={(e) =>
            setPostForm((s) => ({ ...s, thumbnailImageUrl: e.target.value }))
          }
          placeholder='thumbnail image url'
        />
        <select
          placeholder='stock'
          value={postForm.stockId}
          onChange={(e) =>
            setPostForm((s) => ({ ...s, stockId: e.target.value }))
          }
        >
          {stocks?.map((stock) => {
            return (
              <option key={stock._id} value={stock._id}>
                {stock.name}
              </option>
            );
          })}
        </select>
        <ToastEditor content={postForm.content} setPostForm={setPostForm} />
      </InputWrapper>

      <button onClick={submit}>{editData ? 'Edit' : 'Post'}</button>
    </EditorBlock>
  );
};

export default Editor;
