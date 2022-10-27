import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import api from '../../apis';
import { env } from '../../config';

const IdeasBlock = styled.div`
  img {
    width: 100%;
  }
`;

export default function Ideas({ post }) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <IdeasBlock>
      <h1>{post.title}</h1>
      <div>
        <img src={post.thumbnailImageUrl} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div>
        <div>likes : {post.likes.length}</div>
        <div>comments : {post.comments.length}</div>
        <button
          onClick={() => {
            router.push(`/editor/${id}`);
          }}
        >
          edit
        </button>
      </div>
    </IdeasBlock>
  );
}

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const post = (await axios.get(env.serverUrl + '/post/' + id)).data;

  return {
    props: { post },
  };
};
