import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";

import { Button, Form, Input, Space, Spin } from "antd";

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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `A field is empty`,
        footer: '<a href="#">Why do I have this issue?</a>',
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
        `${process.env.REACT_APP_API_URL}api/ref-income/add`,
        formData
      );
      setSpinning(false);
      // if (swalInstance) {
      //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
      // }
      console.log("Response:", response.data);
      Swal.fire({
        title: "successful!",
        icon: "success",
        willClose: () => {
          // This callback is called when the modal is unmounted
          // Clean up any resources here if needed
          navigate("/home/ref-income");
        },
      });
    } catch (error) {
      console.error("Error:", error.response);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.error.detail}`,
        footer: '<a href="#">Why do I have this issue?</a>',
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
          `${process.env.REACT_APP_API_URL}api/ref-income/getSequence`
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
      <Spin spinning={spinning} fullscreen />
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
