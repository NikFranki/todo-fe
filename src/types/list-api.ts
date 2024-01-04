export interface ListItemType {
  id: number;
  name: string;
  index_order: number;
  user_id: string;
  create_time: string;
  update_time: string;
  number: number;
  icon?: JSX.Element;
}

export interface LIST_RESPONSE_TYPE {
  code: number;
  message: string;
  list: ListItemType[];
}
