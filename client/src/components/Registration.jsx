import React, { useState } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../css/Registration.css";
import axios from "axios";
import jwt from "jsonwebtoken"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Registration = ({ submitForm }) => {
  const MySwal = withReactContent(Swal)

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({});
  const handleClick = (e) => {
    e.preventDefault();
    setErrors(validate(user));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validate = (user) => {
    let errors = {};
    if (!user.name.trim()) {
      errors.name = "**Name is required";
    }
    if (!user.phone) {
      errors.phone = "**Phone is required";
    }

    if (!user.email) {
      errors.email = "**Email required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "**Email address is invalid";
    }
    if (!user.password) {
      errors.password = "**Password is required";
    } else if (user.password.length < 6) {
      errors.password = "**Password needs to be 6 characters or more";
    }

    if (!user.cpassword) {
      errors.cpassword = "**Password is required";
    } else if (user.cpassword !== user.password) {
      errors.cpassword = "**Passwords do not match";
    }
    console.log(errors);
    let objectLenght = Object.keys(errors).length;
    console.log(objectLenght);
    if(!objectLenght){
      // postData();
      const {name,email,phone,password,cpassword}=user
      axios({
        method:"POST",
        url:`${process.env.REACT_APP_API}/signup`,
        data:{name,phone,email,password,cpassword}
      }).then((response)=>{
        // console.log('response.data',response.data)
        const data = jwt.decode(response.data)
        console.log("decoded data ",data)
        // window.alert(`Hey ${data.name} Activation Link is sent to ${data.email}`)
        MySwal.fire({
          title: <strong>Hi {data.name}!</strong>,
          html: <i>Activation Link is send to {data.email}</i>,
          icon: 'success'
        })

      })
    }
    return errors;
  };

  // getting full year
  const date = new Date();
  const getFullYear = date.getFullYear();

  //   toggle between show/hide password
  function myFunction() {
    let x = document.getElementById("myInput");
    let y = document.getElementById("showhide");
    if (y.type === "password" && x.type === "password") {
      y.type = "text";
      x.type = "text";
    } else {
      y.type = "password";
      x.type = "text";
    }
  }
  return (
    <>
      <div className="reg-main-w3layouts reg-wrapper">
        <h1 className="reg-h1">Create Account</h1>
        <p className="reg-p">Get your access today in one easy step</p>
        <div className="reg-main-agileinfo">
          <div className="reg-agileits-top">
            <form action="#" method="POST">
              <input
                className="reg-text reg-1"
                type="text"
                name="name"
                placeholder="Full Name"
                required=""
                autoComplete="off"
                value={user.name}
                onChange={handleChange}
                id="name"
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}

              <input
                className="reg-text reg-phone reg-2"
                type="phone"
                name="phone"
                placeholder="Phone"
                required=""
                autoComplete="off"
                value={user.phone}
                onChange={handleChange}
                id="phone"
              />
              {errors.phone && (
                <span className="text-danger">{errors.phone}</span>
              )}
              <input
                className="reg-text reg-email reg-3"
                type="email"
                name="email"
                placeholder="Email"
                value={user.email}
                autoComplete="off"
                required=""
                onChange={handleChange}
                id="email"
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
              <input
                className="reg-text reg-password reg-4"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                required=""
                value={user.password}
                id="showhide"
                onChange={handleChange}
              />
              {errors.password && (
                <span className="text-danger">{errors.password}</span>
              )}

              <input
                className="reg-text reg-cpassword reg-w3lpass reg-5"
                type="password"
                name="cpassword"
                value={user.cpassword}
                placeholder="Confirm Password"
                autoComplete="off"
                required=""
                id="myInput"
                onChange={handleChange}
              />
              {errors.cpassword && (
                <span className="text-danger">{errors.cpassword}</span>
              )}

              <div className="reg-wthree-text reg-checkbox">
                <label className="reg-anim">
                  <input
                    type="checkbox"
                    className="checkbox"
                    onClick={myFunction}
                  />
                  <span>Show Password</span>
                </label>
                <div className="reg-clear"> </div>
              </div>
              <input
                className="btn btn-outline-success"
                type="submit"
                value="SIGNUP"
                onClick={handleClick}
              />
            </form>
            <p className="reg-p">
              Don't have an Account?{" "}
              <Link className="reg-link" to="/signin">
                {" "}
                Login Now!
              </Link>
            </p>
          </div>
        </div>
        <div className="reg-colorlibcopy-agile">
          <p className="reg-p">
            © {getFullYear} CEM Signup Form. All rights reserved
          </p>
        </div>
      </div>
    </>
  );
};

export default Registration;
