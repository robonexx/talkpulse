import { useState } from 'react';
import { HiOutlineChatBubbleLeftRight, HiPencilSquare } from 'react-icons/hi2';

import { timeAgo } from '../../../utils/timeAgo';
import auth from '../../../lib/auth';
import { User } from '../../../types/types';
import UpdateComment from '../../../routes/UpdateComment'
import DeleteComment from '../../DeleteComment/DeleteComment';
import CommentVotes from '../../Votes/CommentVotes';

import Reply from '../Reply';

import styles from './Comment.module.scss';

type ReplyTypes = {
  reply: string;
  author: { username: string };
  createdAt: string;
  upvote: number;
  downvote: number;
  id: string;
  parentCommentId: string;
};

interface CommentProps {
  key: string;
  commentId: string;
  body: string;
  author: string | undefined;
  createdAt: string;
  replies?: ReplyTypes[] | undefined;
  user: User | undefined;
  postId: string;
  score: number;
}

const Comment: React.FC<CommentProps> = ({
  body,
  author,
  createdAt,
  user,
  postId,
  commentId,
  score
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const isAuthor = auth.isSignedIn() && user && author === user.username;

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  const handleUpdateClick = () => {
    setIsUpdateMode((prev) => !prev);
  };

  return (
    <div className={styles.comment}>
      <header className={styles['comment-header']}>
        <p>Author: {author && author}</p>
        <div>
        {isAuthor && (
          <>
            <DeleteComment
              path={`/posts/${postId}/comments/${commentId}/delete`}
            />
            <span className={styles.icon}>
              <HiPencilSquare onClick={handleUpdateClick} />
            </span>
          </>
        )}
        <p>
          <time dateTime={createdAt}>{timeAgo(createdAt)}</time>
        </p>
        </div>
      </header>
      {isUpdateMode ? (
        <UpdateComment body={body} postId={postId} commentId={commentId} />
      ) : (
        <p className={styles.text}>{body}</p>
      )}
      <footer>
      {commentId ? (
          <CommentVotes commentId={commentId} postId={postId} score={score} />
            ) : (
              <div></div>
            )}
        <span className={styles.reply}>reply </span>
        <span className={styles.icon} onClick={toggleReplies}>
          <HiOutlineChatBubbleLeftRight />
        </span>
      </footer>
      {showReplies && (
        <div className={styles.replies}>
          {replies?.map((reply) => (
            <Reply key={reply.id} {...reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;

const replies: ReplyTypes[] = [
  {
    reply: 'Just mock reply comments.',
    author: { username: 'replyUser1' },
    createdAt: '2023-01-02',
    upvote: 5,
    downvote: 0,
    id: 'r1',
    parentCommentId: '1',
  },

  {
    reply: 'Future ideas for further development... ',
    author: { username: 'replyUser5' },
    createdAt: '2023-01-04',
    upvote: 25,
    downvote: 4,
    id: 'r2',
    parentCommentId: '1',
  },
];
