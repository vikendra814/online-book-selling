import {orderListing,updateStatus } from "../services/service";
import React, { useState, useEffect, useContext } from "react";
 import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../utils/ThemeContext";

export default function OrderHistory() {
  const [order, setOrder] = useState([]);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
   orderListing()
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  },[]);


  function handleAccept(id) {
    updateStatus({ id: id, res: "accept" })
     .then((response) => {
        if (response?.code === "1") {
          toast.success("Order Accepted successfully", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: { margin: "10px" },
          });
          orderListing()
           .then((response) => {
              setOrder(response.data);
            })
           .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } else {
          toast.error(response?.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: { margin: "10px" },
          });
        }
      })
     .catch((error) => {
        console.error("Error updating order status:", error);
      });
  }
  function handleReject(id) {
    console.log(id);
    updateStatus({ id: id })
     .then((response) => {
        if (response?.code === "1") {
          toast.success("Order Rejected successfully", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: { margin: "10px" },
          });
          orderListing()
           .then((response) => {
              setOrder(response.data);
            })
           .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } else {
          toast.error(response?.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            style: { margin: "10px" },
          });
        }
      })
     .catch((error) => {
        console.error("Error updating order status:", error);
      });
  }

  return (
    <div
      className={`container-fluid p-3 ${
        darkMode ? "bg-dark text-white" : "bg-white text-dark"
      }`}
      style={{ height: "90vh" }}
    >
      {order?.length > 0 ? (
        <>
        <ToastContainer/>
          <table className={`table mt-5 ${darkMode && "table-dark"}`}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Order No</th>
                <th scope="col">Order Date</th>
                <th scope="col">Total Quantity</th>
                <th scope="col">Sub Total</th>
                <th scope="col">Delivery Charges</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Order Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="algin-middle">
              {order.map((v) => (
                <tr key={v.id}>
                  <th scope="row">{v.id}</th>
                  <td>{v.order_no}</td>
                  <td>{v.cdate}</td>
                  <td>{v.quantity}</td>
                  <td>{v.sub_total}</td>
                  <td>{v.delivery_charge}</td>
                  <td>{v.total}</td>
                  <td>{v.status}</td>
                  <td>
                    <div>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => handleReject(v.id)}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(v.id)}
                        className="btn btn-primary"
                      >
                        Accept
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </>
      ) : (
        <div className="container-fluid">
          <div className="alert alert-warning">No Order Found!</div>
        </div>
      )}
    </div>
  );
}
