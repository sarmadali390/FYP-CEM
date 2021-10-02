import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const Reset = ({ match }) => {
  const MySwal = withReactContent(Swal)
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);
  const { name, token, newPassword } = values;

  const handleChange = (event) => {
    console.log(event.target.value)
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    // setValues({ ...values });
    setErrors(validate(values));
  };
  // console.log("Req send");
  // console.log(newPassword);
  // console.log("On Submit values will be",values)
  const validate = (values) => {
    let errors = {};
    console.log("new Password",values.newPassword);

    if (!values.newPassword) {
      errors.newPassword = "**Password is required";
    } else if (values.newPassword.length < 6) {
      errors.newPassword = "**Password needs to be 6 characters or more";
    }
    let objectLenght = Object.keys(errors).length;
    if (!objectLenght) {
      const { newPassword } = values;
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/reset-password`,

        data: { newPassword, resetPasswordLink: token },
      })
        .then((response) => {
          console.log(`Reset password success`, response);
          // window.alert("Reset password success");
          MySwal.fire({
            title: <strong>Your Password is Successfully Updated</strong>,
            icon: 'success'
          })
          // toast.success(response.data.message);

          setValues({ ...values });
        })
        .catch((err) => {
          console.log(`Reset password error`, err.response);
          window.alert("reset password error");
          setValues({ ...values });
          // toast.error(err.response.data.error);
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
              <h1 className="p-5 text-center">
                      Hey {name}, Type your new password
                    </h1>
                {/* {isAuth() ? <Redirect to="/" /> : null} */}
                <h1 className="h2">Reset password</h1>
                <p className="lead">Enter your New Password Here</p>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="m-sm-4">
                   

                    <form>
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          name="password"
                          placeholder="Enter your new password here"
                          onChange={handleChange}
                          value={newPassword}
                        />
                        {errors.newPassword && (
                          <span className="text-danger">
                            {errors.newPassword}
                          </span>
                        )}
                      </div>
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-lg btn-primary"
                          onClick={clickSubmit}
                        >
                          Reset
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
export default Reset;
