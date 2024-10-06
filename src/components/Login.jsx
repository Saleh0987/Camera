import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { setLoadUserCart } from '../app/CartSlice';
import { setLoadUserFav } from '../app/FavSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiLoader } from "react-icons/fi";
import axios from 'axios';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); 
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const user = storedUsers.find(user => user.email === values.email && user.password === values.password);

      if (user) {
        setLoading(true);
        setTimeout(() => {
          setLoggedInUser(user);
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          setLoading(false);
          toast.success(`Login successful! Welcome, ${user.name}!`);
          navigate('/');
          dispatch(setLoadUserCart(user));
          dispatch(setLoadUserFav(user));
        }, 3000);
      } else {
        toast.error('Invalid email or password');
      }
    },
  });

  // Google Login Integration
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleLoading(true);
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`)
        .then((res) => {
          const user = { email: res.data.email, token: codeResponse.access_token };
          const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

          const existingUser = storedUsers.find(u => u.email === user.email);
          if (existingUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(existingUser));
            toast.success(`Login successful! Welcome back, ${existingUser.name}!`);
            navigate('/');
            dispatch(setLoadUserCart(existingUser));
            dispatch(setLoadUserFav(existingUser));
          } else {
            toast.error('No existing account found. Please register.');
          }
          setGoogleLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setGoogleLoading(false);
          toast.error('Failed to login with Google');
        });
    },
    onError: () => {
      setGoogleLoading(false);
      toast.error('Google login failed');
    }
  });

  return (
    <div className="nike-container sm:py-4 min-h-[70vh] sm:h-auto flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[60%] sm:nike-container lg:w-[80%] shadow-2xl">
        <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">Login</h1>
        <form onSubmit={formik.handleSubmit} className='w-[80%] sm:w-[100%] mx-auto'>
          {/* Email and Password Inputs */}

          {/* Email */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl">
            <MdOutlineAlternateEmail className="text-[18px] text-black" />
            <input
              id="email"
              className="pl-2 w-full outline-none border-none text-black"
              type="email"
              name="email"
              placeholder="Your Email"
              onBlur={formik.handleBlur}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>
          {formik.errors.email && formik.touched.email &&
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
            {formik.errors.email}
          </div>}

          {/* Password */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <RiLockPasswordFill className="text-[18px] text-black" />
            <input
              id="password"
              className="pl-2 w-full outline-none border-none text-black"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Your Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            <div onClick={togglePasswordVisibility} className="cursor-pointer">
              {showPassword ? <FaEye className="text-[18px] text-black" /> : <FaRegEyeSlash className="text-[18px] text-black" />}
            </div>
          </div>
          {formik.errors.password && formik.touched.password &&
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
            {formik.errors.password}
          </div>}

          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 transition-all duration-500 text-white font-semibold mb-2"
            disabled={loading || googleLoading}>
            {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" /> : "Login"}
          </button>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => login()}
            className="block w-full bg-red-600 mt-5 py-2 rounded-2xl hover:bg-red-700 
            transition-all duration-500 text-white font-semibold"
            disabled={googleLoading || loading}>
            {googleLoading ? <FiLoader className="inline-block animate-spin text-white text-xl" /> : "Login with Google"}
          </button>

          {/* Links to Register and Forgot Password */}
            <div className="flex sm:flex-col gap-2 flex-row justify-between mt-4">
            <Link to={'/forgetpass'} className="text-sm ml-2 text-blue-800 hover:text-blue-500 cursor-pointer duration-500 transition-all">
              Forgot Password ?
            </Link>
            <Link to={'/register'} className="text-sm ml-2 text-blue-800 hover:text-blue-500 cursor-pointer duration-500 transition-all">
              Don't have an account yet?
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginForm;
