import React, {  useState } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { authenticate } from "./helpers";
import Google from "./Google";
import "../css/Login.css"
import axios from "axios";
import Facebook from "./Facebook";

const Login = ({history}) => {
  // const history = ;
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const informParent = (response)=>{
    authenticate(response,()=>{
      // window.alert(`Hey ${response.data.user}, Welcome Back!`);
      window.alert("Google Login")
      history.push("/")

    })
  }
  const handleClick = (e) => {
    e.preventDefault();
    setErrors(validate(user));
  };

  const validate = (user) => {
    let errors = {};
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
    console.log(errors);
    let objectLenght = Object.keys(errors).length;
    if(!objectLenght){
      const {email,password}=user
      axios({
        method:"POST",
        url:`${process.env.REACT_APP_API}/signin`,
        data:{email,password}
      }).then((response)=>{
        console.log(`signin success response`, response);
        authenticate(response,()=>{
          setUser({
            ...user,
            email:"",
            password:""
          });
          window.alert(`Hey ${response.data.user}, Welcome Back!`);
          // window.alert("")
          history.push("/")

        })
      })
    }
    return errors;
  };



  // const informParent = (response) => {
  //   authenticate(response, () => {
  //     // console.log("Authenticate")

  //     // isAuth() && isAuth().role === "admin"
  //     //   ? history.push("/admin")
  //     //   : history.push("/private");
  //   });
  // };

  // post data using axios
  
   //   post data
  //  const postData = async (event) => {
  //   event.preventDefault();
  //   const {email, password } = user;
  //   const res = await fetch("/api/users/signin", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
        
  //       email,
  //       password,
      
  //     }),
  //   });
  //   const data = await res.json();
  //   console.log("JSON DATA", data);
  //   if (!data) {
  //     window.alert("Invalid Registration");
  //     console.log("Invalid Registration");
  //   } else {
  //     window.alert(`Verification email is sent to ${email}`);
  //   }
  // };
  return (
    <>
      <div className="log-main-w3layouts log-wrapper text-white">
      <h1 className="log-h1 text-center">Signin</h1>
      <Google informParent={informParent}  className=""/>
      {/* <Facebook informParent={informParent} /> */}
        <div className="log-main-agileinfo" style={{marginTop:'5px'}}>
          <div className="log-agileits-top">
            {/* {faGoogle} */}
            <form action="#" method="post" >
              <input
                className="log-text email placeholder log-emailInput"
                type="email"
                name="email"
                placeholder="Email enter"
                required=""
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
              <input
                className="log-text placeholder text-white log-passwordInput"
                type="password"
                name="password"
                placeholder="Password"
                required=""
                value={user.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="text-danger">{errors.password}</span>
              )}
              <br />
               <Link
                to="/auth/password/forgot"
                // className="btn bt-sm btn-primary"
                style={{textDecoration:"none"}}
              >
                Forgot Password
              </Link>
              

              <input
                className="btn btn-outline-info"
                type="submit"
                value="Signin"
                onClick={handleClick}
              />
            </form>
           
            <p>
              Not registered ?<Link to="/signup" style={{textDecoration:"none"}} > create account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;

