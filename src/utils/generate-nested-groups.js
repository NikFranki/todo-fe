/**
 * generate strategy groups from origin groups
 * @param {*} groups
 * @param {*} ignoreLeaf if true, will ignore all the leaf's file, and only return groups
 * @returns 
 */
const generateNestedGroups = (groups, ignoreLeaf = false) => {
  const map = {};
  for (const item of groups) {
    map[item.id] = { ...item };
  }

  for (const key in map) {
    const value = map[key];
    const isLeaf = value.isLeaf;
    const hasParent = value.parent_id !== null;
    const canPushIn = !isLeaf || (isLeaf && !ignoreLeaf);
    if (hasParent && canPushIn) {
      map[value.parent_id].children = map[value.parent_id].children || [];
      map[value.parent_id].children.push(value);
    }
  }

  const loop = (data = [], prefix = '') => {
    return data.map((item) => {
      const isLeaf = item.isLeaf;
      const title = item.name;
      const id = item.id;
      const newItem = ignoreLeaf
        ? { label: title, value: id }
        : {
          title: title,
          key: `${prefix ? `${prefix}-` : ''}${item.id}`,
          id: id,
          parent_id: item.parent_id,
          isLeaf,
        };

      if (item.children) {
        newItem.children = loop(item.children, `${newItem.key}`);
      }

      return newItem;
    });
  };

  const rootGroups = Object.keys(map)
    .filter((key) => map[key].parent_id === null)
    .map((key) => map[key]);

  return loop(rootGroups);
};

export default generateNestedGroups;
