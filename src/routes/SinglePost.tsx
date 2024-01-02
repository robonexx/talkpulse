import { useState } from 'react';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { HiPencilSquare } from 'react-icons/hi2';

import auth from '../lib/auth';
import { timeAgo } from '../utils/timeAgo';
import { Post, User } from '../types/types';

import ImageContainer from '../components/ImageContainer/ImageContainer';

import Comment from '../components/Comments/Comment/Comment';
import CommentForm from '../components/CommentForm/CommentForm';
import DeletePost from '../components/DeletePost/DeletePost';
import PostVotes from '../components/Votes/PostVotes';

import UpdatePost from './UpdatePost';

import styles from './SinglePost.module.scss';

type SinglePostLoaderData = {
  post: Post;
  user: User;
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { id } = args.params;

  const postResponse = await fetch(
    import.meta.env.VITE_SERVER_URL + '/posts/' + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const userResponse = await fetch(import.meta.env.VITE_SERVER_URL + '/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.getJWT()}`,
    },
  });

  const [postData, userData] = await Promise.all([
    postResponse.json(),
    userResponse.json(),
  ]);

  return { post: postData, user: userData };
};

const SinglePost = () => {
  const [addAComment, setAddAComment] = useState<boolean>(false);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

  const { post, user } = useLoaderData() as SinglePostLoaderData;
  const isAuthor =
    auth.isSignedIn() && user && post.author?.username === user.username;

  const handleCommentSubmit = () => {
    setAddAComment(false);
  };

  const handleUpdateClick = () => {
    setIsUpdateMode(true);
  };

  const handleCloseUpdateForm = () => {
    setIsUpdateMode(false);
  };

  return (
    <>
      {isUpdateMode ? (
        <UpdatePost onClose={handleCloseUpdateForm} />
      ) : (
        <article className={styles.post}>
          <header className={styles['post-header']}>
            <p>
              <span>Author:</span> {post.author?.username}
            </p>
            <div>
              {isAuthor && (
                <>
                  <DeletePost post={post} />
                  <span className={styles.icon}>
                    <HiPencilSquare onClick={handleUpdateClick} />
                  </span>
                </>
              )}
              <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time>
            </div>
          </header>
          <div className={styles['post-info']}>
            {post.link ? (
              <Link to={post.link} target='_blank' rel='noopener noreferrer'>
                <h2>
                  {post.title}
                  <br />
                  <span className={styles['post-link']}>({post.link})</span>
                </h2>
              </Link>
            ) : (
              <h2>{post.title}</h2>
            )}
            {post.image && <ImageContainer imageData={post.image} />}
            {post.body && (
              <section className={styles['post-body']}>
                <p>{post.body}</p>
              </section>
            )}
          </div>
          <footer>
            {post ? <PostVotes post={post} /> : <div></div>}
            <span className={styles['add-comment']}>
              {addAComment ? (
                <>
                  Close comment
                  <HiPencilSquare
                    onClick={() => setAddAComment(false)}
                    className={styles.close}
                  />
                </>
              ) : (
                <>
                  Add comment{' '}
                  <HiPencilSquare
                    onClick={() => setAddAComment(true)}
                    className={styles.open}
                  />
                </>
              )}
            </span>
            {/* <span className={styles.comments}>Check comments: </span>{' '} */}
            {/*  <p className={styles.icon}>
              <HiOutlineChatBubbleLeftRight onClick={handleShowComments} />
            </p> */}
          </footer>
          {addAComment ? (
            <CommentForm postId={post._id} onSubmit={handleCommentSubmit} />
          ) : (
            <div></div>
          )}
          <section className={styles['comments-list']}>
          {post.comments && post.comments.length > 0 ? (
              post.comments
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((comment) => (
                  <Comment
                    key={comment._id}
                    commentId={comment._id}
                    body={comment.body}
                    author={comment?.author?.username}
                    createdAt={comment.createdAt}
                    user={user}
                    postId={post._id}
                    score={comment.score}
                  />
                ))
            ) : (
              <p>Be the first to comment 😊</p>
            )}
          </section>
        </article>
      )}
    </>
  );
};

export default SinglePost;
