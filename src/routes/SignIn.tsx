import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
} from 'react-router-dom';
import auth from '../lib/auth';

import styles from './SignUp.module.scss';
import Input from '../components/Input';

export const action = async (args: ActionFunctionArgs) => {
  const { request } = args;

  const formData = await request.formData();

  const username = formData.get('username');
  const password = formData.get('password');

  const response = await fetch(import.meta.env.VITE_SERVER_URL + '/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const { message } = await response.json();

    return { message };
  }

  const { token } = await response.json();
  console.log(token);
  auth.signIn(token);

  return redirect('/');
};

const SignIn = () => {
  const error = useActionData() as { message: string } | undefined;
  return (
    <div className={styles['sign-up']}>
      <h2>Sign-in</h2>
      <Form method='post' className={styles.form}>
        {error && (
          <p>
            <b>Error:</b> {error.message}
          </p>
        )}
        <label htmlFor='username'>Username</label>
        <Input
          type='text'
          name='username'
          /*  value='Username' */
          id='username'
          placeholder='Username'
          error={false}
          /*  onChange={onChangeHandler} */
          required={true}
        />
        <label htmlFor='password'>Password</label>
        <Input
          type='password'
          name='password'
          /* value='somevalue' */
          id='password'
          placeholder='Password'
          error={false}
          /*  onChange={onChangeHandler} */
          required={true}
        />
        <button type='submit'>Login</button>
      </Form>
      <div className={styles['register-link']}>
        <p>
          Dont't have an account? <a href='#'>Register</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
