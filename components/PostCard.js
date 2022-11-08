import React from 'react';
import styled from '@emotion/styled';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useQuery } from '@tanstack/react-query';
import api from '../apis';
import { useRouter } from 'next/router';
import { useVoteData } from '../hooks/useVoteData';
import Tag from './common/Tag';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const PostWrapper = styled.div`
  cursor: pointer;
  max-width: 500;
  display: flex;
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  border-radius: 0.6rem;
  width: 52rem;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }

  .textBlock {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    .title {
      font-size: 2.3rem;
      margin-bottom: 2.5rem;
      font-weight: bold;
      font-family: lato;
    }

    .author {
      font-size: 1.5rem;
      font-weight: bold;
      font-family: lato;
    }

    .dateAndLikes {
      font-size: 1.5rem;
      font-weight: bold;
      font-family: lato;
    }
  }
`;

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  width: 150,
  height: 125,
  objectFit: 'cover',
});

const PostCard = ({
  theme,
  postId,
  postImage,
  postTitle,
  postAuthor,
  postDate,
  stockId,
}) => {
  const router = useRouter();
  const { data } = useQuery(['stock', stockId], api.stock.getId(stockId));
  const { agreeCount, disagreeCount } = useVoteData(postId);

  return (
    <PostWrapper theme={theme} onClick={() => router.push(`/ideas/${postId}`)}>
      <div className='image'>
        <Img alt='complex' src={postImage} />
      </div>

      <div className='textBlock'>
        <div className='title'>{postTitle}</div>
        <div className='author'>
          by {postAuthor} . {timeAgo.format(new Date(postDate))}
        </div>
        <Tag>{data?.name}</Tag>
        <div>
          agree : {agreeCount} disagree: {disagreeCount}
        </div>
      </div>
    </PostWrapper>
  );
};

export default PostCard;
