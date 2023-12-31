import {useState} from 'react'
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
import { RiImageAddFill } from 'react-icons/ri';

import styles from './CreatePost.module.scss';
import TextArea from '../components/TextArea';

export const action = async (args: ActionFunctionArgs) => {
  try {
    const { request } = args;
    const formData = await request.formData();

    // Add / append the image file to the FormData
    const imageInput = formData.get('image') as FileList | null;

    if (imageInput) {
      const imageFile = imageInput[0];

      // checking image file type
      console.log('Type of imageFile:', typeof imageFile);
    } else {
      console.log('No image added to FormData.');
    }

    const response = await fetch(import.meta.env.VITE_SERVER_URL + '/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.getJWT()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating post:', errorData);
      return { error: 'Failed to create post' };
    }

    console.log('Post created successfully!');
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const cancelCreate = () => {
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Add preview functionality here
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use reader.result for the preview
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles['create-post']}>
      <h2>Create post</h2>
      <Form
        method='post'
        className={styles['form']}
        encType='multipart/form-data'
      >
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
        <label htmlFor='image' className={styles['image-label']}>
          <RiImageAddFill className={styles.icon} /> Image (optional)
        </label>
        <input
          className={styles['input-image-wrapper']}
          type='file'
          name='image'
          id='image'
          accept='image/*'
          onChange={handleImageChange}
        />
            {imagePreview && (
          <div className={styles['image-container']}>
            <p>Image Preview:</p>
            <img src={imagePreview} alt='Image Preview' />
          </div>
        )}
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
