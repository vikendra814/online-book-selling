import { useState, useEffect ,useContext} from "react";
import { getCartDetails, addToCart, placeOrder } from "../services/service";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../utils/ThemeContext";

function Cart() {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = () => {
    getCartDetails().then((r) => {
      setCart(r.data);
    });
  };

  const updateCart = (bookId, qty) => {
    addToCart({ book_id: bookId, quantity: qty }).then((response) => {
      if (response.success) {
        fetchCartDetails();
      }
    });
  };

  const increaseCart = (i) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[i].qty + 1;
    updatedCart[i] = { ...updatedCart[i], qty: newQty };
    setCart(updatedCart);
    updateCart(updatedCart[i].book_id, newQty);
  };

  const decreaseCart = (i) => {
    const updatedCart = [...cart];
    const newQty = updatedCart[i].qty - 1;
    if (newQty > 0) {
      updatedCart[i] = { ...updatedCart[i], qty: newQty };
      setCart(updatedCart);
      updateCart(updatedCart[i].book_id, newQty);
    } else {
      updateCart(updatedCart[i].book_id, 0);
    }
  };

  const handlePlaceOrder = () => {
    placeOrder().then((response) => {
      if (response.code==='1') {
        toast.success("Order Placed successfully", {
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
        fetchCartDetails();
        setTimeout(() => {
          navigate("/userHome");
        },1000);
        
      } else {
        alert("Failed to place order.");
      }
    });
  };

  return (
    <div className={`container-fluid p-0 ${
      darkMode ? "bg-dark text-white" : "bg-white text-dark"
    }`} style={{height:"90vh"}}>
      <ToastContainer />
      <h3 className="h3 py-3 text-center">Cart</h3>
      <div className="text-center">
        {cart?.length > 0 ? (
          <>
            {cart.map((v, i) => (
              <div className={`card mb-3 shadow-sm ${
                darkMode ? "bg-dark text-white border-white" : "bg-white text-dark"
              }`} key={i}>
                <div className="row g-0">
                  <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <img
                      src={v.thumbnail_image}
                      alt="book"
                      className="img-fluid rounded-start"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{v.title}</h5>
                      <p className="card-text">
                        <strong>Price:</strong> ₹{v.price}
                      </p>
                      <div className="input-group mb-3">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => decreaseCart(i)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={v.qty}
                          disabled
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => increaseCart(i)}
                        >
                          +
                        </button>
                      </div>
                      <p className="card-text">
                        <strong>Total:</strong> ₹{v.price * v.qty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-primary mt-3" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </>
        ) : (
          <div className="alert alert-warning" role="alert">
            Cart Empty!
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

