import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Link } from "react-router-dom";

function Signup() {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const router = useNavigate();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (values) => {
    signup({
      username: values.username,
      email: values.email,
      password: values.password,
      role:values.role,
      gender:values.gender
    }).then((r) => {
      if (r.data.length > 0 && r.code === "1") {
        Cookies.set("id", r.data[0].id, { expires: 7 });
        Cookies.set("username", r.data[0].username, { expires: 7 });
        Cookies.set("role", r.data[0].Role, { expires: 7 });
        toast(r.message);
        router(`/login`);
      } else {
        toast(r.message);
      }
    });
  };

  return (
    <>
      <div className="container-fluid m-0 p-0 my-3 ">
        <div className="row p-0 m-0" id="login-form">
          <div className="col-lg-4 col-12 text-center">
            <h1 className="my-4" id="login-text">
              Sign Up
            </h1>
          </div>
        </div>

        <ToastContainer />

        <div className="row p-0 m-0">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="usernameHelp"
                placeholder="Username"
                {...register("username", {
                  required: "Please enter an username",
                  pattern: {
                    value: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
                    message: "Please enter a valid username",
                  },
                })}
                style={
                  errors.username
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.username && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.username.message}</b>
                </p>
              )}
            </div>
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
                {...register("email", {
                  required: "Please enter an email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                style={
                  errors.email
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.email && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.email.message}</b>
                </p>
              )}
            </div>
            <div className="col-lg-4 col-12 mb-4 position-relative">
              <input
                type={type}
                name="password"
                autoComplete="current-password"
                className="form-control password"
                id="exampleInputPassword1"
                placeholder="Password"
                {...register("password", {
                  required: "Please enter password",
                  pattern: {
                    value:
                      /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                    message:
                      "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol.",
                  },
                })}
                style={
                  errors.password
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              <Icon
                className="position-absolute bi btn"
                icon={icon}
                size={25}
                onClick={handleToggle}
              />
              {errors.password && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.password.message}</b>
                </p>
              )}
            </div>
            <div className="col-lg-4 col-12 mb-3">
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Confirm Password"
                {...register("confirm_password", {
                  required: "Please enter confirm password",
                  validate: (val) => {
                    if (watch("password") !== val) {
                      return "Your passwords do no match";
                    }
                  },
                })}
                style={
                  errors.confirm_password
                    ? { backgroundColor: "rgba(255, 0, 0, 0.437)" }
                    : { backgroundColor: "white" }
                }
              />
              {errors.confirm_password && (
                <p className="text-start text-danger m-0 p-0 my-1">
                  <b>{errors.confirm_password.message}</b>
                </p>
              )}
            </div>

            {/*radio  */}
            <div className="mb-3">
        <FormControl error={!!errors.gender}>
          <FormLabel>Gender</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              value="F"
              control={<Radio />}
              label="Female"
              {...register("gender", { required: "Please select your gender" })}
            />
            <FormControlLabel
              value="M"
              control={<Radio />}
              label="Male"
              {...register("gender", { required: "Please select your gender" })}
            />
          </RadioGroup>
          {errors.gender && (
            <p className="text-danger">{errors.gender.message}</p>
          )}
        </FormControl>
      </div>

      <div className="mb-3">
        <FormControl error={!!errors.role}>
          <FormLabel>Role</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Admin"
              {...register("role", { required: "Please select your role" })}
            />
            <FormControlLabel
              value="user"
              control={<Radio />}
              label="User"
              {...register("role", { required: "Please select your role" })}
            />
          </RadioGroup>
          {errors.role && (
            <p className="text-danger">{errors.role.message}</p>
          )}
        </FormControl>
      </div>

            <div className="mt-4 mb-4">
              <button
                type="submit"
                className="col-lg-4 col-12 btn"
                id="login-btn"
              >
                Signup
              </button>
            </div>
            <Link to={'/login'}> If You Alredy Have Account!! Than Login</Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;

