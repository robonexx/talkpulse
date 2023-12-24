import { useFetcher, ActionFunctionArgs } from 'react-router-dom';
import styles from './CommentForm.module.scss';
import auth from '../../lib/auth';
import { Post } from '../../types/types';
import { useRef } from 'react';

export const action = async (args: ActionFunctionArgs) => {
  const { postId } = args.params;

  const formData = await args.request.formData();

  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + '/posts/' + postId + '/comments',
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getJWT()}`,
      },
      body: JSON.stringify({ commentBody: formData.get('body') }),
    }
  );

  if (!response.ok) {
    const { message } = await response.json();
    return { message };
  }
  const post = (await response.json()) as Post;
  return {
    comments: post.comments,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CommentForm = ({ postId }: { postId: string }) => {
  const fetcher = useFetcher({ key: 'comment-form-' + postId });
  const textRef = useRef<HTMLTextAreaElement>(null);

  if (fetcher.data && textRef.current) {
    textRef.current.value = '';
  }
  return (
    <div className={styles['comment-form']}>
      <fetcher.Form method='post' action={`/posts/${postId}/comments`}>
        <div className={styles['textarea-wrapper']}>
          <textarea name='body' id='body' required ref={textRef} placeholder='Write a comment...'></textarea>
        </div>
        <button type='submit'>Post comment</button>
      </fetcher.Form>
    </div>
  );
};

export default CommentForm;
