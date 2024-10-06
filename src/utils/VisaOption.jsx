import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {  setClearCartItemsUser } from '../app/CartSlice';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';

const VisaOption = () => {

  const [isSecurityCodeVisible, setIsSecurityCodeVisible] = useState(false);
  const [isVisaVisible, setIsVisaVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSecurityCodeVisibility = () => {
    setIsSecurityCodeVisible(!isSecurityCodeVisible);
  };

    const onClearCartItems = () => {
    dispatch(setClearCartItemsUser());
  };

    const validationSchema = Yup.object({
      nameOnCard: Yup.string()
        .min(7, 'Name must be at least 7 characters long')
        .max(15, 'Name cannot exceed 15 characters')
        .required('Name is required'),
      cardNumber: Yup.string()
        .required('Card number is required')
        .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Card number must be in the format: 0000 0000 0000 0000')
        .length(19, 'Card number must be exactly 16 digits long with spaces'),
      expirationMonth: Yup.string().required('Expiration month is required'),
      expirationYear: Yup.string().required('Expiration year is required'),
      securityCode: Yup.string()
        .required('Security code is required')
        .matches(/^\d{3}$/, 'Security code must be 3 digits'),
    });

    const formik = useFormik({
      initialValues: {
        nameOnCard: '',
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        securityCode: '',
      },
      validationSchema: validationSchema,
      onSubmit: values => {
        if (isFormValid()) {
          handleVisaPayment(values);
        }
      },
    });

    const handleCardNumberChange = (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (value.length > 16) {
        value = value.slice(0, 16); // Limit to 16 digits
      }
      let formattedValue = value.match(/.{1,4}/g);
      formik.setFieldValue('cardNumber', formattedValue ? formattedValue.join(' ') : value);
    };

    const handleOptionChange = (e) => {
      setPaymentType(e.target.id); 
      if (e.target.id === 'type1') {
        setIsVisaVisible(true);
      } else {
        setIsVisaVisible(false);
      }
    };

    // Validation check for address availability and payment type
    // Modify the isFormValid function in VisaOption to ensure the user has an address and city
    const isFormValid = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!paymentType) {
      toast.error("Please select a payment method.");
      return false;
    }

    if (!loggedInUser || !loggedInUser.address || !loggedInUser.city || !loggedInUser.phone) {
      toast.error("Please ensure your address, city and phone are provided.");
      return false;
    } 

      return true;
    };


  // Function to calculate total amount
  const calculateTotalAmount = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const confirmOrderPlacement = () => {
  return Swal.fire({
    title: 'Are you sure?',
    text: "You are about to place your order.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, place order!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    return result.isConfirmed;
  });
};

  // Cash Payment Handler
  const handleCashPayment = async () => {
    if (!isFormValid()) return;

    const isConfirmed = await confirmOrderPlacement();
    if (!isConfirmed) return;
    setLoading(true);

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const cartItems = JSON.parse(localStorage.getItem(`cart_${loggedInUser?.email}`));
    const totalAmount = calculateTotalAmount(cartItems);

    let taxes = 14;
    let shippingCost = 0;
    let shippingMessage = '';

    if (totalAmount > 999) {
      shippingMessage = 'Shipping is free!';
    } else {
      shippingCost = 50;
      shippingMessage = 'There are shipping costs of $50.';
    }

    const finalAmount = totalAmount + taxes + shippingCost;

    const templateParams = {
      to_name: 'Store Owner',
      from_name: loggedInUser?.name || 'Unknown Customer',
      customer_name: `Name: ${loggedInUser?.name || 'N/A'}`,
      customer_email: `Email: ${loggedInUser?.email || 'N/A'}`,
      customer_address: `Address: ${loggedInUser?.address || 'N/A'}`,
      customer_city: `City: ${loggedInUser?.city || 'N/A'}`,
      customer_phone: `Phone: ${loggedInUser?.phone || 'N/A'}`,
      payment_method: 'Payment Method: Cash',
      cart_items: cartItems?.map(item => `
        Title: ${item.title}\n
        Quantity: ${item.cartQuantity}\n
        Price: $${item.price}\n
        Product ID: ${item.id}
        \n_____________________________\n
      `).join('\n') || 'No items in the cart.',
      total_amount: `Total: $${finalAmount.toFixed(2)}`,
      shipping_message: shippingMessage,
      tax_amount: `Taxes: $${taxes}`,
      shipping_cost: `Shipping Cost: $${shippingCost}`,
    };

    emailjs.send(
      'service_l2x5n7n',
      'template_9p3y9um',
      templateParams,
      'mcAaqOjKc68MCAfdJ'
    )
      .then(response => {
        setTimeout(() => {
        setLoading(false);
          toast.success('Order placed successfully!', response.status, response.text);
          onClearCartItems();
          navigate('/paymentsuccess');
        }, 3000); 
      })
      .catch(error => {
        toast.error('Failed to send email', error);
      });
  };

  // Visa Payment Handler
  const handleVisaPayment = async (visaData) => {
    if (!isFormValid()) return;
    
    const isConfirmed = await confirmOrderPlacement();
    if (!isConfirmed) return;
    setLoading(true);
    
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const cartItems = JSON.parse(localStorage.getItem(`cart_${loggedInUser?.email}`));
    const totalAmount = calculateTotalAmount(cartItems);

    let taxes = 14;
    let shippingCost = 0;
    let shippingMessage = '';

    if (totalAmount > 999) {
      shippingMessage = 'Shipping is free!';
    } else {
      shippingCost = 50;
      shippingMessage = 'There are shipping costs of $50.';
    }

    const finalAmount = totalAmount + taxes + shippingCost;

    const templateParams = {
      to_name: 'Store Owner',
      from_name: loggedInUser?.name || 'Unknown Customer',
      customer_name: `Name: ${loggedInUser?.name || 'N/A'}`,
      customer_email: `Email: ${loggedInUser?.email || 'N/A'}`,
      customer_address: `Address: ${loggedInUser?.address || 'N/A'}`,
      customer_city: `City: ${loggedInUser?.city || 'N/A'}`,
      customer_phone: `Phone: ${loggedInUser?.phone || 'N/A'}`,
      payment_method: 'Payment Method: Visa',
      card_details: `
        Name on Card: ${visaData.nameOnCard}\n
        Card Number: ${visaData.cardNumber}\n
        Expiration: ${visaData.expirationMonth}/${visaData.expirationYear}\n
        Security Code: ${visaData.securityCode}\n
      `,
      cart_items: cartItems?.map(item => `
        Title: ${item.title}\n
        Quantity: ${item.cartQuantity}\n
        Price: $${item.price}\n
        Product ID: ${item.id}
        \n_____________________________\n
      `).join('\n') || 'No items in the cart.',
      total_amount: `Total: $${finalAmount.toFixed(2)}`,
      shipping_message: shippingMessage,
      tax_amount: `Taxes: $${taxes}`,
      shipping_cost: `Shipping Cost: $${shippingCost}`,
    };

    emailjs.send(
      'service_l2x5n7n',
      'template_9p3y9um',
      templateParams,
      'mcAaqOjKc68MCAfdJ'
    )
      .then(response => {
        setTimeout(() => {
          setLoading(false);
          toast.success('Order placed successfully!', response.status, response.text);
          onClearCartItems();
          navigate('/paymentsuccess');
        }, 3000); 
      })
      .catch(error => {
        toast.error('Failed to send email', error);
      });
  };

  return (
    <>
      <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 
      text-gray-800 font-light mb-6">
        <form onSubmit={formik.handleSubmit}>

          {/* Visa option */}
          <div className="w-full p-3 border-b border-gray-200">
            <label htmlFor="type1" className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-500"
                name="type"
                id="type1"
                onChange={handleOptionChange}
              />
              <img
                src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                alt="Visa"
                className="h-6 ml-3"
              />
            </label>
          </div>

          {/* Cash option */}
          <div className="w-full p-3">
            <label htmlFor="type2" className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-indigo-500"
                name="type"
                id="type2"
                onChange={handleOptionChange}
              />
              <span className="ml-3 font-semibold">Cash on delivery</span>
            </label>
          </div>

          {isVisaVisible && (
            <>
              <div className="w-full p-3">
                <div className="mb-3">
                  <label htmlFor="nameOnCard" className="text-gray-600 font-semibold text-sm mb-2 ml-1">Name on card</label>
                  <div>
                    <input
                      id="nameOnCard"
                      name="nameOnCard"
                      className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="John Smith"
                      value={formik.values.nameOnCard}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.nameOnCard && formik.errors.nameOnCard && (
                      <p className="text-red-500 text-sm">{formik.errors.nameOnCard}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="text-gray-600 font-semibold text-sm mb-2 ml-1">Card number</label>
                  <div>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="0000 0000 0000 0000"
                      value={formik.values.cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber && (
                      <p className="text-red-500 text-sm">{formik.errors.cardNumber}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3 -mx-2 flex items-end">
                  <div className="px-2 w-1/2">
                    <label htmlFor="expirationMonth" className="text-gray-600 font-semibold text-sm mb-2 ml-1">Expiration month</label>
                    <div>
                      <select
                        id="expirationMonth"
                        name="expirationMonth"
                        className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        value={formik.values.expirationMonth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                      </select>
                      {formik.touched.expirationMonth && formik.errors.expirationMonth && (
                        <p className="text-red-500 text-sm">{formik.errors.expirationMonth}</p>
                      )}
                    </div>
                  </div>
                  <div className="px-2 w-1/2">
                    <label htmlFor="expirationYear" className="text-gray-600 font-semibold text-sm mb-2 ml-1">Expiration year</label>
                    <div>
                      <select
                        id="expirationYear"
                        name="expirationYear"
                        className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        value={formik.values.expirationYear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">YY</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={String(new Date().getFullYear() + i).slice(2)}>{String(new Date().getFullYear() + i).slice(2)}</option>
                        ))}
                      </select>
                      {formik.touched.expirationYear && formik.errors.expirationYear && (
                        <p className="text-red-500 text-sm">{formik.errors.expirationYear}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-10 w-1/2">
                  <label htmlFor="securityCode" className="text-gray-600 font-semibold text-sm mb-2 ml-1">
                    Security code
                    <button
                      type="button"
                      className="relative inline-block text-sm font-medium text-blue-500 ml-2"
                      onClick={toggleSecurityCodeVisibility}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      What is this?
                    </button>
                  </label>
                  <div>
                    <input
                      id="securityCode"
                      name="securityCode"
                      className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="000"
                      type="password"
                      value={formik.values.securityCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.securityCode && formik.errors.securityCode && (
                      <p className="text-red-500 text-sm">{formik.errors.securityCode}</p>
                    )}
                  </div>
                  {isSecurityCodeVisible && (
                    <div className="absolute z-10 p-2 mt-2 text-sm text-white bg-gray-800 rounded shadow-lg">
                      <p>The 3-digit code on the back of your card.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Conditionally render the buttons based on paymentType */}
          {paymentType && (
            <div className="w-full p-3 border-t border-gray-200">
              {paymentType === 'type1' && (
                <button
                  type={loading ? '' : 'submit'}
                  disabled={loading}
                  className="w-full px-3 py-2 mb-1 bg-indigo-500 
                  text-white font-semibold rounded-md 
                  hover:bg-indigo-600 transition-colors"
                >
                  {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" />
                  : "Pay with Visa"}
                </button>
              )}
              {paymentType === 'type2' && (
                <button
                  type={loading ? '' : 'submit'}
                  disabled={loading}
                  className="w-full px-3 py-2 mb-1 bg-green-500 text-white font-semibold rounded-md
                hover:bg-green-600 transition-colors"
                  onClick={handleCashPayment}
                >
                  {loading ?
                    <FiLoader className="inline-block animate-spin text-white text-xl" />
                  : "Pay with Cash"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default VisaOption;
