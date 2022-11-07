import React, { useEffect, useState, Fragment } from 'react';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { useUser } from '@auth0/nextjs-auth0';
import './Comment.module.css';
import axios from 'axios';
import styled from '@emotion/styled';
import UserIcon from './UserIcon';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const CommentBlock = styled.div`
  display: flex;
  padding: 0.6rem;
  justify-content: space-between;

  .profile {
    display: flex;
  }

  .picture {
    margin-right: 3rem;
  }

  .userInfo {
    display: flex;
    flex-direction: column;
  }

  .comment-name {
    font-weight: bold;
    font-size: 2.8rem;
  }

  .comment-content {
    font-size: 2.4rem;
  }

  .comment-time {
    font-size: 2.4rem;
  }

  .heart {
    display: flex;
    align-items: center;
    margin-right: 1rem;

    svg {
      width: 4rem;
      height: 4rem;
    }
  }
`;

const Comment = ({ commentJSON }) => {
  const [username, setUsername] = useState('');
  const [investorProfilePicture, setInvestorProfilePicture] = useState('');
  const [likes, setLikes] = useState(0);
  var uid = '';
  const { user, error, isLoading } = useUser();

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    if (checked == false) {
      setChecked(true);
      setLikes(commentJSON.likes.length);
    } else {
      setChecked(false);
      setLikes(commentJSON.likes.length);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('email');
    const getUser = async () => {
      const likesList = commentJSON.likes;

      var userResponse = await fetch(
        `http://localhost:4000/api/v1/user/${email}/email`
      );
      var userData = await userResponse.json();
      var userIdString = String(userData._id);
      uid = userIdString;
      var isLiked = false;

      for (var i = 0; i < likesList.length; i++) {
        var userId = String(likesList[i]);
        if (userId == uid) {
          isLiked = true;
        }
      }

      if (isLiked == true) {
        setLikes(commentJSON.likes.length);
        setChecked(true);
      } else {
        setLikes(commentJSON.likes.length);
        setChecked(false);
      }

      const response = await fetch(
        `http://localhost:4000/api/v1/user/${commentJSON.userId}`
      );
      const data = await response.json();
      setUsername(data.username);
      setInvestorProfilePicture(data.profile_image_url);
    };
    getUser();
  }, []);

  const callLikesApi = async () => {
    const commentId = String(commentJSON._id);

    var userResponse = await fetch(
      `http://localhost:4000/api/v1/user/${user.email}/email`
    );
    var userData = await userResponse.json();
    var userIdString = String(userData._id);
    uid = userIdString;

    if (checked == false) {
      const response = await axios.put(
        `http://localhost:4000/api/v1/investor/update/likes/comment/${commentId}/${uid}`,
        {}
      );
      setLikes(response.data.likes.length);
      setChecked(!checked);
    } else {
      const response = await axios.put(
        `http://localhost:4000/api/v1/investor/update/likes/comment/${commentId}/${uid}`,
        {}
      );
      setLikes(response.data.likes.length);
      setChecked(!checked);
    }
  };

  return (
    <CommentBlock>
      <div className='profile'>
        <div className='picture'>
          <UserIcon src={investorProfilePicture}></UserIcon>
        </div>

        <div className='userInfo'>
          <div className='comment-name'>{username}</div>

          <div className='comment-content'>{commentJSON.content}</div>

          <div className='comment-time'>
            {timeAgo.format(new Date(commentJSON.timeStamp))} | {likes} Likes
          </div>
        </div>
      </div>

      <div
        className='heart'
        onClick={() => {
          handleChange();
          callLikesApi();
        }}
      >
        {checked ? <Favorite /> : <FavoriteBorder />}
      </div>
    </CommentBlock>
  );
};

export default Comment;
