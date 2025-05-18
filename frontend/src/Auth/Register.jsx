import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layouts from "../components/layouts";
import Login from '../Auth/Login.jsx'
import axiosInstance from "../utils/axiosintance";
import { APIpaths } from "../utils/apiPath";

// Default emoji image';

function Register() {
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    role: "",
    Profilphoto: "",
  });

  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValues((prevValues) => ({
          ...prevValues,
          Profilphoto: reader.result, // base64 image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!values.email || !values.password ||!values.fname || !values.lname || !values.role) {
      return setErrors("Both fields are required.");
    }

    const { fname,lname, email,  password, role } = values;

    try {
      const response = await axiosInstance.post(APIpaths.AUTH.REGISTER, {
        fname,
        lname,
        email,
        password,
        role,
      });
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };


  return (
    <div>
      <Layouts>
        <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center px-4">
          <h3 className="text-xl font-semibold text-black mt-8">
            Create an Account
          </h3>
          <p className="text-xs text-slate-700 mb-6 mt-5">
            Join us today by entering your details
          </p>

          {errors && <p className="text-red-500 text-sm mb-4">{errors}</p>}
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              
              <div className="flex flex-col items-center col-span-1 md:col-span-2">
                <label
                  htmlFor="Profilphoto"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="Profilphoto"
                  onChange={handleImageChange}
                  className="mb-2 text-black"
                />
                {values.Profilphoto && (
                  <img
                    src={values.Profilphoto}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full border border-gray-300 object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="fname"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  value={values.fname}
                  onChange={handleChange}
                  required
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-violet-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="lname"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  value={values.lname}
                  onChange={handleChange}
                  required
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

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
                  required
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={16}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={values.role}
                  onChange={handleChange}
                  required
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select a role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Register
            </button>

            <p className="text-sm mt-5 pt-3 text-slate-700 ">
              Already have an account?{" "}
              <span className="text-violet-600 font-semibold hover:underline cursor-pointer pt-10">
                <Link to="/login">Login</Link>
              </span>
            </p>
          </form>
        </div>
      </Layouts>
    </div>
  );
}

export default Register;
