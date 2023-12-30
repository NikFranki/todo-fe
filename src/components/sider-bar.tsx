import React from 'react';

import Icon from '@ant-design/icons';
import { Space, Input, Divider, Button } from 'antd';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import _ from 'lodash';

import ContextMenu from '@components/context-menu';
import {
  addList,
  updateList,
  updateListByDragAndDrop,
  deleteList,
} from '@api/list';
import useContextInfo from '@hooks/use-context-info';
import getItem from '@utils/menu-get-item';
import useContextMenu from '@hooks/use-context-menu';
import { LIST_ICON_MAP } from '@constant/index';

import plusSvg from '@assets/images/plus.svg';

import List from './list';

import './sider-bar.scss';

const SiderBar = () => {
  const [sbfixedList, setSbfixedlist] = React.useState([]);
  const [sbotherList, setSbotherlist] = React.useState([]);

  const [editInfo, setEditInfo] = React.useState({
    editable: false,
    clikedId: null,
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
  } = useContextInfo() as any;

  const listFactor = list.reduce((acc: any, prev: any) => {
    acc += `${prev.id}-${prev.name}-${prev.number}`;
    return acc;
  }, '');
  React.useEffect(() => {
    if (!list.length) return;
    const newFixedList = fixedList.map((item: any) => {
      return {
        ...item,
        icon: (LIST_ICON_MAP as any)[item.id],
      };
    });
    setSbfixedlist(newFixedList);

    setSbotherlist(
      otherlist.map((item: any) => {
        return _.omit(item, 'icon');
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFactor]);

  const handleFixedItemClick = (item: any) => {
    onFetchTodo({
      list_id: item.id,
    });
    onSetListItemInfo({
      id: item.id,
      name: item.name,
    });
  };

  const renderFixedList = () => {
    return sbfixedList.map((item: any) => {
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

  const handleListItemClick = (item: any) => {
    onFetchTodo({
      list_id: item.id,
    });
    onSetListItemInfo({
      id: item.id,
      name: item.name,
    });
  };
  const handleReListNameEnter = async (e: any, item: any) => {
    await updateList({ id: item.id, name: e.target.value });
    await onFetchList();
    setEditInfo({
      ...editInfo,
      editable: false,
      clikedId: null,
      reListName: '',
    });
    if (listItemInfo.id === item.id) {
      onSetListItemInfo({
        id: item.id,
        name: e.target.value,
      });
    }
  };

  const handleContextMenu = (e: any, item: any) => {
    e.preventDefault();
    onContextMenuOpen(e);

    setEditInfo({
      ...editInfo,
      editable: false,
      clikedId: item.id,
      reListName: item.name,
    });
  };
  const handleMenuClick = async (e: any) => {
    if (e.keyPath.includes('delete')) {
      const deletedIndex = list.findIndex(
        (item: any) => item.id === editInfo.clikedId
      );
      const currentListItem = list[deletedIndex - 1];
      await deleteList({
        id: editInfo.clikedId,
      });
      const deletedIndexOrder = (sbotherList as any).find(
        (item: any) => item.id === editInfo.clikedId
      ).index_order;
      const newSBotherList = sbotherList
        .slice(deletedIndex - 5 + 1)
        .map((item: any, index) => {
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
    if (e.keyPath.includes('edit')) {
      setEditInfo({ ...editInfo, editable: true });
    }
  };

  const [listName, setListName] = React.useState('');
  const inputRef = React.useRef<any>(null);
  const handleInput = (e: any) => {
    setListName(e.target.value);
  };
  const handlePressEnter = async (e: any) => {
    await addList({ name: e.target.value });
    await onFetchList();
    setListName('');
    inputRef.current.blur();
    setTimeout(() => {
      const listElement = document.querySelector('.other-list')?.parentElement as any;
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
        items={[getItem('Delete', 'delete'), getItem('Edit', 'edit')]}
        visible={visible}
        points={points}
        onMenuClick={handleMenuClick}
      />
    </Space>
  );
};

export default SiderBar;
