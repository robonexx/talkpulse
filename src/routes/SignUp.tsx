import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from 'react-router-dom';
import Input from '../components/Input';

import styles from './SignUp.module.scss';
import { ActionData } from '../types/types';

export const action = async (args: ActionFunctionArgs) => {
  const { request } = args;

  const formData = await request.formData();

  const username = formData.get('username');
  const password = formData.get('password');
  const email = formData.get('email');
  const invite = formData.get('invite');
  const passwordConfirmation = formData.get('password_confirmation');

  if (password !== passwordConfirmation) {
    return { message: "Passwords don't match" };
  }

  const response = await fetch(import.meta.env.VITE_SERVER_URL + '/signup', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ username, password, email, invite }),
  });

  if (!response.ok) {
    const { message } = await response.json();

    return { message };
  }

  return redirect('/sign-in');
};

const SingUp = () => {
  const error = useActionData() as ActionData;
  return (
    <div className={styles['sign-up']}>
      <h2>Sign-up</h2>
      <Form method='post' className={styles['form']}>
        {error && (
          <p>
            <b>Error: </b> {error.message}
          </p>
        )}
        <label htmlFor='username'>Username</label>
        <Input
          type='text'
          name='username'
          id='username'
          placeholder='Username'
          error={false}
          required
        />
        <label htmlFor='email'>Email</label>
        <Input
          type='email'
          name='email'
          /*  value='' */
          id='email'
          placeholder='Email'
          error={false}
          /*  onChange={onChangeHandler} */
          required={true}
        />
        <label htmlFor='password'>Password</label>
        <Input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          error={false}
          required={true}
        />
        <label htmlFor='password_confirm'>Confirm password</label>
        <Input
          type='password'
          id='password_confirmation'
          name='password_confirmation'
          placeholder='Confirm Password'
          error={false}
          required={true}
        />
        <button type='submit'>Create account</button>
      </Form>
      <div className={styles['register-link']}>
        <p>
          Already have an account? <Link to='/sign-in'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SingUp;
