import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { Checkbox, FormControlLabel } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { Avatar, Grid, Paper } from "@material-ui/core";
import { useUser } from "@auth0/nextjs-auth0";
import "./Comment.module.css";
import axios from "axios";
import styled from "styled-components";

const CommentBlock = styled.div`
  display: flex;
  padding: 0.6rem;
  justify-content: space-between;

  .profile {
    display: flex;
  }

  .picture img {
    width: 10rem;
    height: 10rem;
    border-radius: 5rem;
    margin-right: 3rem;
  }

  .userInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .name {
    font-weight: bold;
    font-size: 1.8rem;
  }

  .heart {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }
`;

const Comment = (props) => {
  const [username, setUsername] = useState("");
  const [investorProfilePicture, setInvestorProfilePicture] = useState("");
  const [likes, setLikes] = useState(0);
  var uid = "";
  const { user, error, isLoading } = useUser();

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    if (checked == false) {
      setChecked(true);
      setLikes(props.commentJSON.likes.length);
    } else {
      setChecked(false);
      setLikes(props.commentJSON.likes.length);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const getUser = async () => {
      const likesList = props.commentJSON.likes;

      var userResponse = await fetch(
        `http://localhost:4000/api/v1/investor/fetch/user/${email}`
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
        setLikes(props.commentJSON.likes.length);
        setChecked(true);
      } else {
        setLikes(props.commentJSON.likes.length);
        setChecked(false);
      }

      const response = await fetch(
        `http://localhost:4000/api/v1/investor/fetch/userprofile/${props.commentJSON.userId}`
      );
      const data = await response.json();
      setUsername(data.username);
      setInvestorProfilePicture(data.profile_image_url);
      console.log("data.profile", data.profile_image_url);
      console.log("data", data);
    };
    getUser();
  }, []);

  const callLikesApi = async () => {
    const commentId = String(props.commentJSON._id);

    var userResponse = await fetch(
      `http://localhost:4000/api/v1/investor/fetch/user/${user.email}`
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
      <div className="profile">
        <div className="picture">
          <img src={investorProfilePicture}></img>
        </div>

        <div className="userInfo">
          <div className="name">{username}</div>

          <div className="content">{props.commentJSON.content}</div>

          <div className="time">
            {props.commentJSON.timeStamp} | {likes} Likes
          </div>
        </div>
      </div>

      <div
        className="heart"
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

{
  /* <Paper>
        <div item>
          <img src={investorProfilePicture} />
        </div>
        <div container>
          <h4 style={{ margin: 0, textAlign: "left" }}>{username}</h4>
          <p style={{ textAlign: "left" }}>{props.commentJSON.content} </p>
          <p style={{ textAlign: "left", color: "gray" }}>
            {props.commentJSON.timeStamp}{" "}
            <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment> {likes} Likes{" "}
            <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>
            <FormControlLabel
              label=""
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  onClick={() => callLikesApi()}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                />
              }
            />
          </p>
        </div>
      </Paper> */
}
