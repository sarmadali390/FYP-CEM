import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useHistory} from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Activate = ({ match }) => {
  const MySwal = withReactContent(Swal)
  const history = useHistory();
  const [values, setValues] = useState({
    name: "",
    token: "",
  });
  useEffect(() => {
    console.log(`use effect`);
    let token = match.params.token;
    console.log(token);
    let { name} = jwt.decode(token);
    // let abc = jwt.decode(token);
    // console.log(abc)
    if (token) {
      setValues({ ...values, name, token });
    }
    console.log(token);
  }, []);
  const { name, token } = values;
  const clickSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `http://localhost:5000/api/users/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log(`Account Activation`, response);
        // window.alert("Your Account is Activated. You can now Signin to our system")
        MySwal.fire({
          title: <strong>Good Job!</strong>,
          html: <i>Your Account is Activated</i>,
          icon: 'success'
        })
        history.push("/signin")
        setValues({
          ...values,
        });
      })
      .catch((err) => {
        console.log(`Account Activation error`, err.response.data.error);
      });
  };
    return (
        <>
      
      <div className="col-md-6 offset-md-3">
       
        <div className="text-center">
          <h1 className="p-5 text-black">Hey {name} Ready to Activate your account</h1>
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
          Activate Account
          </button>
        </div>
      </div>
    </>
    )
}
export default Activate;
