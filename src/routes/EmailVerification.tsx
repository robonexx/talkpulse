import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, redirect, ActionFunctionArgs } from 'react-router-dom';

export const action = async (args: ActionFunctionArgs) => {
  try {
    const { username, token } = args.params;

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/verifyAccount/${username}/${token}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const { message } = await response.json();
      return { message };
    }

    return redirect('/');
  } catch (error) {
    console.error('Error verifying email:', error);
    return { message: 'An error occurred while verifying your email' };
  }
};

const EmailVerification: React.FC = () => {
  const params = useParams<{ username: string; token: string }>();
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const result = await action({ params: { ...params }, request: new Request('') });

        if ('message' in result) {
          setError(result.message);
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setError('Could not verify your account: an error occurred');
      }
    };

    if (params && params.username && params.token) {
      verifyEmail();
    }
  }, [params]);

  useEffect(() => {
    if (isValid) {
      navigate('/sign-in');
    }
  }, [isValid, navigate]);

  return (
    <div>
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          {isValid ? (
            <div>
              <p>Email has been verified</p>
              <br />
              <Link to='/sign-in'>Go to Sign In</Link>
            </div>
          ) : (
            <p>Verifying...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
