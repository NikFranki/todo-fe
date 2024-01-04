function getItem(
  label: string,
  key: string,
  icon?: any,
  children?: {
    label: string;
    key: string;
    icon?: any;
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
