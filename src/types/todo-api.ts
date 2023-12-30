import { COMPLETED_ENUM, IMPORTANT_ENUM, MY_DAY_ENUM } from "@/enum";

export interface EditTodoParamsType {
  id?: string;
  content?: string;
  user_id?: string;
  list_id?: number;
  added_my_day?: MY_DAY_ENUM;
  marked_as_important?: IMPORTANT_ENUM;
  marked_as_completed?: COMPLETED_ENUM;
  reminder?: string;
  due_date?: string;
  repeated?: number;
  file?: File;
  note?: string;
  category?: string;
  create_time?: string;
  update_time?: string;
  subtask?: any[];
}
