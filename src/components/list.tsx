import React from 'react';

import { useDrop } from 'react-dnd';
import update from 'immutability-helper';

import { ItemTypes, FIXED_LIST_ITEM_TASKS } from '@constant/index';
import { updateListByDragAndDrop } from '@api/list';

import ListItem from './list-item';
import { ListItemType } from '@/types/list-api';

interface PropsType {
  sbotherList: ListItemType[];
  editInfo: {
    editable: boolean;
    clikedId: number;
    reListName: string;
  };
  handleListItemClick: (item: ListItemType) => void;
  handleContextMenu: (e: React.MouseEvent<HTMLLIElement | HTMLDivElement, MouseEvent>, item: ListItemType) => void;
  handleReListNameEnter: (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, item: ListItemType) => Promise<void>;
  setEditInfo: React.Dispatch<React.SetStateAction<{
    editable: boolean;
    clikedId: number;
    reListName: string;
  }>>;
  setSbotherlist: React.Dispatch<React.SetStateAction<ListItemType[]>>;
}

const List = (props: PropsType) => {
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
    (id: number) => {
      const card = sbotherList.filter((c) => c.id === id)[0];
      return {
        card,
        index: sbotherList.indexOf(card),
      };
    },
    [sbotherList]
  );
  const moveCard = React.useCallback(
    async (id: number, atIndex: number) => {
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
    async (prevIndex: number, currIndex: number) => {
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
