import { useNavigate } from "react-router-dom";
import Axios from "axios";
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
  message,
} from "antd";
import Title from "antd/es/typography/Title";
import EditableCell from "../../../Elements/EditableCell";

function RefMasIncomeList() {
  const isMounted = useRef(true);
  const [incomeList, setIncomeList] = useState([]);
  const navigate = useNavigate();
  const [spinning, setSpinning] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  //editable table and table related
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    console.log(record);
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
      let row = {
        str_id: key,
        updates: "",
      };
      row.updates = await form.validateFields();
      console.log(row);
      try {
        const response = await Axios.post(
          `${process.env.REACT_APP_API_URL}api/reference/ref-income/update`,
          row
        );
        messageApi.open({
          type: "success",
          content: "Successfully saved",
          // onClose: () => {
          // },
        });
        setSpinning(false);
        const newData = [...incomeList];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row.updates,
          });
          setIncomeList(newData);
        }

        console.log("Response:", response.data);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: `${error.response.data.error.detail}`,
        });
        console.error("Error:", error.response);
      }

      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      // responsive: ['md'],
    },
    {
      title: "Name",
      dataIndex: "str_name",
      key: "str_name",
      editable: true,
      // responsive: ['md'],
    },
    {
      title: "Created date",
      dataIndex: "dtm_date",
      key: "dtm_date",
      // responsive: ['md'],
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
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
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAdd = () => {
    navigate("/home/ref-income/add");
  };
  useEffect(() => {
    setDataLoading(true);
    const fetchData = async () => {
      try {
        console.log(process.env.REACT_APP_API_URL);
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}api/reference/ref-income/getincome`
        );

        console.log("income List Data:", response.data);

        // Set the fetched data to the state
        setIncomeList(response.data);
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching income list:", error);
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
        <>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              scroll={{
                x: 1000,
                // y: 400,
              }}
              size="small"
              // columns={columns}
              columns={mergedColumns}
              dataSource={incomeList}
            />
          </Form>
        </>
      )}
    </>
  );
}

export default RefMasIncomeList;
