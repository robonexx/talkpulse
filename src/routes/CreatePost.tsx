import { useState, useEffect } from 'react';
import {
  ActionFunctionArgs,
  useActionData,
  Form,
  useNavigate,
} from 'react-router-dom';
import { RiImageAddFill } from 'react-icons/ri';

import auth from '../lib/auth';
import { ActionData } from '../types/types';
import Input from '../components/Input';
import TextArea from '../components/TextArea';

import Notification from '../components/notification/Notification';

import styles from './CreatePost.module.scss';

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
      return errorData;
    }

    const responseData = await response.json();
    console.log('Post created successfully!', responseData);

    return responseData;
  } catch (error) {
    console.error('Unexpected error during post creation:', error);
    return { error: 'Unexpected error occurred' };
  }
};

const CreatePost = () => {
  const data = useActionData() as ActionData;
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const cancelCreate = () => {
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview image funcationality
      const reader = new FileReader();
      reader.onloadend = () => {
        // Using the reader.result for the preview of the image
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // using a time out to navigate after the post is created
  // needs fixing to not redirect on error...
  useEffect(() => {
    if (data) {
      const timeoutId = setTimeout(() => {
        navigate(`/`);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [data, navigate]);

  return (
    <div className={styles['create-post']}>
      <h2>Create post</h2>
      {data && <Notification message={data.message} />}
      <Form
        method='post'
        className={styles['form']}
        encType='multipart/form-data'
      >
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
          <button type='submit'>Create</button>{' '}
          <button type='button' onClick={cancelCreate}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
};

export default CreatePost;
