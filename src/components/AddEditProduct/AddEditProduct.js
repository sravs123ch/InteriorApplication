
import React, { useEffect, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useLocation, useNavigate } from 'react-router-dom';

// Sample data for categories, size types, genders, and colors
const categories = [
  { id: 1, name: 'Tops' },
  { id: 2, name: 'Bottoms' },
  { id: 3, name: 'Accessories' },
];

const sizeTypes = [
  { id: 1, name: 'Alphabetical' },
  { id: 2, name: 'Numerical' },
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
];

function AddEditProduct() {
  const [variants, setVariants] = useState([{ color: '', sizes: [], images: [] }]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    category: '',
    sizeType: '',
    gender: '',
    images: []
  });

  const navigate = useNavigate();
  const location = useLocation();

  const initialProduct = location.state?.product || {
    name: '',
    price: '',
    discount: '',
    size: '',
    sizeType: '',
    stock: '',
    imageurl: '',
    category: '',
    description: '',
    gender: ''
  };

  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSave = () => {
    console.log('Product saved:', product);
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [colorQuery, setColorQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSizeType, setSelectedSizeType] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const filteredCategories = query === ''
    ? categories
    : categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()));

  const filteredSizeTypes = query === ''
    ? sizeTypes
    : sizeTypes.filter((sizeType) => sizeType.name.toLowerCase().includes(query.toLowerCase()));

  const filteredGenders = query === ''
    ? genders
    : genders.filter((gender) => gender.name.toLowerCase().includes(query.toLowerCase()));

  const filteredColors = colorQuery === ''
    ? colors
    : colors.filter((color) => color.name.toLowerCase().includes(colorQuery.toLowerCase()));

  const handleAddVariant = () => {
    const sizes = productDetails.sizeType === 'Alphabetical'
      ? ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({ size, quantity: 1, price: 0, discount: 0, finalPrice: 0 }))
      : Array.from({ length: 19 }, (_, i) => ({ size: (28 + i).toString(), quantity: 1, price: 0, discount: 0, finalPrice: 0 }));

    setVariants([...variants, { color: '', sizes, images: [] }]);
  };

  const handleRemoveVariant = (variantIndex) => {
    setVariants(variants.filter((_, index) => index !== variantIndex));
  };

  const handleVariantChange = (variantIndex, sizeIndex, field, value) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes[sizeIndex][field] = value;
    setVariants(newVariants);
  };

  const handleColorChange = (variantIndex, color) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].color = color;
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
        sizes: value === 'Numerical'
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

  const handleProductImageUpload = (files) => {
    setProductDetails({
      ...productDetails,
      images: [...productDetails.images, ...Array.from(files).map(file => URL.createObjectURL(file))]
    });
  };

  const handleSubmit = () => {
    const { name, description, gender } = productDetails;

    if (!name || !description || !selectedCategory || !gender) {
      setError('Please fill in all required fields.');
      return;
    }

    const data = { ...productDetails, category: selectedCategory.name, sizeType: selectedSizeType.name, gender: selectedGender.name, variants };
    setProductData(data);
    setError('');
    console.log('Submitting data:', data);
  };

  return (
    <div className="p-4 lg:ml-10 xl:ml-80 m-5 sm:p-6 bg-white shadow rounded-md">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Edit Product</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={product.name}
              onChange={(e) => handleProductDetailsChange('name', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={product.price}
              onChange={(e) => handleProductDetailsChange('price', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Discount</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={product.discount}
              onChange={(e) => handleProductDetailsChange('discount', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Size Type</label>
            <Combobox
              as="div"
              value={selectedSizeType}
              onChange={(sizeType) => handleProductDetailsChange('sizeType', sizeType.name)}
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
                <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredSizeTypes.map((sizeType) => (
                    <ComboboxOption
                      key={sizeType.id}
                      value={sizeType}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>
                            {sizeType.name}
                          </span>
                          {selected && (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'
                                }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={product.stock}
              onChange={(e) => handleProductDetailsChange('stock', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Combobox
              as="div"
              value={selectedCategory}
              onChange={(category) => handleProductDetailsChange('category', category.name)}
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
                <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredCategories.map((category) => (
                    <ComboboxOption
                      key={category.id}
                      value={category}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>
                            {category.name}
                          </span>
                          {selected && (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'
                                }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 p-2 w-full border rounded-md"
              value={product.description}
              onChange={(e) => handleProductDetailsChange('description', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <Combobox
              as="div"
              value={product.gender}
              onChange={(gender) => handleProductDetailsChange('gender', gender.name)}
            >
              <div className="relative mt-2">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(gender) => gender?.name}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>
                <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredGenders.map((gender) => (
                    <ComboboxOption
                      key={gender.id}
                      value={gender}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>
                            {gender.name}
                          </span>
                          {selected && (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'
                                }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Images</label>
            <input
              type="file"
              className="mt-1 p-2 w-full border rounded-md"
              multiple
              onChange={(e) => handleProductImageUpload(e.target.files)}
            />
            <div className="mt-2 grid grid-cols-3 gap-2">
              {productDetails.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Product ${index + 1}`} className="w-full h-auto rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Variants</label>
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="border rounded-md p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Variant {variantIndex + 1}</span>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => handleRemoveVariant(variantIndex)}
                  >
                    Remove
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <Combobox
                    as="div"
                    value={variant.color}
                    onChange={(color) => handleColorChange(variantIndex, color)}
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
                      <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredColors.map((color) => (
                          <ComboboxOption
                            key={color.id}
                            value={color}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>
                                  {color.name}
                                </span>
                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'
                                      }`}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    </div>
                  </Combobox>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Sizes</label>
                  {variant.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="grid grid-cols-4 gap-4 mb-2">
                      <div>
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          value={size.size}
                          readOnly
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          placeholder="Quantity"
                          value={size.quantity}
                          onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'quantity', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          placeholder="Price"
                          value={size.price}
                          onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'price', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="mt-1 p-2 w-full border rounded-md"
                          placeholder="Discount"
                          value={size.discount}
                          onChange={(e) => handleVariantChange(variantIndex, sizeIndex, 'discount', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <input
                    type="file"
                    className="mt-1 p-2 w-full border rounded-md"
                    multiple
                    onChange={(e) => handleImageUpload(variantIndex, e.target.files)}
                  />
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {variant.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img src={img} alt={`Variant ${variantIndex + 1} Image ${imgIndex + 1}`} className="w-full h-auto rounded-md" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(variantIndex, imgIndex)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVariant}
              className="bg-blue-600 text-white p-2 rounded-md"
            >
              Add Variant
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="mr-4 bg-gray-300 text-gray-700 p-2 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-600 text-white p-2 rounded-md"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}

export default AddEditProduct;

