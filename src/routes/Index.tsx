import { useState, useEffect } from 'react';
import { Post } from '../types/types';
import PostItem from '../components/Post/PostItem';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import Pagination from '../components/Pagination/Pagination';
import auth from '../lib/auth';
import Notification from '../components/notification/Notification';

import styles from './Index.module.scss';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 1;

  const response = await fetch(
    import.meta.env.VITE_SERVER_URL + `/posts/?page=${page}`,
    {
      headers: {
        Accepts: 'application/json',
      },
    }
  );

  const backendResponse = await response.json();

  return { page, ...backendResponse };
};

const Index = () => {
  const data = useLoaderData() as {
    posts: Post[];
    totalPages: number;
    page: number;
  };
  /* const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(auth.isSignedIn()); */
  const [searchParams, setSearchParams] = useSearchParams();

  const isUserSignedIn = auth.isSignedIn()

  return (
    <div className={styles.Index}>
      {isUserSignedIn ? (
        <>
         <div></div>
        </>
      ) : (
        <Notification message="Please sign in to create posts." />
      )}
      {data?.posts.map((post) => (
        <div key={post._id} className={styles['post-item-wrapper']}>
          <div className={styles.border}></div>
          <PostItem post={post} />
        </div>
      ))}
      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        setPage={(page) =>
          setSearchParams({ ...searchParams, page: page.toString() })
        }
      />
    </div>
  );
};

export default Index;
