import React from 'react';

import {
  PlusCircleOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  ScheduleOutlined,
  UserOutlined,
  FireOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Space, Input, Divider, Button } from 'antd';

import ContextMenu from '@components/context-menu';
import { addList, updateList, deleteList } from '@api/list';
import useContextInfo from '@hooks/use-context-info';
import getItem from '@utils/menu-get-item';
import useContextMenu from '@hooks/use-context-menu';
import './sider-bar.css';

const SiderBar = () => {
  const [sbfixedList, setSbfixedlist] = React.useState([]);
  const [sbotherList, setSbotherlist] = React.useState([]);
  const otherListRef = React.useRef(null);

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
    onFetchList,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();

  const listFactor = list.reduce((acc, prev) => {
    acc += `${prev.id}-${prev.name}-${prev.number}`;
    return acc;
  }, '');
  React.useEffect(() => {
    if (!list.length) return;
    const icons = [
      <FireOutlined key="today-icon" className="today-icon" />,
      <StarOutlined key="important-icon" className="important-icon" />,
      <ScheduleOutlined key="planned-icon" className="planned-icon" />,
      <UserOutlined key="assigned-icon" className="assigned-icon" />,
      <HomeOutlined key="tasks-icon" className="tasks-icon" />,
    ];
    const newFixedList = fixedList.map((item, index) => {
      return {
        ...item,
        icon: icons[index],
      };
    });
    setSbfixedlist(newFixedList);
    const newOtherList = otherlist.map((item) => {
      return {
        ...item,
        icon: (
          <UnorderedListOutlined style={{ fontSize: 16, marginRight: 10 }} />
        ),
      };
    });
    setSbotherlist(newOtherList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFactor]);

  const handleSearchAll = () => {
    onFetchTodo({
      list_id: undefined,
    });
    onSetTodoId(undefined);
  };

  const renderFixedList = () => {
    return sbfixedList.map((item) => {
      return (
        <div key={item.id} className="shortcut-menu">
          <Button onClick={handleSearchAll} type="link" icon={item.icon}>
            {item.name}
            <span>{item.number}</span>
          </Button>
        </div>
      );
    });
  };

  const handleListItemClick = (item) => {
    onFetchTodo({
      list_id: item.id,
    });
  };
  const renderOtherList = () => {
    return (
      <div ref={otherListRef} className="other-list list-wrapper">
        {sbotherList.map((item) => {
          return (
            <div
              key={item.id}
              className="list-item"
              onClick={() => handleListItemClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="icon-text">
                <UnorderedListOutlined style={{ fontSize: 16 }} />
                {editInfo.editable && item.id === editInfo.clikedId ? (
                  <Input
                    className="edit-list-name"
                    placeholder="Please input list name"
                    value={editInfo.reListName}
                    autoFocus
                    onBlur={async (e) => {
                      await updateList({ id: item.id, name: e.target.value });
                      await onFetchList();
                      setEditInfo({
                        ...editInfo,
                        editable: false,
                        clikedId: null,
                        reListName: '',
                      });
                    }}
                    onChange={(e) => {
                      setEditInfo({
                        ...editInfo,
                        reListName: e.target.value,
                      });
                    }}
                    onPressEnter={async (e) => {
                      await updateList({ id: item.id, name: e.target.value });
                      await onFetchList();
                      setEditInfo({
                        ...editInfo,
                        editable: false,
                        clikedId: null,
                        reListName: '',
                      });
                    }}
                  />
                ) : (
                  <span className="text">{item.name}</span>
                )}
              </div>
              <span className="number">{item.number}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    onContextMenuOpen(e);

    setEditInfo({
      ...editInfo,
      editable: false,
      clikedId: item.id,
      reListName: item.name,
    });
  };
  const handleMenuClick = async (e) => {
    if (e.keyPath.includes('delete')) {
      await deleteList({
        id: editInfo.clikedId,
      });
      await onFetchTodo({
        content: searchText,
      });
      await onFetchList();
    }
    if (e.keyPath.includes('edit')) {
      setEditInfo({ ...editInfo, editable: true });
    }
  };

  const [listName, setListName] = React.useState('');
  const inputRef = React.useRef(null);
  const handleInput = (e) => {
    setListName(e.target.value);
  };
  const scrollBottom = (element) => {
    element.scrollTop = element.scrollHeight;
  };
  const handlePressEnter = async (e) => {
    await addList({ name: e.target.value });
    await onFetchList();
    setListName('');
    inputRef.current.blur();
    setTimeout(() => {
      scrollBottom(otherListRef.current.parentElement);
    }, 50);
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
      {renderOtherList()}
      <div className="add-list-wrapper">
        <PlusCircleOutlined className="add-icon" />
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
