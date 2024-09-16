import React, { useEffect, useState } from 'react';
import { FaEye, FaRegEyeSlash } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const UserProfile = JSON.parse(loggedInUser);
      setUser(UserProfile);
      setFullName(UserProfile.name);
      setEmail(UserProfile.email);
      setPhone(UserProfile.phone);
      setAddress(UserProfile.address || '');
      setCity(UserProfile.city || '');
    }
  }, [showAdditionalFields]);

  const handleSubmit = () => {
    if (user && oldPasswordInput === user.password) {
      const updatedUser = {
        ...user,
        name: fullName,
        email,
        phone,
        password: newPassword || user.password,
        address,
        city,
        newPassword: newPassword || user.newPassword,
      };

      // Save the updated user object to local storage
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

      // Update user in the Users array in local storage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
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
            <h2 className="font-semibold text-xl text-gray-600">Personal Details</h2>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1">
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!showAdditionalFields}
                      />
                    </div>
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
                        {address ? <div className="md:col-span-3">
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
                        </div> : showAdditionalFields && <div className="md:col-span-3">
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
                        </div>}
                        {city ? <div className="md:col-span-2">
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
                        </div> : showAdditionalFields && <div className="md:col-span-2">
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
                        </div>}
                    {showAdditionalFields && (
                      <>
                        <div className="md:col-span-5 relative">
                          <label htmlFor="oldpassword">Current Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
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
                        <div className="md:col-span-5 relative">
                          <label htmlFor="newpassword">New Password</label>
                          <input
                            type={showRePassword ? "text" : "password"}
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
                          <div className="md:col-span-5 text-red-500">
                            <h4>Please insert Current password for save your edit</h4>
                          </div>
                      </>
                    )}
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={showAdditionalFields ? handleSubmit : toggleAdditionalFields}
                        >
                          {showAdditionalFields ? "Submit" : "Update"}
                        </button>
                      </div>
                    </div>
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
