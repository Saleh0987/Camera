import React, { useState } from 'react';
import Item from '../utils/Item';
import Title from '../utils/Title';
import { FiSearch } from 'react-icons/fi'; // Import search icon
import { FiLoader } from 'react-icons/fi'; // Import loader icon

const Products = ({ ifExists, endpoint: { title, items } }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setSearchVisible] = useState(false); // Manage search visibility
  const [visibleItemsCount, setVisibleItemsCount] = useState(10); // Control how many items to show
  const [isLoading, setIsLoading] = useState(false); // Control loading state

  const filteredItems = items?.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to toggle search bar visibility
  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  const showMoreItems = () => {
    setIsLoading(true); 
    setTimeout(() => {
      setVisibleItemsCount(items.length); 
      setIsLoading(false); 
    }, 3000); 
  };

  return (
    <>
      <div className='nike-container py-4'>
        {/* Title and Search Icon in one row */}
        <div className="flex justify-between items-center">
          <Title title={title} />
          {/* Search Icon */}
          <FiSearch
            className="cursor-pointer text-white p-1 rounded-full border text-3xl hover:text-indigo-500 transition duration-300 transform hover:scale-110"
            onClick={toggleSearch}
          />
        </div>

        {/* Search Bar (appears on click) */}
        <div
          className={`relative flex items-center w-full max-w-md mx-auto mt-5 transition-all duration-500 ease-in-out transform ${
            isSearchVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <input
            type="text"
            placeholder="Search Products"
            className="w-full px-4 py-2 text-gray-700 border rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute right-3 text-gray-500" size={20} />
        </div>

        {/* Products Grid */}
        <div className={`grid items-center justify-items-center gap-7 lg:gap-5 mt-7 
        ${ifExists ? 'grid-cols-3 xl:grid-cols-2 sm:grid-cols-1' :
            'grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'}`}>
          {filteredItems.slice(0, visibleItemsCount)?.map((item, i) => (
            <Item {...item} key={i} ifExists={ifExists} />
          ))}
        </div>

        {/* Show More Button or Loader */}
        {visibleItemsCount < items.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={showMoreItems}
              className="px-6 py-2 text-white bg-indigo-600 rounded-sm hover:bg-indigo-700 transition duration-300 
              w-[150px] flex items-center justify-center"
            >
              {isLoading ? (
                <FiLoader className="animate-spin text-white text-xl" />
              ) : (
                "Show More"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
