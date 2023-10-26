import { useState, useEffect } from 'react';

const useContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleClick = () => {
    setVisible(false);
  };

  return {
    visible,
    setVisible,
    points,
    setPoints,
  };
};

export default useContextMenu;
