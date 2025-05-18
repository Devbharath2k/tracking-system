import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import Home from "./pages/Dashboard/Home.jsx";
import Expense from "./pages/Dashboard/Expense.jsx";
import Income from "./pages/Dashboard/Income.jsx";
import Layouts from "./components/layouts.jsx";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<Register />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/home" exact element={<Home />} />
          <Route path="/expense" exact element={<Expense />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/lagout" element={<Layouts/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

const Root = () => {
  const Authorization = !!localStorage.getItem("token");

  return Authorization ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
