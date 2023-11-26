import React from 'react';

import { useDrop } from 'react-dnd';
import update from 'immutability-helper';

import { ItemTypes, FIXED_LIST_ITEM_TASKS } from '@constant/index';
import { updateListByDragAndDrop } from '@api/list';

import ListItem from './list-item';

const List = (props) => {
  const {
    sbotherList,
    editInfo,
    handleListItemClick,
    handleContextMenu,
    handleReListNameEnter,
    setEditInfo,
    setSbotherlist,
  } = props;

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));

  const findCard = React.useCallback(
    (id) => {
      const card = sbotherList.filter((c) => c.id === id)[0];
      return {
        card,
        index: sbotherList.indexOf(card),
      };
    },
    [sbotherList]
  );
  const moveCard = React.useCallback(
    async (id, atIndex) => {
      const { card, index } = findCard(id);
      setSbotherlist(
        update(sbotherList, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, sbotherList, setSbotherlist]
  );
  const moveEnd = React.useCallback(
    async (prevIndex, currIndex) => {
      const startIndex = Math.min(prevIndex, currIndex);
      const endIndex = Math.max(prevIndex, currIndex);
      const newSBotherList = sbotherList
        .slice(startIndex, endIndex + 1)
        .map((item, index) => {
          // due to fixed list, it has 5 five items, so here shoule be started with plus 6
          item.index_order = index + startIndex + FIXED_LIST_ITEM_TASKS + 1;
          return item;
        });
      await updateListByDragAndDrop({
        list: newSBotherList,
      });
    },
    [sbotherList]
  );

  return (
    <div ref={drop} className="other-list list-wrapper">
      {sbotherList.map((listItem) => {
        const listItemProps = {
          listItem,
          editInfo,
          handleListItemClick,
          handleContextMenu,
          handleReListNameEnter,
          setEditInfo,
          moveCard,
          findCard,
          moveEnd,
        };
        return <ListItem key={listItem.id} {...listItemProps} />;
      })}
    </div>
  );
};

export default List;
