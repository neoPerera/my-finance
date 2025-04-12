
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Skeleton,
  Spin,
  Table,
  Form,
  Typography,
  Popconfirm,
  InputNumber,
  Input,
} from "antd";
import Title from "antd/es/typography/Title";


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  export default EditableCell;