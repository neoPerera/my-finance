import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import { SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Button, Form, Input, Select, Space, Spin, message, Switch } from "antd";
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
// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

function TransactionForm() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    strId: "",
    floatAmount: "",
    strName: "",
    strTransType: "",
    strTransCat: "",
    strAccount: "",
    isDoubleEntry: false,
    strAccount2: "",

  });
  const [transTypes, setTransTypes] = useState([]);
  const [isTransCatDisabled, setTransCatDisabled] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [accounts2, setAccounts2] = useState([]);
  const [transCats, setTransCats] = useState([]);
  const [spinning, setSpinning] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [reloeadCompoenet, setReloadCompoenet] = useState(0);
  const navigate = useNavigate();

  // const error = () => {
  //   messageApi.open({
  //     type: 'error',
  //     content: 'This is an error message',
  //   });
  // };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const Amount_handleInputChange = (e) => {
    const numericValue =
      parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
    console.log(numericValue.toLocaleString("en"));
    const formattedCurrency = numericValue.toLocaleString("en");
    //const formattedCurrency = numericValue.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Adds commas for thousands
    // console.log(formattedCurrency);

    setFormData({
      ...formData,
      floatAmount: formattedCurrency,
    });
  };

  const handleSelectCats = (value) => {
    setFormData({ ...formData, strTransCat: value });
  };

  const handleSelectAccount = (value) => {
    setFormData({ ...formData, strAccount: value });
    generateAccount2(formData.isDoubleEntry, value);

  };
  const handleSelectAccount2 = (value) => {
    setFormData({ ...formData, strAccount2: value });
  };

  const isDouleEntryChange = (value) => {
    setFormData({ ...formData, isDoubleEntry: value });
    generateAccount2(value, formData.strAccount);
  };
  const generateAccount2 =(value, strAccount)=>
  {
    form.setFieldsValue({ strAccount2: "" }); // or true, or undefined
    if (value) {
      const filteredAccounts = accounts.filter(
        (acc) => acc.value !== strAccount
      );
      setAccounts2(filteredAccounts);
    } else {
      setAccounts2([]); // Empty the list when double entry is off
    }
  }

  const handleSelectTrans = async (value) => {
    console.log(value);
    var strTransCatURL = "";
    if (value == "INC") {
      strTransCatURL = "api/reference/ref-income/getincome";
    } else if (value == "EXP") {
      strTransCatURL = "api/reference/ref-expense/getexpense";
    }
    setFormData({ ...formData, strTransType: value });
    setSpinning(true);
    try {
      const response = await Axios.get(
        `${window.env?.REACT_APP_API_URL}${strTransCatURL}`
      );
      console.log(response);
      setTransCats(
        response.data.map((item) => ({
          label: item.str_name,
          value: item.key,
        }))
      );
      setSpinning(false);
      setTransCatDisabled(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    const filteredFormData = { ...formData };

    // If isDouble is false, remove account2 from the check
    if (!filteredFormData.isDoubleEntry) {
      delete filteredFormData.strAccount2;
    }
    const hasEmptyAttributes = Object.values(filteredFormData).some(
      (value) => value === "" || value === null
    );
    console.log(filteredFormData);

    if (hasEmptyAttributes) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `A field is empty`,
        footer: '<a href="#">Why do I have this issue?</a>',
      });
      return;
    }

    setSpinning(true);
    try {
      const response = await Axios.post(
        `${window.env?.REACT_APP_API_URL}api/transaction/add`,
        filteredFormData
      );
      //setSpinning(false);
      console.log("Response:", response.data);
      messageApi.open({
        type: "success",
        content: "Successfully saved",
        onClose: () => {
          setSpinning(false);
          form.resetFields();
          setReloadCompoenet(reloeadCompoenet + 1);
        },
      });
    } catch (error) {
      console.error("Error:", error.response);

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
      setSpinning(true);
      try {
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}api/transaction/getsequence?type=id`
        );
        form.setFieldsValue({
          strId: response.data.sequence_id.toString(),
        });
        console.log(response);
        setSpinning(false);
        setFormData({
          ...formData,
          strId: response.data.sequence_id.toString(),
        });

        setTransTypes(response.data.trans_types[0]);
        setAccounts(response.data.accounts[0]);
        // setIsIdEditable(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getSequence();
  }, [reloeadCompoenet]);

  return (
    <>
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Title level={2}>Transaction form</Title>

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
          <Input
            // id="strId"
            // value={formData.strId}
            onChange={handleInputChange}
            disabled={true}
          />
        </Form.Item>
        {/* AMOUNT FIELD */}
        <Form.Item
          name="floatAmount"
          label="Amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            type="number"
            id="floatAmount"
            value={formData.floatAmount}
            onChange={handleInputChange}
          />
        </Form.Item>
        {/* Account selection */}
        <Form.Item
          name="strAccount"
          label="Account"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select an Account"
            optionFilterProp="children"
            onSelect={handleSelectAccount}
            // onChange={onChange}
            // onSearch={onSearch}
            filterOption={filterOption}
            options={accounts}
          />
        </Form.Item>

        <Form.Item
          name="isDoubleEntry"
          label="Is Double Entry?"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Switch onChange={isDouleEntryChange} />
        </Form.Item>

        {formData.isDoubleEntry && (
          <Form.Item
            name="strAccount2"
            label="Second Account"
            rules={[
              {
                required: formData.isDoubleEntry,
                message: "Please select the second account",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select 2nd Account"
              optionFilterProp="children"
              onSelect={handleSelectAccount2}
              filterOption={filterOption}
              options={accounts2}
            />
          </Form.Item>
        )}

        {/* strTransType field */}
        <Form.Item
          name="strTransType"
          label="Transaction Type"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a type"
            optionFilterProp="children"
            onSelect={handleSelectTrans}
            // onChange={onChange}
            // onSearch={onSearch}
            filterOption={filterOption}
            options={transTypes}
          />
        </Form.Item>
        {/* Trans cat  */}
        <Form.Item
          name="strTransCat"
          label="Category"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            disabled={isTransCatDisabled}
            placeholder="Select a category"
            optionFilterProp="children"
            // onChange={onChange}
            // onSearch={onSearch}
            onSelect={handleSelectCats}
            filterOption={filterOption}
            options={transCats}
          />
        </Form.Item>
        <Form.Item
          name="strName"
          label="Reason"
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
            <SubmitButton onClick={handleSubmitBtn} form={form} />
            {/* <Button htmlType="reset">Reset</Button> */}
          </Space>
        </Form.Item>
      </Form>
    </>
    // <div>
    //   {/* Content Header (Page header) */}
    //   <section className="content-header">
    //     <div className="container-fluid">
    //       <div className="row mb-2">
    //         <div className="col-sm-6">
    //           <h1>Transaction</h1>
    //         </div>
    //         <div className="col-sm-6">
    //           <ol className="breadcrumb float-sm-right">
    //             <li className="breadcrumb-item">
    //               <Link to="/home">Home</Link>
    //             </li>
    //             <li className="breadcrumb-item active">Form</li>
    //           </ol>
    //         </div>
    //       </div>
    //     </div>
    //     {/* <!-- /.container-fluid --> */}
    //   </section>
    //   <section className="content">
    //     <>
    //       <div className="card card-primary">
    //         <div className="card-header">
    //           <h3 className="card-title">Insert transaction</h3>
    //         </div>
    //         <form>
    //           <div className="card-body">
    //             <div className="form-group">
    //               <label htmlFor="strId">ID</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 id="strId"
    //                 placeholder="Income id"
    //                 value={formData.strId}
    //                 onChange={handleInputChange}
    //                 readOnly={!isIdEditable}
    //               />
    //             </div>
    //             <div className="form-group">
    //               <label htmlFor="floatAmount">Amount</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 id="floatAmount"
    //                 placeholder="Amount"
    //                 value={formData.floatAmount}
    //                 onChange={Amount_handleInputChange}
    //               />
    //             </div>
    //             <div className="form-group">
    //               <label htmlFor="strTransType">Type</label>

    //               <SelectPicker
    //                 onSelect={handleSelectTrans}
    //                 id="strTransType"
    //                 data={transTypes}
    //                 style={{ width: "100%" }}
    //               />
    //             </div>
    //             <div className="form-group">
    //               <label htmlFor="strTransCat">Category</label>

    //               <SelectPicker
    //                 disabled={isTransCatDisabled}
    //                 onSelect={handleSelectCats}
    //                 id="strTransCat"
    //                 data={transCats}
    //                 style={{ width: "100%" }}
    //               />
    //             </div>
    //             <div className="form-group">
    //               <label htmlFor="strName">Reason</label>
    //               <input
    //                 type="text"
    //                 className="form-control"
    //                 id="strName"
    //                 placeholder="Reason"
    //                 value={formData.strName}
    //                 onChange={handleInputChange}
    //               />
    //             </div>
    //           </div>
    //           <div className="card-footer">
    //             <button
    //               id="btnTransSave"
    //               onClick={handleSubmitBtn}
    //               className="btn btn-primary"
    //             >
    //               Save
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </>
    //   </section>
    // </div>
  );
}

export default TransactionForm;
