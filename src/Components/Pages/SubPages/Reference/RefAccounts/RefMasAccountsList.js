import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  Breadcrumb,
  Button,
  Skeleton,
  Spin,
  Table,
  Typography,
  Form,
  Popconfirm,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import EditableCell from "../../../../Elements/EditableCell";

function RefMasAccountsList() {
  // Refs and state
  const isMounted = useRef(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [accountList, setAccountList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const isEditing = (record) => record.key === editingKey;

  // Column definitions
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
      title: "Created Date",
      dataIndex: "dtm_date",
      key: "dtm_date",
    },
    {
      title: "Operation",
      dataIndex: "operation",
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
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
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

  // Add editable cell configuration
  const mergedColumns = columns.map((col) =>
    !col.editable
      ? col
      : {
        ...col,
        onCell: (record) => ({
          record,
          inputType: "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      }
  );

  // Handlers
  const edit = (record) => {
    form.setFieldsValue({ str_name: record.str_name });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      setSpinning(true);

      const updates = await form.validateFields();
      const row = { str_id: key, updates };

      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}api/reference/ref-accounts/update`,
        row
      );

      messageApi.success("Successfully saved");

      const updatedList = [...accountList];
      const index = updatedList.findIndex((item) => item.key === key);
      if (index > -1) {
        const item = updatedList[index];
        updatedList.splice(index, 1, {
          ...item,
          ...updates,
        });
        setAccountList(updatedList);
      }

      console.log("Update response:", response.data);
      setEditingKey("");
    } catch (error) {
      if (error.response?.data?.error?.detail) {
        messageApi.error(error.response.data.error.detail);
      } else {
        messageApi.error("An error occurred while saving");
      }
      console.error("Save error:", error);
    } finally {
      setSpinning(false);
    }
  };

  const handleAdd = () => {
    navigate("/home/ref-accounts/add");
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setSpinning(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}api/reference/ref-accounts/getaccounts`
        );
        console.log("Accounts List:", response.data);
        setAccountList(response.data);
      } catch (error) {
        console.error("Error fetching accounts list:", error);
      } finally {
        setSpinning(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <Title level={2}>Accounts Master</Title>

      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add New
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
            dataSource={accountList}
            size="small"
            scroll={{ x: 1000 }}
          />
        </Form>
      )}
    </>
  );
}

export default RefMasAccountsList;
