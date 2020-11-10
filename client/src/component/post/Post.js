import React, { useState, useEffect } from "react";
import "./Post.css";
import CircleIcon from "../circle-Img/CircleIcon";
import FaceBookUserName from "../facebook-username/FaceBookUserName";
import PostDate from "../date/PostDate";
import PostButton from "../post-button/PostButton";
import PostComment from "../post-comment/PostComment";
import WriteNewComment from "../write-new-comment/WriteNewComment";
import DataService from "../../db-connection/DataService";
import PostStatics from '../post-statics/PostStatics';

const Post = ({ id, firstName, lastName, path, userAvatar , userPath }) => {
  //post info
  const [message , setMassege ] = useState("")
  const [time , setTime] = useState("0000-00-00T00:00:00")
  const [likes , setLikes] = useState([])
  const [commentsArr, setCommentsArr] = useState([]);

  //set new like or comment
  
  const [newComment, setNewComment] = useState("");
  const [newLike, setNewLike] = useState("");
  const [currentPick , setCurrentPick] = useState("");


  //change emoji reaction
  const updateDBwithNewLikeSelected = (value) => {
    setNewLike(value);
  }

  const setPostInfo = (postData) => {
    setMassege(postData.message);
    setTime(postData.createdAt);
    setLikes(postData.likes);
  }

  useEffect(() => {
    let currentLikePick = '';
    if(likes.length){
      currentLikePick = likes.find(like =>  like.owner === userPath)
    }
    currentLikePick ? setCurrentPick(currentLikePick.reaction) : setCurrentPick('');
  }, [likes]);

  const getData = async () => {
    const postData = await DataService.get(`facebook-post/get-post/${id}`);
    setPostInfo(postData.data);
    const postCommentsArr = await DataService.get(`facebook-post/post/${id}`);
    setCommentsArr(postCommentsArr.data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (newComment) {
      const setData = async () => {
        await DataService.patch(`facebook-comment/${id}`, newComment);
        setNewComment('');
        await getData();
      };
      setData();
    }
  }, [newComment]);


  useEffect(() => {
    if (newLike) {
      const data = {
        owner:userPath
      }
      const setData = async () => {
        await DataService.patch(`facebook-post/${id}/${newLike}`, data).then(() => getData());
        setNewLike("");
      };
      setData();
    }
  }, [newLike]);


  let postComments = [];
  if (commentsArr.length) {
    postComments = commentsArr.map((comment) => {
      return (
        <PostComment
          commentPath={comment.myPost.owner}
          key={comment.myPost._id}
          id={comment.myPost._id}
          firstName={comment.userDataPost.first_name}
          lastName={comment.userDataPost.last_name}
          userAvatar={comment.userDataPost.avatar}
          message={comment.myPost.message}
          comments={comment.myPost.comments}
          time={comment.myPost.createdAt}
          likes={comment.myPost.likes}
        />
      );
    });
  }


  const updateNewComment = async (value) => {
    const dataFormat = {
      owner: path,
      message: value,
    };
    setNewComment(dataFormat);
  };

  return (
    <div className="Post">
      <div className="post-header">
        <CircleIcon srcIcon={userAvatar} />
        <div className="PostHeaderUserInfo">
          <FaceBookUserName
            firstName={firstName}
            lastName={lastName}
            path={path}
          />
          <PostDate time={time} />
        </div>
      </div>
      <p>{message}</p>
      {(commentsArr.length || likes.length) ? <PostStatics comments={commentsArr} likes={likes}/> : <></>}
      <div className="PostBtnContainer">
        <PostButton info="Like" icon="far fa-thumbs-up" emojiPicked={currentPick} hoverOption="like" updateWithNewLike={(like) => updateDBwithNewLikeSelected(like)}/>
        <PostButton info="Comment" icon="far fa-comment-alt" />
        <PostButton
          info="Share"
          icon="fas fa-share"
          hoverOption="commingsoon"
        />
      </div>
      {postComments}
      <WriteNewComment
        userAvatar={userAvatar}
        updateNewComment={(e) => updateNewComment(e)}
      />
    </div>
  );
};

export default Post;
