import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoReloadCircle } from 'react-icons/io5';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLoader } from "react-icons/fi";
import toast from 'react-hot-toast';

const NewPass = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize useNavigate
  const { email } = location.state || {}; // Extract email from state

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,10}$/,
        'Password must be 6-10 characters long, start with an uppercase letter, and include at least one number')
      .required('Password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      rePassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(user => user.email === email); // Find user by email

      if (userIndex !== -1) {
        // Check if NewPassword exists and delete it
        delete users[userIndex].newPassword; // Delete old password if it exists
        users[userIndex].password = values.password; // Update password
        localStorage.setItem('users', JSON.stringify(users)); // Save updated users to localStorage
        toast.success('Password updated successfully!');
       setTimeout(() => {
         setLoading(false);
          navigate('/login'); // Redirect to login page after success
        }, 3000);
      } else {
        toast.error('User not found.');
        setLoading(false);
      }

    },
  });

  return (
    <div className="nike-container sm:py-4 min-h-[70vh] sm:h-auto flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[60%] sm:nike-container lg:w-[80%] shadow-2xl">
        <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">New Password</h1>
        <form onSubmit={formik.handleSubmit} className='w-[80%] sm:w-[100%] mx-auto'>

          {/* Password */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <RiLockPasswordFill className="text-[18px] text-black" />
            <input
              id="password"
              className="pl-2 w-full outline-none border-none text-black"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            <div onClick={togglePasswordVisibility} className="cursor-pointer">
              {showPassword ? <FaEye className="text-[18px] text-black" /> : <FaRegEyeSlash className="text-[18px] text-black" />}
            </div>
          </div>
          {formik.errors.password && formik.touched.password && (
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
              {formik.errors.password}
            </div>
          )}

          {/* Re-Password */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <IoReloadCircle className="text-[18px]" />
            <input
              id="rePassword"
              className="pl-2 w-full outline-none border-none"
              type={showRePassword ? "text" : "password"}
              name="rePassword"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              value={formik.values.rePassword}
              onBlur={formik.handleBlur}
            />
            <div onClick={toggleRePasswordVisibility} className="cursor-pointer text-black">
              {showRePassword ? <FaEye className="text-[18px]" /> : <FaRegEyeSlash className="text-[18px]" />}
            </div>
          </div>
          {formik.errors.rePassword && formik.touched.rePassword && (
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
              {formik.errors.rePassword}
            </div>
          )}

          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl 
              hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
            disabled={loading}
          >
            {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" />
              : "Update Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default NewPass;
