import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import { SelectPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
function TransactionForm() {
  const [formData, setFormData] = useState({
    strId: "",
    floatAmount: "",
    strName: "",
    strTransType: "",
    strTransCat: "",
  });
  const [transTypes, setTransTypes] = useState([]);
  const [isIdEditable, setIsIdEditable] = useState(false);
  const [isTransCatDisabled, setTransCatDisabled] = useState(true);
  const [transCats, setTransCats] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const Amount_handleInputChange = (e) => {
    const numericValue = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
    console.log(numericValue.toLocaleString('en'));
    const formattedCurrency = numericValue.toLocaleString('en');
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

  const handleSelectTrans = async (value) => {
    console.log(value);
    var strTransCatURL = "";
    if (value == "INC") {
      strTransCatURL = "api/ref-income/getincome";
    } else if (value == "EXP") {
      strTransCatURL = "api/ref-expense/getexpense";
    }
    setFormData({ ...formData, strTransType: value });
    const swalInstance = Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}${strTransCatURL}`
      );
      console.log(response);
      setTransCats(
        response.data.map((item) => ({
          label: item.str_name,
          value: item.str_id,
        }))
      );
      if (swalInstance) {
        swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
      }
      setTransCatDisabled(false);
    } catch (error) {
      if (swalInstance) {
        swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
      }
      console.error("Error:", error);
    }
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    const hasEmptyAttributes = Object.values(formData).some(
      (value) => value === "" || value === null
    );
    console.log(formData);

    // if (hasEmptyAttributes) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: `A field is empty`,
    //     footer: '<a href="#">Why do I have this issue?</a>',
    //   });
    //   return;
    // }

    // const swalInstance = Swal.fire({
    //   title: "Loading",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    // try {
    //   const response = await Axios.post(
    //     `${process.env.REACT_APP_API_URL}api/ref-income/add`,
    //     formData
    //   );
    //   if (swalInstance) {
    //     swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
    //   }
    //   console.log("Response:", response.data);
    //   Swal.fire({
    //     title: "successful!",
    //     icon: "success",
    //     willClose: () => {
    //       // This callback is called when the modal is unmounted
    //       // Clean up any resources here if needed
    //       navigate("/home/ref-income");
    //     },
    //   });
    // } catch (error) {
    //   console.error("Error:", error.response);
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: `${error.response.data.error.detail}`,
    //     footer: '<a href="#">Why do I have this issue?</a>',
    //   });
    // }
  };

  useEffect(() => {
    // if (isFirstRun.current) {
    //   isFirstRun.current = false;
    //   return;
    // }

    const getSequence = async () => {
      console.log("Getting Inc Seq");
      const swalInstance = Swal.fire({
        title: "Loading",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}api/transaction/getsequence?type=id`
        );
        console.log(response);
        if (swalInstance) {
          swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        }
        setFormData({
          ...formData,
          strId: response.data.sequence_id.toString(),
        });

        setTransTypes(response.data.trans_types);
        setIsIdEditable(false);
      } catch (error) {
        if (swalInstance) {
          swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        }
        console.error("Error:", error);
      }
    };

    getSequence();
  }, []);

  return (
    <div>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Transaction</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/home">Home</Link>
                </li>
                <li className="breadcrumb-item active">Form</li>
              </ol>
            </div>
          </div>
        </div>
        {/* <!-- /.container-fluid --> */}
      </section>
      <section className="content">
        <>
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Insert transaction</h3>
            </div>
            <form>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="strId">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="strId"
                    placeholder="Income id"
                    value={formData.strId}
                    onChange={handleInputChange}
                    readOnly={!isIdEditable}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="floatAmount">Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    id="floatAmount"
                    placeholder="Amount"
                    value={formData.floatAmount}
                    onChange={Amount_handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="strTransType">Type</label>

                  <SelectPicker
                    onSelect={handleSelectTrans}
                    id="strTransType"
                    data={transTypes}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="strTransCat">Category</label>

                  <SelectPicker
                    disabled={isTransCatDisabled}
                    onSelect={handleSelectCats}
                    id="strTransCat"
                    data={transCats}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="strName">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    id="strName"
                    placeholder="Reason"
                    value={formData.strName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="card-footer">
                <button
                  id="btnTransSave"
                  onClick={handleSubmitBtn}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      </section>
    </div>
  );
}

export default TransactionForm;