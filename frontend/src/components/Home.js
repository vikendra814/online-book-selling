import { bookListing, deletebook } from "../services/service";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "../utils/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Home() {
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();
  const [delId, setDelId] = useState("");
  const [book, setBook] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const modalRef = useRef();
  const { darkMode } = useContext(DarkModeContext);

  function handleOpen(id) {
    setDelId(id);
    setModalShow(true);
  }

  function handleClose() {
    setModalShow(false);
  }

  function handleDelete() {
    handleClose();
    deletebook({ id: delId })
      .then((response) => {
        if (response?.code === "1") {
          toast.success("Deleted successfully", {
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
          setBook((prevBook) => prevBook.filter((u) => u.id !== delId));
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
        toast.error("Failed to delete Book", {
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
      });
  }

  useEffect(() => {
    bookListing({ search: searchVal, page: currentPage, limit: 3 })
      .then((response) => {
        setBook(response.data.book);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching book data:", error);
      });
  }, [searchVal, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => (
    <ul className="pagination">
      {Array.from({ length: totalPages }, (_, index) => (
        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`container-fluid p-3 ${
        darkMode ? "bg-dark text-white" : "bg-white text-dark"
      }`}
      style={{ height: "95vh" }}
    >
      <ToastContainer />
      <Modal ref={modalRef} show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this book?</Modal.Body>
        <Modal.Footer>
          <button variant="secondary" onClick={handleClose}>
            Close
          </button>
          <button
            variant="primary"
            className="btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>

      <form className="form-inline py-2 pb-3 d-flex flex-row-reverse">
        <input
          className={`form-control me-2 w-25 ${
            darkMode ? "bg-secondary border-white" : "bg-white text-dark"
          }`}
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </form>
      {book?.length > 0 ? (
        <>
          <table className={`table mt-5 ${darkMode && "table-dark"}`}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Thubnail</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Book</th>
                <th scope="col">Added Date</th>
                <th scope="col">No Of Pages</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="algin-middle">
              {book.map((v) => (
                <tr key={v.id}>
                  <th scope="row">{v.id}</th>
                  <td>
                    <img
                      src={v.thumbnail}
                      style={{ height: "100px", width: "100px" }}
                      alt="thubnail"
                    />
                  </td>
                  <td>{v.title}</td>
                  <td>{v.author}</td>
                  <td>
                   
                        <Link to={v.book} target='_blank' className="btn btn-primary me-2"> Read  </Link>
                      </td>
                  <td>{v.cdate}</td>
                  <td>{v.no_of_pages}</td>
                  <td>{v.price}</td>
                  <td>
                    <div>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => handleOpen(v.id)}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/BookListing", { state: v })}
                        className="btn btn-danger"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center">
            {renderPagination()}
          </div>
        </>
      ) : (
        <div className="container-fluid">
          <div className="alert alert-warning">No Books Found!</div>
        </div>
      )}
    </div>
  );
}


