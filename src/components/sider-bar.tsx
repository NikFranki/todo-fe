import React from 'react';

import Icon from '@ant-design/icons';
import { Space, Input, Divider, Button, InputRef } from 'antd';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MenuInfo } from 'rc-menu/lib/interface';

import _ from 'lodash';

import ContextMenu from '@components/context-menu';
import {
  addList,
  updateList,
  updateListByDragAndDrop,
  deleteList,
} from '@api/list';
import useGlobalContextInfo from '@/hooks/use-global-context-info';
import getItem from '@utils/menu-get-item';
import useContextMenu from '@hooks/use-context-menu';
import { LIST_ICON_MAP } from '@constant/index';

import plusSvg from '@assets/images/plus.svg';

import List from './list';

import './sider-bar.scss';
import { ListItemType } from '@/types/list-api';

const SiderBar = () => {
  const [sbfixedList, setSbfixedlist] = React.useState<ListItemType[]>([]);
  const [sbotherList, setSbotherlist] = React.useState<ListItemType[]>([]);

  const [editInfo, setEditInfo] = React.useState({
    editable: false,
    clikedId: -1,
    reListName: '',
  });

  const { visible, points, onContextMenuOpen } = useContextMenu();

  const {
    list,
    fixedList,
    otherlist,
    searchText,
    listItemInfo,
    onFetchList,
    onFetchTodo,
    onSetListItemInfo,
  } = useGlobalContextInfo();

  const listFactor = list.reduce((acc, prev) => {
    acc += `${prev.id}-${prev.name}-${prev.number}`;
    return acc;
  }, '');
  React.useEffect(() => {
    if (!list.length) return;
    const newFixedList = fixedList.map((item) => {
      return {
        ...item,
        icon: LIST_ICON_MAP[item.id as keyof typeof LIST_ICON_MAP],
      };
    });
    setSbfixedlist(newFixedList);

    setSbotherlist(
      otherlist.map((item) => {
        return _.omit(item, 'icon');
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFactor]);

  const handleFixedItemClick = (item: ListItemType) => {
    onFetchTodo({
      list_id: item.id,
    });
    onSetListItemInfo({
      id: item.id,
      name: item.name,
    });
  };

  const renderFixedList = () => {
    return sbfixedList.map((item) => {
      return (
        <div key={item.id} className="shortcut-menu">
          <Button
            onClick={() => handleFixedItemClick(item)}
            type="link"
            icon={item.icon}
          >
            {item.name}
          </Button>
          <span className="number">{item.number}</span>
        </div>
      );
    });
  };

  const handleListItemClick = (item: ListItemType) => {
    onFetchTodo({
      list_id: item.id,
    });
    onSetListItemInfo({
      id: item.id,
      name: item.name,
    });
  };
  const handleReListNameEnter = async (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, item: ListItemType) => {
    const value = (e.target as HTMLInputElement).value;
    await updateList({ id: item.id, name: value });
    await onFetchList();
    setEditInfo({
      ...editInfo,
      editable: false,
      clikedId: -1,
      reListName: '',
    });
    if (listItemInfo.id === item.id) {
      onSetListItemInfo({
        id: item.id,
        name: value,
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ListItemType) => {
    e.preventDefault();
    onContextMenuOpen(e);

    setEditInfo({
      ...editInfo,
      editable: false,
      clikedId: item.id,
      reListName: item.name,
    });
  };
  const handleMenuClick = async (info: MenuInfo) => {
    if (info.keyPath.includes('delete')) {
      const deletedIndex = list.findIndex(
        (item) => item.id === editInfo.clikedId
      );
      const currentListItem = list[deletedIndex - 1];
      await deleteList({
        id: editInfo.clikedId,
      });
      const deletedIndexOrder = sbotherList.find(
        (item) => item.id === editInfo.clikedId
      )?.index_order as number;
      const newSBotherList = sbotherList
        .slice(deletedIndex - 5 + 1)
        .map((item, index) => {
          item.index_order = index + deletedIndexOrder;
          return item;
        });
      await updateListByDragAndDrop({
        list: newSBotherList,
      });
      await onFetchTodo({
        content: searchText,
        list_id: currentListItem.id,
      });
      await onFetchList();
      onSetListItemInfo({
        id: currentListItem.id,
        name: currentListItem.name,
      });
    }
    if (info.keyPath.includes('edit')) {
      setEditInfo({ ...editInfo, editable: true });
    }
  };

  const [listName, setListName] = React.useState('');
  const inputRef = React.useRef<InputRef | null>(null);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };
  const handlePressEnter = async () => {
    if (!inputRef.current?.input?.value) return;

    await addList({ name: inputRef.current?.input?.value });
    await onFetchList();
    setListName('');
    inputRef.current?.blur();
    setTimeout(() => {
      const listElement = document.querySelector('.other-list')?.parentElement as HTMLUListElement;
      listElement.scrollTop = listElement?.scrollHeight;
    }, 50);
  };

  const otherListProps = {
    sbotherList,
    editInfo,
    handleListItemClick,
    handleContextMenu,
    handleReListNameEnter,
    setEditInfo,
    setSbotherlist,
  };

  return (
    <Space
      className="sider-bar-wrapper"
      direction="vertical"
      size="small"
      style={{ display: 'flex' }}
    >
      {renderFixedList()}
      <Divider style={{ margin: 0 }} />
      <DndProvider backend={HTML5Backend}>
        <List {...otherListProps} />
      </DndProvider>
      <div className="add-list-wrapper">
        <Icon
          style={{ color: '#000' }}
          component={() => <img src={plusSvg} />}
        />
        <Input
          ref={inputRef}
          placeholder="New list"
          value={listName}
          onChange={handleInput}
          onPressEnter={handlePressEnter}
        />
      </div>
      <ContextMenu
        items={[getItem({ label: 'Delete', key: 'delete' }), getItem({ label: 'Edit', key: 'edit' })]}
        visible={visible}
        points={points}
        onMenuClick={handleMenuClick}
      />
    </Space>
  );
};

export default SiderBar;
