import React, { useState, useEffect , useContext } from "react";
import { allBookListing, addToCart } from "../services/service";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { DarkModeContext } from "../utils/ThemeContext";
import "./UserHome.css";

function UserHome() {
  const { darkMode } = useContext(DarkModeContext);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    allBookListing({ search: search }).then((r) => {
      setBooks(r.data);
    });
  }, [search]);

  const handleAddToCart = (book) => {
    addToCart({
      book_id: book.id,
      quantity: 1,
    }).then((response) => {
      if (response.code==='1') {
        toast.success("Added  successfully", {
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
        setCart((prevCart) => [...prevCart, book.id]);
      }
    });
  };

  return (
    <div className={`container-fluid  ${
      darkMode ? "bg-dark text-white" : "bg-white text-dark"
    }`} style={{height:"160vh"}}>
      <ToastContainer />
      <h3 className="text-center mb-4">Books</h3>
      <form className="form-inline my-4 d-flex justify-content-center">
        <input
          className="form-control w-50"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className="row">
        {books.length > 0 ? (
          books.map((book) => (
            <div className={`col-lg-3 col-md-4 col-sm-6 mb-4 ${
              darkMode ? "bg-dark text-white" : "bg-white text-dark"
            }`} key={book.id}>
              <div className={`card h-80 ${
      darkMode ? "bg-dark text-white border-white" : "bg-white text-dark"
    }`}>
                <img
                  src={book.thumbnail}
                  className="card-img-top"
                  alt={book.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">Author: {book.author}</p>
                  <p className="card-text">Pages: {book.no_of_pages}</p>
                  <p className="card-text">Price: &#x20b9;{book.price}</p>
                </div>
                <div className="card-footer d-flex justify-content-around">
                  <a
                    href={book.book}
                    className="btn btn-primary mt-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Book
                  </a>
                  {cart.includes(book.id) ? (
                    <button className="btn btn-secondary mt-auto" disabled>
                     Added
                    </button>
                  ) : (
                    <button
                      className="btn btn-success mt-auto"
                      onClick={() => handleAddToCart(book)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning w-100 text-center">
            No Book Found!
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHome;

