// Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setCloseLogin } from '../app/UserSlice.js';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && storedUser.email === values.email && storedUser.password === values.password) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          dispatch(setCloseLogin(true));
          alert('Login successful!');
        }, 5000);
      } else {
        alert('Invalid email or password');
      }
    },
  });

  return (
    <div className="bg-white rounded-md p-4 w-full shadow-2xl">
      <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">Login</h1>
      <form onSubmit={formik.handleSubmit}>
        {/* Email */}
        <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl">
          <MdOutlineAlternateEmail className="text-[18px]" />
          <input
            id="email"
            className="pl-2 w-full outline-none border-none"
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        {/* Password */}
        <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl">
          <RiLockPasswordFill className="text-[18px]" />
          <input
            id="password"
            className="pl-2 w-full outline-none border-none"
            type="password"
            name="password"
            placeholder="Your Password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </div>
        <button
          type="submit"
      className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl 
          hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
