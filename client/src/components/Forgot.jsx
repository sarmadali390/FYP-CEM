import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Forgot.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { isAuth } from "./helpers";
import { Redirect } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const Forgot = () => {
  const MySwal = withReactContent(Swal)
  const [values, setValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setErrors(validate(values));
  };
  const validate = (values) => {
    let errors = {};
    if (!values.email) {
      errors.email = "**Email required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "**Email address is invalid";
    }
    let objectLenght = Object.keys(errors).length;
    if (!objectLenght) {
      const { email } = values;
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/forgot-password`,
        data: { email },
      })
        .then((response) => {
          // console.log(`Forgot password success`, response);
          // console.log("response ok hai",response)
          MySwal.fire({
            title: <strong>Hey!</strong>,
            html: <i>Reset password link is send to your email. Kindly check your Email and reset your password</i>,
            icon: 'success'
          })

          setValues({ ...values });
        })
        .catch((err) => {
          // console.log(`Forgot password error`, err.response.data);
          setValues({ ...values });
          // toast.error(err.response.data.error);
          window.alert(err.response);
        });
    }
    return errors;
  };

  return (
    <>
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
            <div className="d-table-cell align-middle">
              <div className="text-center mt-4">
                {/* {isAuth() ? <Redirect to="/" /> : null} */}
                <h1 className="h2">Reset password</h1>
                <p className="lead">Enter your email to reset your password.</p>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="m-sm-4">
                    <form>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          className="form-control form-control-lg"
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          onChange={handleChange("email")}
                          value={values.email}
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </div>
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={clickSubmit}
                        >
                          Reset password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Forgot;
