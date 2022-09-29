import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import styled from 'styled-components';

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

  .image {
  }

  .textBlock {
    padding: 1rem;
  }

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

  /* background-color: ${({ theme }) =>
    theme.palette.mode === 'dark' ? '#1A2027' : '#fff'}; */
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
  postImage,
  postTitle,
  postAuthor,
  postDate,
  postLikes,
}) => {
  return (
    <PostWrapper theme={theme}>
      <div className='image'>
        <Img alt='complex' src={postImage} />
      </div>

      <div className='textBlock'>
        <div className='title'>{postTitle}</div>
        <div className='author'>{postAuthor}</div>
        <div className='dateAndLikes'>
          {postDate} | {postLikes} Likes
        </div>
      </div>
    </PostWrapper>
  );
};

export default PostCard;
