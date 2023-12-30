function getItem(
  label: string,
  key: string,
  icon?: any,
  children?: {
    key: string;
    icon?: any;
    children?: any;
    label: string;
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
