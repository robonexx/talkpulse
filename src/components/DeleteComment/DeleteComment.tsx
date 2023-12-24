import {
    Form,
    ActionFunctionArgs,
    redirect,
    useLocation,
  } from 'react-router-dom';
  import auth from '../../lib/auth';
  import { HiOutlineTrash } from 'react-icons/hi2';
  
  import styles from './DeleteComment.module.scss';
  
  export const action = async (args: ActionFunctionArgs) => {
    const { postId } = args.params;
    const { commentId } = args.params;
  
    const formData = await args.request.formData();
  
    const response = await fetch(
      import.meta.env.VITE_SERVER_URL + `/posts/${postId}/comments/${commentId}/delete`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getJWT()}`,
        },
      }
    );
  
    if (!response.ok) {
      const { message } = await response.json();
      return { message };
    }
  
    return redirect(formData.get('returnTo')?.toString() || '/');
  };
  
const DeleteComment = ({ path }: { path: string }) => {
      
    const location = useLocation()
  
    return (
      <div className={styles.delete}>
        <Form method='DELETE' action={path}>
          <input
            type='hidden'
            name='returnTo'
            value={location.pathname + location.search}
          />
          <button type='submit'>
            <HiOutlineTrash />
          </button>
        </Form>
      </div>
    );
  };
  
  export default DeleteComment;
  