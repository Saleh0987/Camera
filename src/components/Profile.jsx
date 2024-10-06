import React, { useEffect, useState } from 'react';
import { FaEye, FaRegEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasToken, setHasToken] = useState(false); // Track if user has a token

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };
  
  const validationSchema = Yup.object({
    address: Yup.string()
      .required('Address is required')
      .min(15, 'Address must be at least 15 characters long'),
    city: Yup.string()
      .required('City is required')
      .min(5, 'City must be at least 5 characters long'),
    phone: Yup.string()
      .matches(/^(002|\+2)?01[0125][0-9]{8}$/, 'Invalid Egyptian phone number')
      .required('Phone number is required'),
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const UserProfile = JSON.parse(loggedInUser);
      setUser(UserProfile);
      setFullName(UserProfile.name);
      setPhone(UserProfile.phone);
      setAddress(UserProfile.address || ''); // Initialize address to empty if not present
      setCity(UserProfile.city || ''); // Initialize city to empty if not present

      // Check if the user has a token
      if (UserProfile.token) {
        setHasToken(true); // Set token flag if it exists
      }
    }
  }, []);

  // Check if there are any changes to the user data
  const hasChanges = () => {
    return (
      fullName !== user?.name ||
      phone !== user?.phone ||
      address !== user?.address ||
      city !== user?.city ||
      (newPassword && newPassword !== user?.password)
    );
  };

  const handleSubmit = () => {
    if (user && (hasToken || oldPasswordInput === user.password)) {
      const updatedUser = {
        ...user,
        ...(fullName !== user.name && { name: fullName }),
        ...(phone !== user.phone && { phone }),
        ...(address.trim() && address !== user.address && { address }),
        ...(city.trim() && city !== user.city && { city }),
        ...(newPassword && newPassword !== user.password && { password: newPassword }),
      };

      // Save the updated user object to local storage
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

      // Update user in the Users array in local storage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex((u) => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser; // Update the specific user entry
      }
      localStorage.setItem('users', JSON.stringify(users));

      // Update the user state
      setUser(updatedUser);

      // Clear password fields
      setOldPasswordInput('');
      setNewPassword('');

      // Hide additional fields
      setShowAdditionalFields(false);
      setErrorMessage('');
    } else {
      setErrorMessage('Old password is incorrect.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen nike-container p-4 text-black rounded-md bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold mb-3 text-xl text-gray-600">Personal Details</h2>
            <div className="bg-white rounded shadow-lg p-4 md:p-8 mb-6">
              <div className="grid gap-4 text-sm grid-cols-1">
                {/* Details */}
                <div className="lg:col-span-2">
                  <div className="grid gap-4 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="full_name">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        readOnly={!showAdditionalFields}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={user.email} // Display the original email
                        readOnly
                      />
                    </div>
                    {/* Phone */}
                    {(phone || showAdditionalFields) && (
                      <div className="md:col-span-5">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          readOnly={!showAdditionalFields}
                        />
                      </div>
                    )}

                    {/* Address and City */}
                    {(address || showAdditionalFields) && 
                      <div className="md:col-span-3">
                        <label htmlFor="address">Address / Street</label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          readOnly={!showAdditionalFields}
                        />
                      </div>
                    }

                    {/* City */}
                    {(city || showAdditionalFields) && 
                      <div className="md:col-span-2">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          readOnly={!showAdditionalFields}
                        />
                      </div>  
                    }

                    {/* Password */}
                    {showAdditionalFields && !hasToken && (
                      <>
                        <div className="md:col-span-5 relative">
                          <label htmlFor="oldpassword">Current Password</label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="oldpassword"
                            id="oldpassword"
                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                            value={oldPasswordInput}
                            onChange={(e) => setOldPasswordInput(e.target.value)}
                            placeholder="Current Password"
                          />
                          <div
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 bottom-1 transform -translate-y-1/2 cursor-pointer"
                          >
                            {showPassword ? (
                              <FaEye className="text-[18px] text-black" />
                            ) : (
                              <FaRegEyeSlash className="text-[18px] text-black" />
                            )}
                          </div>
                        </div>
                        {errorMessage && (
                          <div className="md:col-span-5 text-red-500">
                            {errorMessage}
                          </div>
                        )}
                      </>
                    )}
                    {showAdditionalFields && !hasToken && (
                      <div className="md:col-span-5 relative">
                        <label htmlFor="newpassword">New Password</label>
                        <input
                          type={showRePassword ? 'text' : 'password'}
                          name="newpassword"
                          id="newpassword"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                        />
                        <div
                          onClick={toggleRePasswordVisibility}
                          className="absolute right-3 bottom-1 transform -translate-y-1/2 cursor-pointer"
                        >
                          {showRePassword ? (
                            <FaEye className="text-[18px] text-black" />
                          ) : (
                            <FaRegEyeSlash className="text-[18px] text-black" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    {showAdditionalFields && hasChanges() && (
                      <div>
                        <button
                          onClick={handleSubmit}
                          className="h-10 px-6 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                    <button
                      onClick={toggleAdditionalFields}
                      className={`h-10 px-6 mt-4 rounded border border-gray-400 ${showAdditionalFields ? 'bg-gray-200' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                    >
                      {showAdditionalFields ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
