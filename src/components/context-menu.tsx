import React from 'react';
import { Menu } from 'antd';

const ContextMenu = (props: any) => {
  const {
    items,
    visible,
    points: { x, y },
    onMenuClick,
  } = props;

  const handleMenuClick = async (e: any) => {
    onMenuClick?.(e);
  };

  return (
    visible && (
      <Menu
        onClick={handleMenuClick}
        className="context-menu-wrapper"
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