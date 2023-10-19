import React from 'react';

import { Modal, Input, DatePicker, Form, Cascader } from 'antd';
import dayjs from 'dayjs';
// import qs from 'qs';

import generateNestedGroups from '../utils/generate-nested-groups';
import useContextInfo from '../hooks/use-context-info';

const { TextArea } = Input;

const Edit = ({ todoDetail, mode, onSubmit, onCancel }) => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [form] = Form.useForm();

  const { groups } = useContextInfo();
  const options = generateNestedGroups(groups, true);

  React.useEffect(() => {
    if (todoDetail.id) {
      todoDetail.date = dayjs(new Date(todoDetail.date));
      form.setFieldsValue(todoDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoDetail.id]);

  return (
    <Modal
      open={!!mode}
      title={`${mode.slice(0, 1).toUpperCase()}${mode.slice(1).toLowerCase()} Todo`}
      okText="Ok"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        setConfirmLoading(true);
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            if (todoDetail.id) {
              values.id = todoDetail.id;
            }
            if (values.date instanceof dayjs) {
              values.date = values.date.format('YYYY-MM-DD');
            }
            onSubmit(mode, values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          }).finally(() => {
            setConfirmLoading(false);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          date: dayjs(new Date()),
          position_id: [1],
        }}
      >
        <Form.Item
          name="content"
          label="Content"
          rules={[
            {
              required: true,
              message: 'Content should not be empty!',
            },
          ]}
        >
          <TextArea placeholder="Please input the content" rows={4} />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[
            {
              required: true,
              message: 'Date should not be empty!',
            },
          ]}
        >
          <DatePicker
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
        <Form.Item
          name="position_id"
          label="Position"
        >
          <Cascader
            options={options}
            placeholder="Please select position"
            showSearch={{
              filter: (inputValue, path) => {
                return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
              },
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;