import { useNavigate } from "react-router-dom";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Breadcrumb, Button, Skeleton, Spin, Table } from "antd";
import Title from "antd/es/typography/Title";

function RefMasExpenseList() {
  const isMounted = useRef(true);
  const [expenseList, setExpenseList] = useState([]);
  const navigate = useNavigate();
  const [spinning, setSpinning] = React.useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "str_id",
      key: "str_id",
    },
    {
      title: "Name",
      dataIndex: "str_name",
      key: "str_name",
    },
    {
      title: "Created date",
      dataIndex: "dtm_date",
      key: "dtm_date",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => <a>Delete</a>,
    },
  ];

  const handleAdd = () => {
    navigate("/home/ref-expense/add");
  };

  useEffect(() => {
    // if (isMounted.current) {
    setSpinning(true);
    // const swalInstance = Swal.fire({
    //   title: "Loading",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const fetchData = async () => {
      try {
        console.log(process.env.REACT_APP_API_URL);
        const response = await Axios.get(
          `${process.env.REACT_APP_API_URL}api/ref-expense/getexpense`
        );

        console.log("Expense List Data:", response.data);

        // Set the fetched data to the state
        setExpenseList(response.data);
        // if (swalInstance) {
        //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        // }
        setSpinning(false);
      } catch (error) {
        console.error("Error fetching expense list:", error);
      }
    };

    fetchData();
    //   isMounted.current = false;
    // }
  }, []);

  return (
    <>
      {/* <Spin spinning={spinning} fullscreen /> */}
      <Title level={2}>Expense Master</Title>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add new
      </Button>
      {spinning ? (
        <Skeleton active />
      ) : (
        <>
          <Table
            columns={columns}
            scroll={{
              x: 1000,
              // y: 400,
            }}
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
            dataSource={expenseList}
          />
        </>
      )}
    </>
  );
}

export default RefMasExpenseList;
