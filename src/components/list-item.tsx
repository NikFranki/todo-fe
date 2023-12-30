import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Input } from 'antd';

import { ItemTypes } from '@constant/index';
import listSvg from '@assets/images/list.svg';

const ListItem = (props: any) => {
  const {
    listItem,
    editInfo,
    handleListItemClick,
    handleContextMenu,
    handleReListNameEnter,
    setEditInfo,
    moveCard,
    findCard,
    moveEnd,
  } = props;

  const id = listItem.id;
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }: { id: any }) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
      drop(item: any) {
        moveEnd(item.originalIndex, originalIndex);
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }) as any,
    [findCard, moveCard]
  );
  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity }}
      className="list-item"
      onClick={() => handleListItemClick(listItem)}
      onContextMenu={(e) => handleContextMenu(e, listItem)}
    >
      <div className="icon-text">
        <img src={listSvg} />
        {editInfo.editable && listItem.id === editInfo.clikedId ? (
          <Input
            className="edit-list-name"
            placeholder="Please input list name"
            value={editInfo.reListName}
            autoFocus
            onBlur={(e) => handleReListNameEnter(e, listItem)}
            onChange={(e) => {
              setEditInfo({
                ...editInfo,
                reListName: e.target.value,
              });
            }}
            onPressEnter={(e) => handleReListNameEnter(e, listItem)}
          />
        ) : (
          <span className="text">{listItem.name}</span>
        )}
      </div>
      <span className="number">{listItem.number}</span>
    </div>
  );
};

export default ListItem;