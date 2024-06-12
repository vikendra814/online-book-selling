import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

function Posts() {
  const location = useLocation();
  const book = location.state;
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  return (
    <>
      <div className="container p-0">
        <ToastContainer />
        <div className="my-4 mx-auto p-3">
          <div className="col-lg-7 col-md-9 col-12 mb-4 mx-auto">
            <div className="card shadow-lg">
              {book?.thumbnail && (
                <img
                  src={book.thumbnail}
                  className="card-img-top rounded-1 mx-auto"
                  alt="Book Cover"
                  style={{
                    objectFit: "cover",
                    height: "auto",
                    maxHeight: "500px",
                    maxWidth: "100%",
                    objectPosition: "center",
                  }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title text-center">{book?.title}</h5>
                <p className="card-text text-center text-muted">
                  by {book?.author}
                </p>
                <p className="card-text text-center font-weight-bold">
                  ₹{book?.price}
                </p>
              </div>
              <div className="card-footer text-center mx-auto">
                <button className="btn btn-primary" onClick={handleHomeClick}>Home</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Posts;
