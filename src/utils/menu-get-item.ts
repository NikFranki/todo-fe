function getItem(
  label: string,
  key: string,
  icon?: JSX.Element,
  children?: {
    label: string;
    key: string;
    icon?: JSX.Element;
    children?: any;
    type?: string;
  }[],
  type?: string
) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
export default getItem;
