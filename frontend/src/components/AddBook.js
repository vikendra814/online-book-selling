import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../utils/ThemeContext";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addBook } from "../services/service";
import { BorderBottom } from "@mui/icons-material";

function AddBook() {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");

  const getImage = (e) => {
    setThumbnail(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const getPDF = (e) => {
    setFile(e.target.files[0]);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("author", values.author);
    formData.append("thumbnail", thumbnail);
    formData.append("book_pdf", file);
    formData.append("no_of_pages", values.pages);
    formData.append("price", values.price);
    formData.append("tags", values.tags);

    addBook(formData).then((r) => {
      if (r.code === "1") {
        toast.success(r.message, {
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

        setTimeout(() => {
          navigate(`/home`);
        }, 1000);
      } else {
        toast.error(r.message, {
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
    });
  };

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center listing"
        style={{ backgroundColor: darkMode ? "black" : "white", height: "90vh" }}


      >
        <ToastContainer />
        <div className="row w-100 p-0 m-0">
          <div className="row m-0 p-0" id="login-form">
            <div className="col-lg-4 col-12 text-center">
              <h1 className={`${darkMode && "text-white"}`} id="login-text">
                Add Book
              </h1>
            </div>
          </div>

          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id={`${darkMode ? "email1" : "exampleInputEmail1"}`}
                aria-describedby="usernameHelp"
                placeholder="Title"
                {...register("title", {
                  required: "Please enter a title",
                  minLength: {
                    value: 3,
                    message: "Please enter a valid title. Min length 3.",
                  },
                })}
                style={
                  errors.title
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.title && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.title.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id={`${darkMode ? "email1" : "exampleInputEmail1"}`}
                aria-describedby="usernameHelp"
                placeholder="Author"
                {...register("author", {
                  required: "Please enter an author",
                  minLength: {
                    value: 3,
                    message: "Please enter a valid author. Min length 3.",
                  },
                  pattern: {
                    value: /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/,
                    message: "Please enter a valid author",
                  },
                })}
                style={
                  errors.author
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.author && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.author.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="file"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id="exampleInputEmail1"
                aria-describedby="usernameHelp"
                placeholder="Thumbnail"
                {...register("thumbnail", {
                  validate: {
                    validImage: (value) => {
                      const fileTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                      ];
                      const validFileType = fileTypes.includes(value[0]?.type);
                      return (
                        validFileType ||
                        "Only JPG, JPEG, or PNG images are allowed."
                      );
                    },
                  },
                })}
                onChange={(e) => getImage(e)}
                style={
                  errors.thumbnail
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.thumbnail && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.thumbnail.message}</b>
                </p>
              )}
              {preview && (
                <img
                  src={preview}
                  className="pt-3"
                  alt="Thumbnail"
                  style={{ maxWidth: "150px" }}
                />
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="file"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id="exampleInputEmail1"
                aria-describedby="usernameHelp"
                placeholder="Book"
                {...register("book_pdf", {
                  validate: {
                    validPDF: (value) => {
                      const fileTypes = ["application/pdf"];
                      const validFileType = fileTypes.includes(value[0]?.type);
                      return validFileType || "Only PDFs are allowed.";
                    },
                  },
                })}
                onChange={(e) => getPDF(e)}
                style={
                  errors.book_pdf
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.book_pdf && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.book_pdf.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id={`${darkMode ? "email1" : "exampleInputEmail1"}`}
                aria-describedby="emailHelp"
                placeholder="Total Pages"
                {...register("pages", {
                  required: "Please enter total pages",
                  pattern: {
                    value: /^\d+$/,
                    message: "Please enter a valid total",
                  },
                })}
                style={
                  errors.total_pages
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.total_pages && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.total_pages.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id={`${darkMode ? "email1" : "exampleInputEmail1"}`}
                aria-describedby="emailHelp"
                placeholder="Price"
                {...register("price", {
                  required: "Please enter a price",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid price",
                  },
                })}
                style={
                  errors.price
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.price && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.price.message}</b>
                </p>
              )}
            </div>

            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className={`form-control ${
                  darkMode ? "bg-secondary color-placeholder" : "bg-white"
                }`}
                id={`${darkMode ? "email1" : "exampleInputEmail1"}`}
                aria-describedby="emailHelp"
                placeholder="Tags"
                {...register("tags", {
                  required: "Please enter tags",
                  pattern: {
                    value: /^(([a-zA-Z](,)?)*)+$/i,
                    message: "Please enter a valid tag",
                  },
                })}
                style={
                  errors.tags
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.tags && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.tags.message}</b>
                </p>
              )}
            </div>

            <div className="mt-4 mb-4">
              <button
                type="submit"
                className="col-lg-4 col-12 btn btn-primary"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
}

export default AddBook;
