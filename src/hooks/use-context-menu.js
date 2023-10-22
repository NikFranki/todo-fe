import { useState, useEffect } from "react";

const useContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const handleClick = () => setVisible(false);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return {
    visible,
    setVisible,
    points,
    setPoints,
  };
};

export default useContextMenu;