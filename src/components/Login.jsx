import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { setLoadUserCart } from '../app/CartSlice'
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setLoadUserFav } from '../app/FavSlice';
import { FiLoader } from "react-icons/fi";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); 
  let dispatch = useDispatch();

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(
      user => user.email === values.email && user.password === values.password
    );

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

  return (
    <div className="nike-container sm:py-4 min-h-[70vh] sm:h-auto flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[60%] sm:nike-container lg:w-[80%] shadow-2xl">
        <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">Login</h1>
        <form onSubmit={formik.handleSubmit} className='w-[80%] sm:w-[100%] mx-auto'>
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
            className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl 
              hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
            disabled={loading}
          >
            {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" />
              : "Login"}
          </button>

          <div className="flex sm:flex-col gap-2 flex-row justify-between mt-4">
            <Link className="text-sm ml-2 text-blue-800 hover:text-blue-500 cursor-pointer duration-500 transition-all">
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
