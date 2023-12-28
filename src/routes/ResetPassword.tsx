import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActionFunctionArgs, Form, redirect } from 'react-router-dom';

import styles from './ResetPassword.module.scss';

export const action = async (args: ActionFunctionArgs) => {
  const { request } = args;
  try {
    const formData = await request.formData();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      return { message: "Passwords don't match" };
    }

    const { email, token } = args.params;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/resetpassword`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, newPassword: password }),
      }
    );

    if (!response.ok) {
      const { message } = await response.json();
      return { message };
    }

    return redirect('/sign-in');
  } catch (error) {
    console.error('Error during password reset:', error);
    return { message: 'An error occurred while processing your request' };
  }
};

const ResetPassword: React.FC = () => {
  const params = useParams<{ email: string; token: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles['reset-password']}>
      <h2>Reset Password</h2>
      <Form
        method='post'
        action={`/reset-password/${params.email}/${params.token}`}
      >
        {error && <p>{error}</p>}
        <label htmlFor='password'>New Password</label>
        <input type='password' name='password' id='password' required />
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          required
        />
        <button type='submit'>Reset Password</button>
      </Form>
    </div>
  );
};

export default ResetPassword;
