import { FC } from 'react';
import styles from './Input.module.scss';

interface InputProps {
  type: 'text' | 'number' | 'email' | 'password';
  name: string;
  /* value: string | number; */
  placeholder: string;
  id: string;
  error: boolean;
  disabled?: boolean;
  required: boolean;
 /*  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; */
}

const Input: FC<InputProps> = ({
  type,
 /*  value, */
  name,
  placeholder,
  error,
  disabled,
  id,
  required,
 /*  onChange, */
}) => {
  return (
    <div className={styles['input-wrapper']}>
      {/*       <label
        htmlFor={label}
        className={styles.label}
      >
        {label}
      </label> */}
      <input
        type={type}
       /*  value={value} */
        name={name}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
       /*  onChange={onChange} */
        required={required}
      ></input>
      {error && <p className={styles.error}>This field can't be empty</p>}
    </div>
  );
};

export default Input;
