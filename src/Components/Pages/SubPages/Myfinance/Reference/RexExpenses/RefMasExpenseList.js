import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  Button,
  Form,
  Skeleton,
  Table,
  Typography,
  Popconfirm,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import EditableCell from "../../../../../Elements/EditableCell";

function RefMasExpenseList() {
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const isEditing = (record) => record.key === editingKey;

  const fetchData = async () => {
    setSpinning(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-expense/getexpense`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching expense list:", error);
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      fetchData();
      isMounted.current = false;
    }
  }, []);

  const handleAdd = () => {
    navigate("/home/ref-expense/add");
  };

  const edit = (record) => {
    form.setFieldsValue({
      str_name: record.str_name,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      setSpinning(true);
      const updatedFields = await form.validateFields();

      const payload = {
        str_id: key,
        updates: updatedFields,
      };

      await Axios.post(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-expense/update`,
        payload
      );

      messageApi.success("Successfully saved");

      const updatedData = [...data];
      const index = updatedData.findIndex((item) => item.key === key);
      if (index > -1) {
        updatedData[index] = { ...updatedData[index], ...updatedFields };
        setData(updatedData);
      }

      setEditingKey("");
    } catch (error) {
      messageApi.error(
        error?.response?.data?.error?.detail || "Failed to save changes"
      );
    } finally {
      setSpinning(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "str_name",
      key: "str_name",
      editable: true,
    },
    {
      title: "Created date",
      dataIndex: "dtm_date",
      key: "dtm_date",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Cancel changes?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) =>
    col.editable
      ? {
          ...col,
          onCell: (record) => ({
            record,
            inputType: "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        }
      : col
  );

  return (
    <>
      {contextHolder}
      <Title level={2}>Expense Master</Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add new
      </Button>
      {spinning ? (
        <Skeleton active />
      ) : (
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={data}
            size="small"
            scroll={{ x: 1000 }}
          />
        </Form>
      )}
    </>
  );
}

export default RefMasExpenseList;
