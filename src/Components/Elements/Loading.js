import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Loading() {

  // useEffect(() => {
  //   const swalInstance = Swal.fire({
  //     title: "Loading",
  //     timerProgressBar: true,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });

  //   return () => {
  //     // Cleanup function, runs on component unmount
  //     if (swalInstance) {
  //       swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
  //     }
  //   };
  // }, []); // Empty dependency array to run the effect only once

  return <><Spin spinning={true} fullscreen /></>;
}

export default Loading;
