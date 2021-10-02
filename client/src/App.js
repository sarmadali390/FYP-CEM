import React from "react";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { Route, Switch } from "react-router";
import ComposeEmail from "./components/ComposeEmail";
import Activate from '../src/components/Activate'
import Forgot from "./components/Forgot";
import Reset from "./components/Reset";
import Home from "./components/Home";
const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home}/>
      <Route exact path="/signup" component={Registration} />
      <Route exact path = "/signin" component={Login}/>
      <Route exact path="/auth/activate/:token" component={Activate} />
      <Route exact path="/auth/password/forgot" component={Forgot}/>
      <Route exact path="/auth/password/reset/:token" component={Reset}/>
      <Route exact path="/compose" component={ComposeEmail} />
      </Switch>
    </>
  );
};

export default App;


