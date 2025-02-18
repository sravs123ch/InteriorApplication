import React, { useState } from 'react';
import axios from 'axios';

function CustomerSearch({ onCustomerSelect }) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://imlystudios-backend-mqg4.onrender.com/api/customers/getCustomerByNameEmailPhone', {
                params: {
                    query
                }
            });

            if (response.data && response.data.length > 0) {
                setSearchResults(response.data);
                setError(null);
            } else {
                setSearchResults([]);
                setError('No customers found');
            }
        } catch (error) {
            setSearchResults([]);
            setError('Error fetching customer data');
            console.error('Error fetching customer:', error);
        }
    };

    const handleSelectCustomer = (customer) => {
        onCustomerSelect(customer);
        setSearchResults([]);
        setQuery('');
    };

    return (
        <div className="mt-4 p-4 border rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Search Customer</h2>
            <input 
                type="text" 
                placeholder="Search by name, email or mobile number" 
                className="w-full p-2 border rounded mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button 
                onClick={handleSearch} 
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Search
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="mt-4">
                {searchResults.map((customer, index) => (
                    <div 
                        key={index} 
                        className="p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectCustomer(customer)}
                    >
                        {customer.customerFirstName} {customer.customerLastName} - {customer.customerPhone}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerSearch;
