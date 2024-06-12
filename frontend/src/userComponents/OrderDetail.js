// import {orderHistory } from "../services/service";
// import React, { useState, useEffect, useContext } from "react";
// import "react-toastify/dist/ReactToastify.css";
// import { DarkModeContext } from "../utils/ThemeContext";

// export default function OrderHistory() {
//   const [order, setOrder] = useState([]);
//   const { darkMode } = useContext(DarkModeContext);

//   useEffect(() => {
//    orderHistory()
//       .then((response) => {
//         setOrder(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//       });
//   },[]);

//   return (
//     <div
//       className={`container-fluid p-3 ${
//         darkMode ? "bg-dark text-white" : "bg-white text-dark"
//       }`}
//       style={{ height: "90vh" }}
//     >
//       {order?.length > 0 ? (
//         <>
//           <table className={`table mt-5 ${darkMode && "table-dark"}`}>
//             <thead>
//               <tr>
//                 <th scope="col">ID</th>
//                 <th scope="col">Order No</th>
//                 <th scope="col">Order Date</th>
//                 <th scope="col">Total Quantity</th>
//                 <th scope="col">Sub Total</th>
//                 <th scope="col">Delivery Charges</th>
//                 <th scope="col">Total Amount</th>
//                 <th scope="col">Order Status</th>
//               </tr>
//             </thead>
//             <tbody className="algin-middle">
//               {order.map((v) => (
//                 <tr key={v.id}>
//                   <th scope="row">{v.id}</th>
//                   <td>{v.order_no}</td>
//                   <td>{v.cdate}</td>
//                   <td>{v.quantity}</td>
//                   <td>{v.sub_total}</td>
//                   <td>{v.delivery_charge}</td>
//                   <td>{v.total}</td>
//                   <td>{v.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         </>
//       ) : (
//         <div className="container-fluid">
//           <div className="alert alert-warning">No Order Found!</div>
//         </div>
//       )}
//     </div>
//   );
// }


import { orderHistory } from "../services/service";
import React, { useState, useEffect, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../utils/ThemeContext";
import "./OrderHistory.css"; // Assuming additional styles in OrderHistory.css

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    orderHistory()
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
      });
  }, []);

  return (
    <div
      className={`container-fluid p-3 ${
        darkMode ? "bg-dark text-white" : "bg-white text-dark"
      }`}
      style={{ minHeight: "90vh" }}
    >
      {orders?.length > 0 ? (
        <div className="row">
          {orders.map((order) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={order.id}>
              <div className={`card ${darkMode ? "bg-secondary" : "bg-light"} h-100`}>
                <div className="card-body">
                  <h5 className="card-title">Order No: {order.order_no}</h5>
                  <p className="card-text">
                    <strong>Order Date:</strong> {order.cdate}
                  </p>
                  <p className="card-text">
                    <strong>Total Quantity:</strong> {order.quantity}
                  </p>
                  <p className="card-text">
                    <strong>Sub Total:</strong> ₹{order.sub_total}
                  </p>
                  <p className="card-text">
                    <strong>Delivery Charges:</strong> ₹{order.delivery_charge}
                  </p>
                  <p className="card-text">
                    <strong>Total Amount:</strong> ₹{order.total}
                  </p>
                  <p className="card-text">
                    <strong>Order Status:</strong> {order.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning" role="alert">
          No Order Found!
        </div>
      )}
    </div>
  );
}
