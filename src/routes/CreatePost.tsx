import {
  ActionFunctionArgs,
  useActionData,
  Form,
  redirect,
  useNavigate,
} from 'react-router-dom';
import auth from '../lib/auth';
import { ActionData } from '../types/types';
import Input from '../components/Input';

import styles from './CreatePost.module.scss';
import TextArea from '../components/TextArea';

export const action = async (args: ActionFunctionArgs) => {
  try {
    const { request } = args;
    const formData = await request.formData();
    const postData = Object.fromEntries(formData.entries());

    const response = await fetch(import.meta.env.VITE_SERVER_URL + '/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getJWT()}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating post:', errorData);

      return { error: 'Failed to create post' };
    }
    // Redirect on successful response
    return redirect('/');
  } catch (error) {
    console.error('Unexpected error during post creation:', error);
    return { error: 'Unexpected error occurred' };
  }
};

const CreatePost = () => {
  const error = useActionData() as ActionData;
  const navigate = useNavigate();

  const cancelCreate = () => {
    navigate('/');
  };

  return (
    <div className={styles['create-post']}>
      <h2>Create post</h2>
      <Form method='post' className={styles['form']}>
        {error && (
          <p>
            <b>Error: </b> {error.message}
          </p>
        )}
        <label htmlFor='title'>Title</label>
        <Input
          type='text'
          name='title'
          id='title'
          placeholder='Title'
          error={false}
          required={true}
        />
        <label htmlFor='link'>Link</label>
        <Input
          type='text'
          name='link'
          /*  value='' */
          id='link'
          placeholder='Link'
          error={false}
          /*  onChange={onChangeHandler} */
          required={false}
        />
        <label htmlFor='body'>Content</label>
        <TextArea
          name='body'
          id='body'
          placeholder='Feel free to express yourself'
          error={false}
        />
        <div className={styles.buttons}>
        <button type='submit'>Create post</button>{' '}
        <button type='button' onClick={cancelCreate}>
          Cancel
          </button>
          </div>
      </Form>
    </div>
  );
};

export default CreatePost;
