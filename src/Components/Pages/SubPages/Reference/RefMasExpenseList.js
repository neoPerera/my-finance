import { Link } from "react-router-dom";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";


function RefMasExpenseList() {
  const isMounted = useRef(true);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    if (isMounted.current) {
      const swalInstance = Swal.fire({
        title: "Loading",
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const fetchData = async () => {
        try { 
          console.log(process.env.REACT_APP_API_URL);
          const response = await Axios.get(
            `${process.env.REACT_APP_API_URL}api/ref-expense/getexpense`
          );

          console.log("Expense List Data:", response.data);

          // Set the fetched data to the state
          setExpenseList(response.data);
          if (swalInstance) {
            swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
          }
        } catch (error) {
          console.error("Error fetching expense list:", error);
        }
      };

      fetchData();
      isMounted.current = false;
    }
  }, []);

  return (
    <>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Expense Master</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/home">Home</Link>
                </li>
                <li className="breadcrumb-item active">Expense Master</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="content">
        {/* Default box */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Projects</h3>
            <br />
            <Link className="btn btn-primary btn-sm" to="/home/ref-expense/add">
              <i className="fas fa-folder"></i>
              add expense
            </Link>
            <div className="card-tools">
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="collapse"
                title="Collapse"
              >
                <i className="fas fa-minus" />
              </button>
              <button
                type="button"
                className="btn btn-tool"
                data-card-widget="remove"
                title="Remove"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped projects">
              <thead>
                <tr>
                  <th style={{ width: "1%" }}>ID</th>
                  <th style={{ width: "20%" }}>Expense Name</th>
                  {/* ... (other table headers) */}
                  <th style={{ width: "20%" }}></th>
                </tr>
              </thead>
              <tbody>
                {expenseList.map((expense, index) => (
                  <tr key={index}>
                    <td>{expense.str_id}</td>
                    <td>
                      <a>{expense.str_name}</a>
                      <br />
                      <small>Created {expense.dtm_date}</small>
                    </td>
                    {/* ... (other table cells) */}
                    <td className="project-actions text-right">
                      <a className="btn btn-primary btn-sm" href="#">
                        <i className="fas fa-folder"></i>
                        View
                      </a>
                      <a className="btn btn-info btn-sm" href="#">
                        <i className="fas fa-pencil-alt"></i>
                        Edit
                      </a>
                      <a className="btn btn-danger btn-sm" href="#">
                        <i className="fas fa-trash"></i>
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default RefMasExpenseList;
