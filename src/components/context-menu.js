import React from 'react';
import { Menu } from 'antd';

const ContextMenu = (props) => {
  const {
    items,
    visible,
    points: { x, y },
    onMenuClick,
  } = props;

  const handleMenuClick = async (e) => {
    onMenuClick?.(e);
  };

  return (
    visible && (
      <Menu
        onClick={handleMenuClick}
        style={{
          position: 'fixed',
          left: x,
          top: y,
          zIndex: 1,
          width: 256,
        }}
        mode="vertical"
        items={items}
      />
    )
  );
};

export default ContextMenu;
