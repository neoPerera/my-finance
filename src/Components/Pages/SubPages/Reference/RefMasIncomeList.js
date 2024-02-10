import { useNavigate } from "react-router-dom";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// import Swal from "sweetalert2";
import { Button, Skeleton, Spin, Table } from "antd";
import Title from "antd/es/typography/Title";

function RefMasIncomeList() {
  const isMounted = useRef(true);
  const [incomeList, setIncomeList] = useState([]);
  const navigate = useNavigate();
  const [spinning, setSpinning] = React.useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "str_id",
      key: "str_id",
      // responsive: ['md'],
    },
    {
      title: "Name",
      dataIndex: "str_name",
      key: "str_name",
      // responsive: ['md'],
    },
    {
      title: "Created date",
      dataIndex: "dtm_date",
      key: "dtm_date",
      // responsive: ['md'],
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      // responsive: ['md'],
      render: () => <a>Delete</a>,
    },
  ];
  const handleAdd = () => {
    navigate("/home/ref-income/add");
  };
  useEffect(() => {
    // if (isMounted.current) {
    // const swalInstance = Swal.fire({
    //   title: "Loading",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    setSpinning(true);
    const fetchData = async () => {
      try {
        console.log(process.env.REACT_APP_API_URL);
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}api/ref-income/getincome`
        );

        console.log("income List Data:", response.data);

        // Set the fetched data to the state
        setIncomeList(response.data);
        // if (swalInstance) {
        //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        // }
        setSpinning(false);
      } catch (error) {
        console.error("Error fetching income list:", error);
      }
    };

    fetchData();
    //   isMounted.current = false;
    // }
  }, []);

  return (
    // <>
    //   {/* Content Header (Page header) */}
    //   <section className="content-header">
    //     <div className="container-fluid">
    //       <div className="row mb-2">
    //         <div className="col-sm-6">
    //           <h1>Income Master</h1>
    //         </div>
    //         <div className="col-sm-6">
    //           <ol className="breadcrumb float-sm-right">
    //             <li className="breadcrumb-item">
    //               <Link to="/home">Home</Link>
    //             </li>
    //             <li className="breadcrumb-item active">Income Master</li>
    //           </ol>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Main content */}
    //   <section className="content">
    //     {/* Default box */}
    //     <div className="card">
    //       <div className="card-header">
    //         <h3 className="card-title">Projects</h3>
    //         <br />
    //         <Link className="btn btn-primary btn-sm" to="/home/ref-income/add">
    //           <i className="fas fa-folder"></i>
    //           add income
    //         </Link>
    //         <div className="card-tools">
    //           <button
    //             type="button"
    //             className="btn btn-tool"
    //             data-card-widget="collapse"
    //             title="Collapse"
    //           >
    //             <i className="fas fa-minus" />
    //           </button>
    //           <button
    //             type="button"
    //             className="btn btn-tool"
    //             data-card-widget="remove"
    //             title="Remove"
    //           >
    //             <i className="fas fa-times" />
    //           </button>
    //         </div>
    //       </div>
    //       <div className="card-body p-0">
    //         <table className="table table-striped projects">
    //           <thead>
    //             <tr>
    //               <th style={{ width: "1%" }}>ID</th>
    //               <th style={{ width: "20%" }}>Income Name</th>
    //               {/* ... (other table headers) */}
    //               <th style={{ width: "20%" }}></th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {incomeList.map((income, index) => (
    //               <tr key={index}>
    //                 <td>{income.str_id}</td>
    //                 <td>
    //                   <a>{income.str_name}</a>
    //                   <br />
    //                   <small>Created {income.dtm_date}</small>
    //                 </td>
    //                 {/* ... (other table cells) */}
    //                 <td className="project-actions text-right">
    //                   <a className="btn btn-primary btn-sm" href="#">
    //                     <i className="fas fa-folder"></i>
    //                     View
    //                   </a>
    //                   <a className="btn btn-info btn-sm" href="#">
    //                     <i className="fas fa-pencil-alt"></i>
    //                     Edit
    //                   </a>
    //                   <a className="btn btn-danger btn-sm" href="#">
    //                     <i className="fas fa-trash"></i>
    //                     Delete
    //                   </a>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </section>
    // </>
    <>
      {/* <Spin spinning={spinning} fullscreen /> */}
      <Title level={2}>Income Master</Title>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add new
      </Button>
      {spinning ? (
        <Skeleton active />
      ) : (
        <>
          <Table
            scroll={{
              x: 1000,
              // y: 400,
            }}
            columns={columns}
            // expandable={{
            //   expandedRowRender: (record) => (
            //     <p
            //       style={{
            //         margin: 0,
            //       }}
            //     >
            //       {record.description}
            //     </p>
            //   ),
            //   rowExpandable: (record) => record.name !== 'Not Expandable',
            // }}
            dataSource={incomeList}
          />
        </>
      )}
    </>
  );
}

export default RefMasIncomeList;
