import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import VisaOption from './VisaOption';

const Address = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const UserProfile = JSON.parse(loggedInUser);
      setAddress(UserProfile.address || '');
      setCity(UserProfile.city || '');
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (values) => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const updatedUser = { ...loggedInUser, address: values.address, city: values.city };
    
    // Update loggedInUser in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

    // Update the user in the users list
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user =>
      user.email === loggedInUser.email ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setAddress(values.address);
    setCity(values.city);
    setIsEditing(false);
  };

  const validationSchema = Yup.object({
    address: Yup.string()
      .required('Address is required')
      .min(15, 'Address must be at least 15 characters long'),
    city: Yup.string()
      .required('City is required')
      .min(5, 'City must be at least 5 characters long')
  });

  return (
    <div className="px-3 sm:w-full md:w-5/12">
      <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
        <Formik
          initialValues={{ address, city }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSaveClick}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="w-full flex mb-3 items-center">
                <div className="w-50">
                  <span className="text-gray-600 font-semibold">Address :</span>
                </div>
                <div className="flex-grow pl-3">
                  {isEditing ? (
                    <div>
                      <Field
                        type="text"
                        name="address"
                        className="border p-1 w-full"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                    </div>
                  ) : (
                    <span>{address}</span>
                  )}
                </div>
                {!isEditing && (
                  <button onClick={handleEditClick} type="button" className="ml-2 text-blue-500 hover:text-blue-700">Edit</button>
                )}
              </div>
              <div className="w-full flex items-center">
                <div className="w-32">
                  <span className="text-gray-600 font-semibold">City :</span>
                </div>
                <div className="flex-grow pl-3">
                  {isEditing ? (
                    <div>
                      <Field
                        type="text"
                        name="city"
                        className="border p-1 w-full"
                      />
                      <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                    </div>
                  ) : (
                    <span>{city}</span>
                  )}
                </div>
              </div>
              {isEditing && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-3 bg-green-500 text-white p-2 rounded"
                >
                  Save
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <VisaOption />
    </div>
  );
};

export default Address;
