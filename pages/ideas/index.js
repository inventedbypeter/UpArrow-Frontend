import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import api from '../../apis';
import Post from '../../components/Post';

const IdeasBlock = styled.div``;

export default function Ideas() {
  const router = useRouter();
  const { data: posts } = useQuery(['posts'], api.post.get);

  return (
    <IdeasBlock>
      {posts?.map((post) => {
        return (
          <Post
            key={post._id}
            post={post}
            onClick={() => {
              router.push(`/ideas/${post._id}`);
            }}
          />
        );
      })}
    </IdeasBlock>
  );
}
