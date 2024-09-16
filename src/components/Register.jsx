import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SiNamecheap } from 'react-icons/si';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoReloadCircle } from 'react-icons/io5';
import { FaPhoneVolume, FaEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters long')
      .max(15, 'Name cannot exceed 15 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,10}$/,
        'Password must be 6-10 characters long, start with an uppercase letter, and include at least one number')
      .required('Password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
    phone: Yup.string()
      .matches(/^(002|\+2)?01[0125][0-9]{8}$/, 'Invalid Egyptian phone number')
      .required('Phone number is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    validationSchema,
    onSubmit: () => {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const existingUser = users.find(user => user.email === formik.values.email);

      if (existingUser) {
        setEmailError('Email already exists');
        return;
      }

      const newUser = {
        name: formik.values.name,
        email: formik.values.email,
        password: formik.values.password,
        phone: formik.values.phone,
      };
      setLoading(true);
      
      setTimeout(() => {
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setLoading(false);
        formik.resetForm();
        setEmailError('');
        navigate('/login');
        toast.success(`Registration Successfully`);
      }, 3000);
    },
  });

  return (
    <div className="nike-container sm:py-4 min-h-[70vh] sm:h-auto flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[60%] sm:nike-container lg:w-[80%] shadow-2xl">
        <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">Register</h1>
        <form onSubmit={formik.handleSubmit} className='w-[80%] sm:w-[100%] mx-auto'>
          {/* Name */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <SiNamecheap className="text-[18px]" />
            <input
              id="name"
              className="pl-2 w-full outline-none border-none"
              type="text"
              name="name"
              placeholder="Name"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.name && formik.touched.name &&
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
            {formik.errors.name}
          </div>}
          
          {/* Email */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <MdOutlineAlternateEmail className="text-[18px]" />
            <input
              id="email"
              className="pl-2 w-full outline-none border-none"
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
          {emailError &&
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
            {emailError}
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

          {/* Phone */}
          <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl text-black">
            <FaPhoneVolume className="text-[18px]" />
            <input
              id="phone"
              className="pl-2 w-full outline-none border-none"
              type="tel"
              name="phone"
              placeholder="Phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.phone && formik.touched.phone &&
            <div className="text-center p-2 mb-4 text-md text-red-500 rounded-lg bg-gray-800" role="alert">
            {formik.errors.phone}
          </div>}

          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 
            hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
            disabled={loading}
          >
            {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" />
              : "Sign Up"}
          </button>
          
          <div className="text-center mt-4">
            <Link to={'/login'} className="text-sm ml-2 text-blue-800 hover:text-blue-500 
            cursor-pointer duration-500 transition-all">
              Do you have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
