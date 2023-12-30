import { useState, useEffect } from 'react';

const useContextMenu = ({ onOpen }: any = {}) => {
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

  const handleContextMenuOpen = (e: any) => {
    setVisible(true);
    if (onOpen) {
      onOpen({
        x: e.pageX,
        y: e.pageY,
      });
      return;
    }
    setPoints({
      x: e.pageX,
      y: e.pageY,
    });
  };

  return {
    visible,
    setVisible,
    points,
    setPoints,
    onContextMenuOpen: handleContextMenuOpen,
  };
};

export default useContextMenu;
