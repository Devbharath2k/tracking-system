import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layouts from "../components/layouts";
import Register from "./Register";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      setError("Both fields are required.");
      return;
    }
  

    // Simulated login
    console.log("Logging in with", values);
    setError(null);
    navigate("/dashboard"); // Adjust the path as needed
  };

  return (
    <Layouts>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center capitalize">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-1 mb-6">
          Kindly enter your details to log in
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 capitalize">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label 
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-black"
              placeholder="Email.com"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 text-black"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="min-3 to max-4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Log In
          </button>
          <p className="text-black text-sm pt-3">
            If you don't have an account,{" "}
            <span className="font-bold text-violet-600 hover:underline mt-4">
              <Link to="/signUp">Kindly Sign Up here</Link>
            </span>
          </p>
        </form>
      </div>
    </Layouts>
  );
}

export default Login;
