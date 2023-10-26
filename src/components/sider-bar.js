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
import { Space, Input, Divider, Button, Menu } from 'antd';

import { addList, updateList, deleteList } from '@api/list';
import useContextInfo from '@hooks/use-context-info';
import getItem from '@utils/menu-get-item';
import useContextMenu from '@hooks/use-context-menu';
import './sider-bar.css';

const SiderBar = () => {
  const [sbfixedList, setSbfixedlist] = React.useState([]);
  const [sbotherList, setSbotherlist] = React.useState([]);
  const [clikedId, setClickedId] = React.useState(false);
  const otherListRef = React.useRef(null);

  const [editInfo, setEditInfo] = React.useState({
    editable: false,
    reListName: '',
  });

  const { visible, setVisible, points, setPoints } = useContextMenu();

  const {
    list,
    fixedList,
    otherlist,
    todo,
    searchText,
    onFetchList,
    onFetchTodo,
    onSetTodoId,
  } = useContextInfo();

  const listFactor = list.reduce((acc, prev) => {
    acc += `${prev.id}${prev.name}`;
    return acc;
  }, '');
  const listNumberMap = todo.reduce((acc, prev) => {
    if (acc[prev.list_id]) {
      acc[prev.list_id]++;
    } else {
      acc[prev.list_id] = 1;
    }
    return acc;
  }, {});
  const todoFactor = Object.entries(listNumberMap)
    .map(([key, value]) => `${key}:${value}`)
    .join('_');
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
        number: listNumberMap[item.id] || 0,
      };
    });
    setSbfixedlist(newFixedList);
    const newOtherList = otherlist.map((item) => {
      return {
        ...item,
        icon: (
          <UnorderedListOutlined style={{ fontSize: 16, marginRight: 10 }} />
        ),
        number: listNumberMap[item.id] || 0,
      };
    });
    setSbotherlist(newOtherList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFactor, todoFactor]);

  const onSearchAll = () => {
    onFetchTodo({
      id: undefined,
    });
    onSetTodoId(undefined);
  };

  const renderFixedList = () => {
    return sbfixedList.map((item) => {
      return (
        <div key={item.id} className="shortcut-menu">
          <Button onClick={onSearchAll} type="link" icon={item.icon}>
            {item.name}
            <span>{item.number}</span>
          </Button>
        </div>
      );
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
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="icon-text">
                <UnorderedListOutlined
                  style={{ fontSize: 16, marginRight: 10 }}
                />
                {editInfo.editable && item.id === clikedId ? (
                  <Input
                    placeholder="Please input list name"
                    value={editInfo.reListName}
                    autoFocus
                    onBlur={async (e) => {
                      await updateList({ id: item.id, name: e.target.value });
                      await onFetchList();
                      setEditInfo({
                        ...editInfo,
                        editable: false,
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
                        reListName: '',
                      });
                    }}
                  />
                ) : (
                  item.name
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
    setClickedId(item.id);
    setVisible(true);
    setPoints({
      x: e.pageX,
      y: e.pageY,
    });

    setEditInfo({
      ...editInfo,
      editable: false,
      reListName: item.name,
    });
  };

  const items = [getItem('Delete', 'delete'), getItem('Edit', 'edit')];
  const onMenuClick = async (e) => {
    e.domEvent.stopPropagation();
    if (e.keyPath.includes('delete')) {
      await deleteList({
        id: clikedId,
      });
      await onFetchTodo({
        content: searchText,
      });
      await onFetchList();
      setVisible(false);
    }
    if (e.keyPath.includes('edit')) {
      setEditInfo({ ...editInfo, editable: true });
      setVisible(false);
    }
  };
  const renderContextMenu = () => {
    return (
      visible && (
        <Menu
          onClick={onMenuClick}
          style={{
            position: 'fixed',
            left: points.x,
            top: points.y,
            zIndex: 1,
            width: 256,
          }}
          mode="vertical"
          items={items}
        />
      )
    );
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
      {renderContextMenu()}
    </Space>
  );
};

export default SiderBar;
