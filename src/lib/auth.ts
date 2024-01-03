import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token: string | null) => {
    if (!token) {
      return true;
    }
  
    try {
      const decodedToken: { exp: number } = jwtDecode(token) as { exp: number };
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

const signIn = (jwt: string) => {
    localStorage.setItem('pulse-jwt', jwt);
}

const isSignedIn = () => {
    const jwt = localStorage.getItem('pulse-jwt');
    return !!jwt && !isTokenExpired(jwt);
  };

  const getJWT = () => {
    const jwt = localStorage.getItem('pulse-jwt');
    return isTokenExpired(jwt) ? null : jwt;
  };

const signOut = () => localStorage.removeItem('pulse-jwt');



export default {
    signIn,
    signOut,
    isSignedIn,
    getJWT
}