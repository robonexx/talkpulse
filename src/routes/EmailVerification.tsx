import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const params = useParams<string>();
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const verifyEmail = (username: string, token: string) => {
    console.log(
      `username ${username} + token: ${token}, just for testing purpose`
    );

    console.log('usernameAndToken:', username, token)
    axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/verifyAccount/${username}/${token}`
      )
      .then((resp) => {
        if (resp.status === 200) {
          setIsValid(true);
        } else {
          setError('Could not verify your account: email or token is no longer valid');
        }
      })
      .catch((error) => {
        console.error('Error verifying email:', error);
        setError('Could not verify your account: an error occurred');
      });
  };

  useEffect(() => {
    if (params && params.username && params.token) {
      verifyEmail(params.username, params.token);
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