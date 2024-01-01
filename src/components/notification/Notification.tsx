import React, { useState, useEffect } from 'react';
import styles from './Notification.module.scss';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [message]);

  return isVisible ? (
    <div className={styles.bg}>
      <b className={styles.notification}>{message}</b>
    </div>
  ) : null;
};

export default Notification;
