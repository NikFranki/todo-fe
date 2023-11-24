import React from 'react';

import { useDrop } from 'react-dnd';
import update from 'immutability-helper';

import { ItemTypes } from '@constant/index';

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
    (id, atIndex) => {
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
        };
        return <ListItem key={listItem.id} {...listItemProps} />;
      })}
    </div>
  );
};

export default List;
