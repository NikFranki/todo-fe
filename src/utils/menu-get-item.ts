interface ParamsType {
  label: string;
  key: string;
  icon?: JSX.Element;
  children?: ParamsType[];
  type?: string;
}

function getItem(obj: ParamsType) {
  const { label, key, icon, children, type } = obj;

  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export default getItem;
