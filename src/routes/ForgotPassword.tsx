import {
  Form,
  ActionFunctionArgs,
  useActionData,
  redirect,
} from 'react-router-dom';

import styles from './ForgotPassword.module.scss';
import { ActionData } from '../types/types';

export const action = async (args: ActionFunctionArgs) => {
  const { request } = args;
  try {
    const formData = await request.formData();
    const email = formData.get('email');

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/forgotpassword`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const { message } = await response.json();
      return { message };
    }

    return redirect(`/`);
  } catch (error) {
    console.error('Error during password reset request:', error);
    return { message: 'An error occurred while processing your request' };
  }
};

const ForgotPassword: React.FC = () => {
  const error = useActionData() as ActionData;

  return (
    <div className={styles.resetform}>
      <h2>Forgot your password? fill in your email and we'll send and reset link</h2>
      <Form method='post' action={`/forgot-password`} className={styles.form}>
        {error && (
          <p>
            <b>Error: </b> {error.message}
          </p>
        )}
        <div className={styles['input-wrapper']}>
          <input
            type='email'
            id='email'
            name='email'
            required
            placeholder='Email'
          />
        </div>
        <button type='submit'>Reset Password</button>
      </Form>
    </div>
  );
};

export default ForgotPassword;

/* 
<div>
            <p>Password reset email sent successfully</p>
            <p>
              Check your email for further instructions or{' '}
              <Link to='/sign-in'>sign in</Link>.
            </p>
          </div>

*/
