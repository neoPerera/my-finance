import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";

import { Button, Form, Input, Space, Spin, message } from "antd";
import Title from "antd/es/typography/Title";

const SubmitButton = ({ form, onClick }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);
  return (
    <Button
      type="primary"
      onClick={onClick}
      htmlType="submit"
      disabled={!submittable}
    >
      Submit
    </Button>
  );
};

function RefMasIncomeForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    strId: "",
    strName: "",
  });
  const [spinning, setSpinning] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasEmptyAttributes = Object.values(formData).some(
      (value) => value === "" || value === null
    );
    console.log(formData);

    if (hasEmptyAttributes) {
      messageApi.open({
        type: "error",
        content: `Has empty fields. Please check`,
      });
      return;
    }

    // const swalInstance = Swal.fire({
    //   title: "Loading",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    setSpinning(true);
    try {
      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}api/reference/ref-income/add`,
        formData
      );
      setSpinning(false);
      form.resetFields();
      // if (swalInstance) {
      //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
      // }
      console.log("Response:", response.data);
      messageApi.open({
        type: "success",
        content: "Successfully saved",
        onClose: () => navigate("/home/ref-income"),
      });
    } catch (error) {
      console.error("Error:", error.response);
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops...",
      //   text: `${error.response.data.error.detail}`,
      //   footer: '<a href="#">Why do I have this issue?</a>',
      // });
      messageApi.open({
        type: "error",
        content: `${error.response.data.error.detail}`,
      });
      setSpinning(false);
    }
  };

  useEffect(() => {
    // if (isFirstRun.current) {
    //   isFirstRun.current = false;
    //   return;
    // }

    const getSequence = async () => {
      console.log("Getting Inc Seq");
      // const swalInstance = Swal.fire({
      //   title: "Loading",
      //   timerProgressBar: true,
      //   didOpen: () => {
      //     Swal.showLoading();
      //   },
      // });
      setSpinning(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}api/reference/ref-income/getSequence`
        );
        console.log(response);
        // if (swalInstance) {
        //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        // }
        setSpinning(false);
        setFormData({
          ...formData,
          strId: response.data.output_value.toString(),
        });
        form.setFieldsValue({
          strId: response.data.output_value.toString(),
        });
      } catch (error) {
        // if (swalInstance) {
        //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        // }

        console.error("Error:", error);
      }
    };

    getSequence();
  }, []);

  return (
    <>
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Title level={2}>Income Master form</Title>
      <Form
        form={form}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="strId"
          label="ID"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="strName"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input id="strName" onChange={handleInputChange} />
        </Form.Item>
        <Form.Item>
          <Space>
            <SubmitButton onClick={handleSubmit} form={form} />
            {/* <Button htmlType="reset">Reset</Button> */}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default RefMasIncomeForm;
