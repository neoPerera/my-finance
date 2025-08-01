////////////////////////////////////////////////////////////////////////////////////////////////////////
// Income master list
// Developed by Chanuth Perera
////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  Button,
  Skeleton,
  Spin,
  Table,
  Form,
  Typography,
  Popconfirm,
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import EditableCell from "../../../../../Elements/EditableCell";

function RefMasIncomeList() {
  // Hooks
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [incomeList, setIncomeList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Helpers
  const isEditing = (record) => record.key === editingKey;

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
      const row = {
        str_id: key,
        updates,
      };

      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-income/update`,
        row
      );

      messageApi.success("Successfully saved");

      const updatedList = [...incomeList];
      const index = updatedList.findIndex((item) => key === item.key);
      if (index > -1) {
        updatedList.splice(index, 1, { ...updatedList[index], ...updates });
        setIncomeList(updatedList);
      }

      console.log("Update response:", response.data);
    } catch (error) {
      messageApi.error(error?.response?.data?.error?.detail || "Update failed");
      console.error("Update error:", error);
    } finally {
      setEditingKey("");
      setSpinning(false);
    }
  };

  const handleAdd = () => {
    navigate("/home/ref-income/add");
  };

  // Table Columns
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
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </>
        ) : (
          <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

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

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}myfinance/reference/ref-income/getincome`
        );
        setIncomeList(response.data);
        console.log("Income list:", response.data);
      } catch (error) {
        console.error("Failed to fetch income list:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Title level={2}>Income Master</Title>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add new
      </Button>

      {dataLoading ? (
        <Skeleton active />
      ) : (
        <Form form={form} component={false}>
          <Table
            components={{ body: { cell: EditableCell } }}
            scroll={{ x: 1000 }}
            size="small"
            columns={mergedColumns}
            dataSource={incomeList}
          />
        </Form>
      )}
    </>
  );
}

export default RefMasIncomeList;
