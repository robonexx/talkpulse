import { Link } from 'react-router-dom';
import { Post } from '../../types/types';
import styles from './Post.module.scss';
import { timeAgo } from '../../utils/timeAgo';

const PostItem = ({ post }: { post: Post }) => {
  return (
    <div className={styles.post}>
      <header>
        <p>
          <span>Author:</span> {post.author?.username}
        </p>
        <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time>
      </header>
      {post && (
        <div className={styles['post-info']}>
          {post.link ? (
            <Link to={post.link} target='_blank' rel='noopener noreferrer'>
              <h2>
                {post.title}
                <br />
                <span>({post.link})</span>
              </h2>
            </Link>
          ) : (
            <Link to={`/posts/${post._id}`}>
              <h2>{post.title}</h2>
            </Link>
          )}
          <section>
            <p>{post.body}</p>
          </section>
          <div className={styles.link}>
            <Link to={`/posts/${post._id}`}>View full post</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;
