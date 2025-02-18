import React, { useState } from 'react';
import axios from 'axios';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const categories = [
  { id: 1, name: 'Tops' },
  { id: 2, name: 'Bottoms' },
  { id: 3, name: 'Accessories' },
  // Add more categories as needed
];

const sizeType = [
  { id: 1, name: 'Alphabetical' },
  { id: 2, name: 'Numerical' },
  { id: 3, name: 'Accessories' },
  // Add more categories as needed
];
const genders = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Kids' },
];
const colors = [
  { id: 1, name: 'Red' },
  { id: 2, name: 'Blue' },
  { id: 3, name: 'Green' },
  { id: 4, name: 'Yellow' },
  { id: 5, name: 'Purple' },
  { id: 6, name: 'Orange' },
  { id: 7, name: 'Pink' },
  { id: 8, name: 'Brown' },
  { id: 9, name: 'Gray' },
  { id: 10, name: 'Black' },
  { id: 11, name: 'White' },
  { id: 12, name: 'Cyan' },
  { id: 13, name: 'Magenta' },
  { id: 14, name: 'Lime' },
  { id: 15, name: 'Teal' },
  { id: 16, name: 'Indigo' },
  { id: 17, name: 'Violet' },
  { id: 18, name: 'Turquoise' },
  { id: 19, name: 'Maroon' },
  { id: 20, name: 'Olive' },
  { id: 21, name: 'Navy' },
  { id: 22, name: 'Gold' },
  { id: 23, name: 'Silver' },
  { id: 24, name: 'Beige' },
  { id: 25, name: 'Coral' },
  { id: 26, name: 'Salmon' },
  { id: 27, name: 'Khaki' },
  { id: 28, name: 'Lavender' },
  { id: 29, name: 'Mint' },
  { id: 30, name: 'Peach' },
];


function AddProduct() {
  const [variants, setVariants] = useState([{ color: '', sizes: [], images: [] }]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    category: '',
    sizeType: '',
    gender: '',
  });
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const[selectedSizeType, setSelectedSizeType] = useState(null);
  const[selectedGender, setSelectedGender] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
const [colorQuery, setColorQuery] = useState('');

const filteredColors = colorQuery === ''
  ? colors
  : colors.filter((color) => color.name.toLowerCase().includes(colorQuery.toLowerCase()));


  const handleAddVariant = () => {
    const sizes = productDetails.sizeType === 'alphabetical'
      ? ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({ size, quantity: 1, price: 0, discount: 0, finalPrice: 0 }))
      : Array.from({ length: 19 }, (_, i) => ({ size: (28 + i).toString(), quantity: 1, price: 0, discount: 0, finalPrice: 0 }));

    setVariants([...variants, { color: '', sizes, images: [] }]);
  };

  const handleVariantChange = (variantIndex, sizeIndex, field, value) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes[sizeIndex][field] = value;
    setVariants(newVariants);
  };



  const handleColorChange = (variantIndex, color) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].color = color; // Assuming variant object has a color property
    setVariants(updatedVariants);
  };
  
  const handleImageUpload = (variantIndex, files) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.push(...Array.from(files).map(file => URL.createObjectURL(file)));
    setVariants(newVariants);
  };

  const handleRemoveImage = (variantIndex, imgIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.splice(imgIndex, 1);
    setVariants(newVariants);
  };

  const handleProductDetailsChange = (field, value) => {
    setProductDetails({ ...productDetails, [field]: value });
    if (field === 'sizeType') {
      const newVariants = variants.map(variant => ({
        ...variant,
        sizes: value === 'numerical'
          ? Array.from({ length: 19 }, (_, i) => ({
            size: (28 + i).toString(),
            quantity: 1,
            price: 0,
            discount: 0,
            finalPrice: 0
          }))
          : ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({
            size,
            quantity: 1,
            price: 0,
            discount: 0,
            finalPrice: 0
          }))
      }));
      setVariants(newVariants);
    }
  };

  const handleSubmit = async () => {
    const { name, description, gender } = productDetails;

    if (!name || !description || !selectedCategory || !gender) {
      setError('Please fill in all required fields.');
      return;
    }

    const data = { ...productDetails, category: selectedCategory.name, sizeType:selectedSizeType.name, genders:selectedGender.name, variants };
    setProductData(data);
    setError('');
    console.log('Submitting data:', data);
    try {
      const response = await axios.post('https://your-api-endpoint.com/api/add-product', data);

      if (response.status === 200) {
        // Handle success
        console.log('Product added successfully:', response.data);
        setProductData(response.data);
        setError('');
        // Reset form (optional)
        setProductDetails({
          name: '',
          description: '',
          gender: ''
        });
        setSelectedCategory(null);
        setSelectedSizeType(null);
        setSelectedGender(null);
        setVariants([]);
      } else {
        // Handle non-200 status codes
        setError('Failed to add product. Please try again.');
      }
    } catch (error) {
      // Handle errors
      console.error('Error adding product:', error);
      setError('An error occurred while adding the product. Please try again.');
    }
  };

  const filteredCategories = query === ''
    ? categories
    : categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()));
    const filteredSizeTypes = query === ''
    ? sizeType
    : sizeType.filter((sizeType) => sizeType.name.toLowerCase().includes(query.toLowerCase()));
    const filteredGender = query === ''
    ? genders
    : genders.filter((genders) => genders.name.toLowerCase().includes(query.toLowerCase()));


  

  return (
    <div className="p-4 lg:ml-10 xl:ml-80 m-5 sm:p-6 bg-white shadow rounded-md">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Add Product</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={productDetails.name}
              onChange={(e) => handleProductDetailsChange('name', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 p-2 w-full border rounded-md"
              value={productDetails.description}
              onChange={(e) => handleProductDetailsChange('description', e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Combobox
              as="div"
              value={selectedCategory}

              onChange={(category) => {
                setQuery('');
                setSelectedCategory(category);
             
              }}
            >
              <div className="relative mt-2">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(category) => category?.name}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                {filteredCategories.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCategories.map((category) => (
                      <ComboboxOption
                        key={category.id}
                        value={category}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                      >
                        <span className="block truncate group-data-[selected]:font-semibold">{category.name}</span>

                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Size Type</label>
            <Combobox
              as="div"
              value={selectedSizeType}
              onChange={(sizeType) => {
                setQuery('');
                setSelectedSizeType(sizeType);
                handleProductDetailsChange('sizeType', sizeType.name);
                const newVariants = variants.map(variant => ({
                  ...variant,
                  sizes: sizeType.name === 'Numerical'
                    ? Array.from({ length: 19 }, (_, i) => ({
                      size: (28 + i).toString(),
                      quantity: 1,
                      price: 0,
                      discount: 0,
                      finalPrice: 0
                    }))
                    : ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({
                      size,
                      quantity: 1,
                      price: 0,
                      discount: 0,
                      finalPrice: 0
                    }))
                }));
                setVariants(newVariants);
              }}
            >
              <div className="relative mt-2">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(sizeType) => sizeType?.name}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>
                {filteredSizeTypes.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredSizeTypes.map((sizeType) => (
                      <ComboboxOption
                        key={sizeType.id}
                        value={sizeType}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                      >
                        <span className="block truncate group-data-[selected]:font-semibold">{sizeType.name}</span>
                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <Combobox
              as="div"
              value={selectedGender}
              onChange={(genders) => {
                setQuery('');
                setSelectedGender(genders);
              }}
            >
              <div className="relative mt-2">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(genders) => genders?.name}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                {filteredGender.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredGender.map((genders) => (
                      <ComboboxOption
                        key={genders.id}
                        value={genders}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                      >
                        <span className="block truncate group-data-[selected]:font-semibold">{genders.name}</span>

                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
            onClick={handleSubmit}
          >
            Add Product
          </button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>

        <div className="w-full lg:w-1/2 p-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Variants</h2>
          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="mb-4 p-4 border rounded-lg">
     
              <div className="mb-4 w-1/8">
  <label className="block text-sm font-medium text-gray-700">Color</label>

  <Combobox
  as="div"
  value={selectedColor}

  onChange={(color) => {
    console.log('Selected Color:', color); // Debugging
    setSelectedColor(color);
    handleColorChange(variantIndex, color);
  }}
  
>
  <div className="relative mt-2">
    <ComboboxInput
      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      onChange={(event) => setColorQuery(event.target.value)}
      displayValue={(color) => color?.name}
    />
    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </ComboboxButton>

    {filteredColors.length > 0 && (
      <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {filteredColors.map((color) => (
          <ComboboxOption
            key={color.id}
            value={color}
            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
          >
            <span className="block truncate group-data-[selected]:font-semibold">{color.name}</span>
            <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    )}
  </div>
</Combobox>

  <div
                  className="m-2 w-8 h-8 rounded-full"
                  style={{ backgroundColor: variant.color.name|| '#e5e7eb' }} // Fallback to gray if no color
                ></div>
                <button
                  className="ml-2 text-red-500"
                  onClick={() => {
                    const newVariants = variants.filter((_, index) => index !== variantIndex);
                    setVariants(newVariants);
                  }}
                >
                  Remove Variant
                </button>
</div>

              {variant.sizes.map((size, sizeIndex) => (
                <div key={sizeIndex} className="mb-4 border rounded-lg p-2 relative mt-5">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="block text-sm font-medium text-gray-700">Size: {size.size}</span>
                    <button
                      className="text-red-500"
                      onClick={() => {
                        const newVariants = [...variants];
                        newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, idx) => idx !== sizeIndex);
                        setVariants(newVariants);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex mb-2 space-x-2">
  <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700">Quantity</label>
    <input
      type="number"
      className="p-2 border rounded-md w-20 text-sm"
      value={size.quantity}
      onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'quantity', e.target.value)}
      min="1"
    />
  </div>

  <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700">Price</label>
    <input
      type="number"
      className="p-2 border rounded-md w-20 text-sm"
      value={size.price}
      onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'price', e.target.value)}
    />
  </div>

  <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700">Discount</label>
    <input
      type="number"
      className="p-2 border rounded-md w-20 text-sm"
      value={size.discount}
      onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'discount', e.target.value)}
    />
  </div>

  <div className="flex flex-col">
    <label className="block text-sm font-medium text-gray-700">Final Price</label>
    <input
      type="number"
      className="p-2 border rounded-md w-20 text-sm"
      value={size.finalPrice}
      onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'finalPrice', e.target.value)}
    />
  </div>
</div>






                </div>
              ))}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id={`upload-${variantIndex}`}
                    onChange={(e) => handleImageUpload(variantIndex, e.target.files)}
                  />
                  <label
                    htmlFor={`upload-${variantIndex}`}
                    className="flex items-center justify-center w-24 h-24 bg-gray-200 border border-gray-300 text-gray-500 rounded-md cursor-pointer"
                  >
                    <span>+</span>
                  </label>
                  {variant.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="relative ml-4">
                      <img
                        src={image}
                        alt={`variant-${variantIndex}-img-${imgIndex}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => handleRemoveImage(variantIndex, imgIndex)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleAddVariant}
          >
            Add Variant
          </button>
        </div>
      </div>

      {productData && (
        <div className="mt-8 p-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-4">Product Data</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Product Details</h4>
              <p><strong>Name:</strong> {productData.name}</p>
              <p><strong>Description:</strong> {productData.description}</p>
              <p><strong>Category:</strong> {productData.category}</p>
              <p><strong>Size Type:</strong> {productData.sizeType}</p>
              <p><strong>Gender:</strong> {productData.gender}</p>
            </div>
            <div>
              <h4 className="font-semibold">Variants</h4>
              {productData.variants.map((variant, idx) => (
                <div key={idx} className="border rounded-lg p-4 mb-4">
                  <p><strong>Color:</strong> {variant.color}</p>
                  {variant.sizes.map((size, sizeIdx) => (
                    <div key={sizeIdx} className="border-t pt-2 mt-2">
                      <p><strong>Size:</strong> {size.size}</p>
                      <p><strong>Quantity:</strong> {size.quantity}</p>
                      <p><strong>Price:</strong> {size.price}</p>
                      <p><strong>Discount:</strong> {size.discount}</p>
                      <p><strong>Final Price:</strong> {size.finalPrice}</p>
                    </div>
                  ))}
                  {variant.images.length > 0 && (
                    <div className="mt-2">
                      <strong>Images:</strong>
                      <div className="flex mt-2">
                        {variant.images.map((image, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={image}
                            alt={`variant-${idx}-img-${imgIdx}`}
                            className="w-24 h-24 object-cover rounded-md mr-2"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;