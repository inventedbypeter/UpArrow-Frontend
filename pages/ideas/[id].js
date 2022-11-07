import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import api from '../../apis';
import Vote from '../../components/Vote';
import { env } from '../../config';

const IdeasBlock = styled.div`
  img {
    width: 100%;
  }
`;

export default function Ideas({ post }) {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading } = useQuery(
    ['user', user?.email],
    api.user.getByEmail(user?.email)
  );

  const { id } = router.query;
  if (isLoading) {
    return null;
  }
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
      <div>agree : {post.agreeCount}</div>
      <div>disagree : {post.disagreeCount}</div>
      <Vote userId={data._id} postId={id} />
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
