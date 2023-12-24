import { useState } from 'react';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { HiOutlineChatBubbleLeftRight, HiPencilSquare } from 'react-icons/hi2';

import { Post, User } from '../types/types';
import Comment from '../components/Comments/Comment/Comment';
/* import AddComment from '../components/AddComment/AddComment'; */
import CommentForm from '../components/CommentForm/CommentForm';
import Votes from '../components/Votes/Votes';
import { timeAgo } from '../utils/timeAgo';
import auth from '../lib/auth';
import UpdatePost from '../routes/UpdatePost';
import DeletePost from '../components/DeletePost/DeletePost';

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

  console.log(userData);

  return { post: postData, user: userData };
};

const SinglePost = () => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [addAComment, setAddAComment] = useState<boolean>(false);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);

  const { post, user } = useLoaderData() as SinglePostLoaderData;
  const isAuthor =
    auth.isSignedIn() && user && post.author?.username === user.username;

  const handleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleAddAComment = () => {
    setAddAComment((prev) => !prev);
  };

  const handleUpdateClick = () => {
    setIsUpdateMode(true);
  };

  return (
    <>
      {isUpdateMode ? (
        <UpdatePost post={post} user={user} />
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
            {post.body && (
              <section className={styles['post-body']}>
                <p>{post.body}</p>
              </section>
            )}
          </div>
          <footer>
            <Votes post={post} />
            <span className={styles.reply}>
              Add comment <HiPencilSquare onClick={handleAddAComment} />
            </span>
            <span className={styles.comments}>Check comments: </span>{' '}
            <p className={styles.icon}>
              <HiOutlineChatBubbleLeftRight onClick={handleShowComments} />
            </p>
          </footer>
          {addAComment ? <CommentForm postId={post._id} /> : <div></div>}
          {showComments ? (
            <section className={styles['comments-list']}>
              {post.comments
                ?.slice()
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
                  />
                ))}
            </section>
          ) : (
            <div></div>
          )}
        </article>
      )}
    </>
  );
};

export default SinglePost;
