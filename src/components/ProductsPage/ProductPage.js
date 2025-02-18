// import React, { useState } from 'react';
// import TShirt from "../../assests/Images/image.png" 
// import TShirt2 from "../../assests/Images/Tshrit2.jpg"
// import TShirt3 from "../../assests/Images/Tshrit3.png"
// import similarProduct from "../../assests/Images/similar product.jpg"
// import Freeshipping from "../../assests/Images/Freeshipping.png"
// import Delivery from "../../assests/Images/15daysDelivery.png"
// import Cash from "../../assests/Images/Cash.png"
// import India from "../../assests/Images/India.png"
// import Happy from "../../assests/Images/Happy.png"
// import Packed from "../../assests/Images/Packed.jpg"

// const ProductPage = () => {
//     const [mainImage, setMainImage] = useState(TShirt);

//     // Function to handle thumbnail click
//     const handleThumbnailClick = (imageSrc) => {
//       setMainImage(imageSrc);
//     }

//   return (
//     <div className="container mx-auto ">
//       {/* Navigation */}
//       <header className="bg-yellow-500  text-center">
//         <p className="text-white">Free Shipping Sitewide on Every Order, Don't Miss Out!</p>
//       </header>

//       {/* Product Section */}
//       <div className="flex flex-col md:flex-row mt-4 px-14">
//         {/* Images */}
//         <div className="w-full md:w-1/2 p-4">
//           <div className="flex flex-col items-center">
//             <img src={mainImage} alt="Product" className="mb-4" />
//             <div className="flex space-x-2">
//               {/* Thumbnails */}
//               <img src={TShirt} alt="Thumbnail" className="w-20 h-26 border"
//                          onClick={() => handleThumbnailClick(TShirt)}
//  />
//               <img src={TShirt2} alt="Thumbnail" className="w-20 h-26 border"    
//                      onClick={() => handleThumbnailClick(TShirt2)}
//  />
//               <img src={TShirt3} alt="Thumbnail" className="w-20 h-26 border"    
//                     onClick={() => handleThumbnailClick(TShirt3)}
//  />
//             </div>
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="w-full md:w-2/3 p-4">
//           <h1 className="text-2xl font-bold">Navy and Orange Striped Polo T-Shirt For Men</h1>
//           <p className="text-green-600">Solid Polos</p>
//           <p className="text-xl font-bold mt-2">₹ 799 <span className="line-through text-gray-500">₹ 1999</span> <span className="text-green-600">(60% off)</span></p>
//           <p className="text-gray-500">Inclusive of Taxes</p>

//           <div className="mt-4">
//             <label className="block mb-2">Color:</label>
//             <div className="flex space-x-2">
//               {/* <button className="w-10 h-10 bg-orange-500 border rounded-2xl"></button> */}
//               <button className="w-12 h-12 relative border rounded-full bg-orange-500">
//   <div className="absolute inset-0 rounded-full bg-blue-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
// </button>
// <button className="w-12 h-12 relative border rounded-full  bg-blue-500 ">
//   <div className="absolute inset-0 rounded-full bg-orange-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
// </button>

//               {/* <button className="w-8 h-8 bg-blue-500 border"></button> */}
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="block mb-2">Size:</label>
//             <div className="flex space-x-2">
//               <button className="px-4 py-2 border rounded-md">S</button>
//               <button className="px-4 py-2 border  rounded-md">M</button>
//               <button className="px-4 py-2 border  rounded-md">L</button>
//               <button className="px-4 py-2 border  rounded-md">XL</button>
//               <button className="px-4 py-2 border  rounded-md">XXL</button>
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="block mb-2">Qty:</label>
//             <div className="flex items-center">
//               <button className="px-2 py-1 border  rounded-md">-</button>
//               <input type="text" value="1" className="w-12 text-center border mx-2  rounded-md" readOnly />
//               <button className="px-2 py-1 border  rounded-md">+</button>
//             </div>
//           </div>

//           <div className="mt-4 space-x-2">
//             {/* <button className="w-1/4 py-2 bg-#50cccc text-white mb-2">Add to Cart</button> */}
//             <button className="w-1/4 py-2 bg-teal-400 text-white mb-2 rounded-md">Add to Cart</button>

//             <button className="w-1/4 py-2 bg-custom-yellow text-black rounded-md">Buy Now</button>
//           </div>
//           <div className="mt-8 bg-gray-100  p-4 border  rounded-md">
//         <label className="block mb-2">Enter Your City Pincode:</label>
//         <div className="flex items-center">
//           <input type="text" className="w-full border p-2  rounded-md" />
//           <button className="ml-2 px-4 py-2 bg-gray-800 text-white  rounded-md">Check</button>
//         </div>
//         <div className="mt-4 flex justify-between">
//         <div className="flex flex-col items-center">
//     <img src={Freeshipping} alt="Free Shipping" className="w-16 h-16 rounded-full mb-2" />
//     <span>Free Shipping</span></div>
//     <div className="flex flex-col items-center">
//     <img src={Delivery} alt="Free Shipping" className="w-16 h-16 rounded-full mb-2" />
//     <span>15 Days Return</span></div>
//     <div className="flex flex-col items-center">
//     <img src={Cash} alt="Free Shipping" className="w-16 h-16 rounded-full mb-2" />
//     <span>Cash on Delivery</span></div>


//         </div>
//       </div>
//         </div>

//       </div>


//       <div className="mt-4 flex justify-center space-x-36">
//         <div className="pt-4 flex flex-col items-center h-40 w-48 border rounded-md">
//     <img src={India} alt="India map" className="w-16 h-16   border-2 border-gray-300 shadow-lg  rounded-full mb-2" />
//     <span>Home grown Brand</span></div>
//     <div className="pt-4 flex flex-col items-center h-40 w-48 border rounded-md">
//     <img src={Happy} alt="Happy customers" className="w-16 h-16   border-2 border-gray-300 shadow-lg  rounded-full mb-2" />
//     <span>3M+ Happy customers</span></div>
//     <div className="pt-4 flex flex-col items-center h-40 w-48 border rounded-md">
//     <img src={Packed} alt="Packed " className="w-16 h-16   border-2 border-gray-300 shadow-lg  rounded-full mb-2" />
//     <span>Packed With safety</span></div>


//         </div>



//       {/* Similar Products */}
//       <div className="mt-8 px-4">
//         <h2 className="text-xl font-bold">RECENTLY VIEWED</h2>
//         <div className="flex flex-wrap mt-4 ">
//           {/* Product Cards */}
//           <div className="w-full md:w-1/3 lg:w-1/4 p-2 ">
//             <div className="border p-4 rounded-lg">
//               <img src={similarProduct} alt="Similar Product" className="border rounded-lg" />
//               <p className="mt-2">White and Yellow Stripped Polo T-Shrit</p>
//               <p className="text-xl font-bold">₹ 799</p>
//             </div>
//           </div>
//           {/* Repeat for more products */}
//         </div>
//       </div>

//       <div className="mt-8 px-14">
//   <h2 className="text-xl font-bold">Similar Products</h2>
//   <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 mt-4">
//     {/* Product Cards */}
//     <div className="border p-4 rounded-lg">
//       <img src={TShirt} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">White and Yellow Stripped Polo T-Shirt</p>
//       <p className="text-xl font-bold">₹ 799</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Blue Denim Jacket</p>
//       <p className="text-xl font-bold">₹ 1299</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={TShirt2} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Black Casual Sneakers</p>
//       <p className="text-xl font-bold">₹ 999</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={TShirt3} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Red Graphic T-Shirt</p>
//       <p className="text-xl font-bold">₹ 599</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Green Chinos</p>
//       <p className="text-xl font-bold">₹ 899</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>
//     <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>   <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>   <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>   <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>   <div className="border p-4 rounded-lg">
//       <img src={similarProduct} alt="Similar Product" className="w-full h-auto border rounded-lg" />
//       <p className="mt-2">Gray Sweater</p>
//       <p className="text-xl font-bold">₹ 1199</p>
//     </div>
//   </div>
// </div>


//       {/* Footer */}
//       <footer className="mt-8 bg-gray-800 text-white p-4">
//         <div className="container mx-auto">
//           <div className="flex justify-between">
//             <div>
//               <h3 className="font-bold">NEED HELP</h3>
//               <ul>
//                 <li>Contact Us</li>
//                 <li>Track Order</li>
//                 <li>Returns & Refunds</li>
//                 <li>FAQs</li>
//                 <li>Career</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-bold">COMPANY</h3>
//               <ul>
//                 <li>About Us</li>
//                 <li>Blog</li>
//                 <li>Collaboration</li>
//                 <li>Media</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-bold">MORE INFO</h3>
//               <ul>
//                 <li>Terms and Conditions</li>
//                 <li>Privacy Policy</li>
//                 <li>Shipping Policy</li>
//                 <li>Sitemap</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-bold">LOCATION</h3>
//               <address>
//                 NH 8 - Near Mahadev Hotel Udaipur, India - 313002
//               </address>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ProductPage;



// import React from 'react';
// import shirt from "../../assests/Images/Tshrit2.jpg"

// const products = [
//   { name: 'Product 1', price: '1000', discount: '10%', size: 'M', stock: 50, image: {shirt} },
//   { name: 'Product 2', price: '$15', discount: '15%', size: 'L', stock: 30, image: 'path/to/image2.jpg' },
//   { name: 'Product 3', price: '$20', discount: '20%', size: 'S', stock: 20, image: 'path/to/image3.jpg' },
//   { name: 'Product 4', price: '$25', discount: '25%', size: 'XL', stock: 10, image: 'path/to/image4.jpg' },
//   { name: 'Product 5', price: '$30', discount: '30%', size: 'M', stock: 5, image: 'path/to/image5.jpg' },
//   { name: 'Product 6', price: '$35', discount: '35%', size: 'L', stock: 15, image: 'path/to/image6.jpg' },
//   { name: 'Product 7', price: '$40', discount: '40%', size: 'S', stock: 25, image: 'path/to/image7.jpg' },
//   { name: 'Product 8', price: '$45', discount: '45%', size: 'XL', stock: 35, image: 'path/to/image8.jpg' },
//   { name: 'Product 9', price: '$50', discount: '50%', size: 'M', stock: 40, image: 'path/to/image9.jpg' },
//   { name: 'Product 10', price: '$55', discount: '55%', size: 'L', stock: 45, image: 'path/to/image10.jpg' },
// ];

// export default function ProductPage() {
//   return (
//     <div className="px-4 sm:px-6 lg:px-8 ml-10 lg:ml-72 w-auto">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-base font-semibold leading-6 text-gray-900">Products</h1>
//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products including their name, price, discount, size, stock, and image.
//           </p>
//         </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead>
//                 <tr>
//                   <th
//                     scope="col"
//                     className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
//                   >
//                     Product Name
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Price
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Discount
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Size
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Stock
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Image
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.name}>
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
//                       {product.name}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.price}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.discount}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.size}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.stock}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// import React from 'react';
// import shirtImage from "../../assests/Images/Tshrit2.jpg";
// import Shirt2 from "../../assests/Images/Tshrit3.png"
// import Shirt3 from "../../assests/Images/similar product.jpg"
// import Shirt4 from "../../assests/Images/denimjacket.png"
// import Shirt5 from "../../assests/Images/Hoodie.png"
// import Shirt6 from "../../assests/Images/polo.png"
// import jeans from "../../assests/Images/jeans.png"
// import sweatshirt from '../../assests/Images/Sweatshirt.png'








// const products = [
//   { name: 'T-Shirt', price: '₹1000', discount: '10%', size: 'M', stock: 50, image: shirtImage },
//   { name: 'Casual Shirt', price: '₹1200', discount: '15%', size: 'L', stock: 30, image: Shirt2},
//   { name: 'Formal Shirt', price: '₹1500', discount: '20%', size: 'S', stock: 20, image: Shirt3 },
//   { name: 'Denim Jacket', price: '₹2500', discount: '25%', size: 'XL', stock: 10, image: Shirt4 },
//   { name: 'Hoodie', price: '₹2000', discount: '30%', size: 'M', stock: 5, image: Shirt5 },
//   { name: 'Polo Shirt', price: '₹800', discount: '35%', size: 'L', stock: 15, image: Shirt6 },
//   { name: 'Jeans', price: '₹1800', discount: '40%', size: 'S', stock: 25, image: jeans },
//   { name: 'Sweatshirt', price: '₹1500', discount: '45%', size: 'XL', stock: 35, image: sweatshirt },

// ];

// export default function ProductPage() {
//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto ">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           {/* <h1 className="text-base font-semibold leading-6 text-custom-heading">Products</h1> */}
//           <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading"> Products</h2>

//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products including their name, price, discount, size, stock, and image.
//           </p>

//         </div>
//         <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">

//              <button
//             type="button"
//             className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           >
//             Add Products
//           </button>
//           </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead>
//                 <tr>
//                   <th
//                     scope="col"
//                     className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
//                   >
//                     Product Name
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Price
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Discount
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Size
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Stock
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
//                   >
//                     Image
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.name}>
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
//                       {product.name}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.price}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.discount}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.size}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.stock}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from 'react';
// import shirtImage from "../../assests/Images/Tshrit2.jpg";
// import Shirt2 from "../../assests/Images/Tshrit3.png";
// import Shirt3 from "../../assests/Images/similar product.jpg";
// import Shirt4 from "../../assests/Images/denimjacket.png";
// import Shirt5 from "../../assests/Images/Hoodie.png";
// import Shirt6 from "../../assests/Images/polo.png";
// import jeans from "../../assests/Images/jeans.png";
// import sweatshirt from '../../assests/Images/Sweatshirt.png';
// import { useNavigate } from 'react-router-dom';

// const products = [
//   { name: 'T-Shirt', price: '₹1000', discount: '10%', size: 'M', stock: 50, image: shirtImage },
//   { name: 'Casual Shirt', price: '₹1200', discount: '15%', size: 'L', stock: 30, image: Shirt2},
//   { name: 'Formal Shirt', price: '₹1500', discount: '20%', size: 'S', stock: 20, image: Shirt3 },
//   { name: 'Denim Jacket', price: '₹2500', discount: '25%', size: 'XL', stock: 10, image: Shirt4 },
//   { name: 'Hoodie', price: '₹2000', discount: '30%', size: 'M', stock: 5, image: Shirt5 },
//   { name: 'Polo Shirt', price: '₹800', discount: '35%', size: 'L', stock: 15, image: Shirt6 },
//   { name: 'Jeans', price: '₹1800', discount: '40%', size: 'S', stock: 25, image: jeans },
//   { name: 'Sweatshirt', price: '₹1500', discount: '45%', size: 'XL', stock: 35, image: sweatshirt },
// ];


// export default function ProductPage() {
//   const navigate=useNavigate()

//   const handleEdit = (product) => {
//     // Handle the edit functionality here
//     console.log(`Editing product: ${product.name}`);
//   };

//   const handleDelete = (product) => {
//     // Handle the delete functionality here
//     console.log(`Deleting product: ${product.name}`);
//   };

//   function productadd(){
//     navigate("/products")
//   }

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Products</h2>
//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products including their name, price, discount, size, stock, and image.
//           </p>
//         </div>
//         <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
//           <button
//             type="button"
//             className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//           onClick={productadd}>
//             Add Products
//           </button>
//         </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead>
//                 <tr>
//                   <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
//                     Product Name
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Price
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Discount
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Size
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Stock
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Image
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.name}>
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
//                       {product.name}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.price}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.discount}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.size}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.stock}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className=" mr-6 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                         >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product)}
//                         className="rounded-md bg-custom-red px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                         >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from 'react';
// import shirtImage from "../../assests/Images/Tshrit2.jpg";
// import Shirt2 from "../../assests/Images/Tshrit3.png";
// import Shirt3 from "../../assests/Images/similar product.jpg";
// import Shirt4 from "../../assests/Images/denimjacket.png";
// import Shirt5 from "../../assests/Images/Hoodie.png";
// import Shirt6 from "../../assests/Images/polo.png";
// import jeans from "../../assests/Images/jeans.png";
// import sweatshirt from '../../assests/Images/Sweatshirt.png';
// import { useNavigate } from 'react-router-dom';
// import { FaPen, FaTrash,FaTable ,FaPlus } from 'react-icons/fa';
// import * as XLSX from 'xlsx';

// const products = [
//   { name: 'T-Shirt', price: '₹1000', discount: '10%', size: 'M', stock: 50, image: shirtImage },
//   { name: 'Casual Shirt', price: '₹1200', discount: '15%', size: 'L', stock: 30, image: Shirt2 },
//   { name: 'Formal Shirt', price: '₹1500', discount: '20%', size: 'S', stock: 20, image: Shirt3 },
//   { name: 'Denim Jacket', price: '₹2500', discount: '25%', size: 'XL', stock: 10, image: Shirt4 },
//   { name: 'Hoodie', price: '₹2000', discount: '30%', size: 'M', stock: 5, image: Shirt5 },
//   { name: 'Polo Shirt', price: '₹800', discount: '35%', size: 'L', stock: 15, image: Shirt6 },
//   { name: 'Jeans', price: '₹1800', discount: '40%', size: 'S', stock: 25, image: jeans },
//   { name: 'Sweatshirt', price: '₹1500', discount: '45%', size: 'XL', stock: 35, image: sweatshirt },
// ];

// export default function ProductPage() {
//   const navigate = useNavigate();

//   const handleEdit = (product) => {
//     navigate('/add-product', { state: { product } });
//   };

//   const handleDelete = (product) => {
//     console.log(`Deleting product: ${product.name}`);
//   };

//   const productadd = () => {
//     navigate("/products");
//   };
//   const handleExportUsersData =  () => {
//     exportToExcel(products, 'Products');
//   };
//   const exportToExcel = (data, fileName) => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     XLSX.writeFile(workbook, `${fileName}.xlsx`);
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
//        <div className="sm:flex sm:items-center">
//       <div className="sm:flex-auto">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Products</h2>
//         <p className="mt-2 text-sm text-gray-700">
//           A list of all the products including their name, price, discount, size, stock, and image.
//         </p>
//       </div>
//       <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
//   <button
//     type="button"
//     className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//     onClick={handleExportUsersData}
//   >
//     <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
//     Export Products
//   </button>
// </div>
// <div className="mt-2 sm:ml-16 sm:mt-0 sm:flex-none"> {/* Reduced margin-top from mt-4 to mt-2 */}
//   <button
//     type="button"
//     className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//     onClick={productadd}
//   >
//     <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
//     Add Product
//   </button>
// </div>

      
//     </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead>
//                 <tr>
//                   <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
//                     Product Name
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Price
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Discount
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Size
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Stock
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Image
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.name}>
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
//                       {product.name}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.price}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.discount}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.size}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.stock}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-500 flex items-center space-x-4">
//                       <div className='bg-blue-500 p-2 rounded' >
//                       <FaPen
//                         onClick={() => handleEdit(product)}
//                         className="text-white hover:text-blue-800 cursor-pointer"
//                       />
//                       </div>
//                       <div className='bg-red-500 p-2 rounded' >
//                       <FaTrash
//                         onClick={() => handleDelete(product)}
//                         className="text-white hover:text-red-800 cursor-pointer"
//                       />
//                       </div>
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from 'react';
// import shirtImage from "../../assests/Images/Tshrit2.jpg";
// import Shirt2 from "../../assests/Images/Tshrit3.png";
// import Shirt3 from "../../assests/Images/similar product.jpg";
// import Shirt4 from "../../assests/Images/denimjacket.png";
// import Shirt5 from "../../assests/Images/Hoodie.png";
// import Shirt6 from "../../assests/Images/polo.png";
// import jeans from "../../assests/Images/jeans.png";
// import sweatshirt from '../../assests/Images/Sweatshirt.png';
// import { useNavigate } from 'react-router-dom';
// import { FaPen, FaTrash, FaTable, FaPlus } from 'react-icons/fa';
// import * as XLSX from 'xlsx';

// const products = [
//   { name: 'T-Shirt', price: '₹1000', discount: '10%', size: 'M', stock: 50, image: shirtImage },
//   { name: 'Casual Shirt', price: '₹1200', discount: '15%', size: 'L', stock: 30, image: Shirt2 },
//   { name: 'Formal Shirt', price: '₹1500', discount: '20%', size: 'S', stock: 20, image: Shirt3 },
//   { name: 'Denim Jacket', price: '₹2500', discount: '25%', size: 'XL', stock: 10, image: Shirt4 },
//   { name: 'Hoodie', price: '₹2000', discount: '30%', size: 'M', stock: 5, image: Shirt5 },
//   { name: 'Polo Shirt', price: '₹800', discount: '35%', size: 'L', stock: 15, image: Shirt6 },
//   { name: 'Jeans', price: '₹1800', discount: '40%', size: 'S', stock: 25, image: jeans },
//   { name: 'Sweatshirt', price: '₹1500', discount: '45%', size: 'XL', stock: 35, image: sweatshirt },
// ];

// export default function ProductPage() {
//   const navigate = useNavigate();

//   const handleEdit = (product) => {
//     navigate('/add-product', { state: { product } });
//   };

//   const handleDelete = (product) => {
//     console.log(`Deleting product: ${product.name}`);
//   };

//   const productadd = () => {
//     navigate("/products");
//   };

//   const handleExportUsersData = () => {
//     exportToExcel(products, 'Products');
//   };

//   const exportToExcel = (data, fileName) => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     XLSX.writeFile(workbook, `${fileName}.xlsx`);
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Products</h2>
//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products including their name, price, discount, size, stock, and image.
//           </p>
//         </div>
//         <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             onClick={handleExportUsersData}
//           >
//             <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
//             Export Products
//           </button>
//         </div>
//         <div className="mt-2 sm:ml-16 sm:mt-0 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             onClick={productadd}
//           >
//             <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
//             Add Product
//           </button>
//         </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead>
//                 <tr>
//                   <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
//                     Product Name
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Price
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Discount
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Size
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Stock
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Image
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.name}>
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
//                       {product.name}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.price}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.discount}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.size}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.stock}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-500 flex items-center space-x-4">
//                       <div className='bg-blue-500 p-2 rounded'>
//                         <FaPen
//                           onClick={() => handleEdit(product)}
//                           className="text-white hover:text-blue-800 cursor-pointer"
//                         />
//                       </div>
//                       <div className='bg-red-500 p-2 rounded'>
//                         <FaTrash
//                           onClick={() => handleDelete(product)}
//                           className="text-white hover:text-red-800 cursor-pointer"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from 'react';
// import shirtImage from "../../assests/Images/Tshrit2.jpg";
// import Shirt2 from "../../assests/Images/Tshrit3.png";
// import Shirt3 from "../../assests/Images/similar product.jpg";
// import Shirt4 from "../../assests/Images/denimjacket.png";
// import Shirt5 from "../../assests/Images/Hoodie.png";
// import Shirt6 from "../../assests/Images/polo.png";
// import jeans from "../../assests/Images/jeans.png";
// import sweatshirt from '../../assests/Images/Sweatshirt.png';
// import { useNavigate } from 'react-router-dom';
// import { FaPen, FaTrash, FaTable, FaPlus } from 'react-icons/fa';
// import * as XLSX from 'xlsx';

// const products = [
//   { name: 'T-Shirt', price: '₹1000', discount: '10%', sizes: ['M', 'L', 'XL'], colors: ['Red', 'Blue', 'Green'], stock: 50, image: shirtImage },
//   { name: 'Casual Shirt', price: '₹1200', discount: '15%', sizes: ['M', 'L'], colors: ['White', 'Black'], stock: 30, image: Shirt2 },
//   { name: 'Formal Shirt', price: '₹1500', discount: '20%', sizes: ['S', 'M', 'L'], colors: ['Blue', 'Grey'], stock: 20, image: Shirt3 },
//   { name: 'Denim Jacket', price: '₹2500', discount: '25%', sizes: ['XL'], colors: ['Denim'], stock: 10, image: Shirt4 },
//   { name: 'Hoodie', price: '₹2000', discount: '30%', sizes: ['M', 'L'], colors: ['Black', 'Grey'], stock: 5, image: Shirt5 },
//   { name: 'Polo Shirt', price: '₹800', discount: '35%', sizes: ['M', 'L', 'XL'], colors: ['Red', 'Blue'], stock: 15, image: Shirt6 },
//   { name: 'Jeans', price: '₹1800', discount: '40%', sizes: ['S', 'M', 'L'], colors: ['Blue', 'Black'], stock: 25, image: jeans },
//   { name: 'Sweatshirt', price: '₹1500', discount: '45%', sizes: ['XL'], colors: ['Grey', 'Black'], stock: 35, image: sweatshirt },
// ];

// export default function ProductPage() {
//   const navigate = useNavigate();

//   const handleEdit = (product) => {
//     navigate('/add-product', { state: { product } });
//   };

//   const handleDelete = (product) => {
//     console.log(`Deleting product: ${product.name}`);
//   };

//   const productadd = () => {
//     navigate("/products");
//   };

//   const handleExportUsersData = () => {
//     exportToExcel(products, 'Products');
//   };

//   const exportToExcel = (data, fileName) => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     XLSX.writeFile(workbook, `${fileName}.xlsx`);
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Products</h2>
//           <p className="mt-2 text-sm text-gray-700">
//             A list of all the products including their name, price, discount, sizes, colors, stock, and image.
//           </p>
//         </div>
//         <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             onClick={handleExportUsersData}
//           >
//             <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
//             Export Products
//           </button>
//         </div>
//         <div className="mt-2 sm:ml-16 sm:mt-0 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             onClick={productadd}
//           >
//             <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
//             Add Product
//           </button>
//         </div>
//       </div>
//       <div className="mt-8 flow-root">
//         <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//           <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead>
//                 <tr>
//                   <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
//                     Product Name
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Price
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Discount
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Sizes
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Colors
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Stock
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Image
//                   </th>
//                   <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.name}>
//                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
//                       {product.name}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.price}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.discount}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.sizes.join(', ')}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.colors.join(', ')}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       {product.stock}
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                       <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
//                     </td>
//                     <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-500 flex items-center space-x-4">
//                       <div className='bg-blue-500 p-2 rounded'>
//                         <FaPen
//                           onClick={() => handleEdit(product)}
//                           className="text-white hover:text-blue-800 cursor-pointer"
//                         />
//                       </div>
//                       <div className='bg-red-500 p-2 rounded'>
//                         <FaTrash
//                           onClick={() => handleDelete(product)}
//                           className="text-white hover:text-red-800 cursor-pointer"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import shirtImage from "../../assests/Images/Tshrit2.jpg";
import Shirt2 from "../../assests/Images/Tshrit3.png";
import Shirt3 from "../../assests/Images/similar product.jpg";
import Shirt4 from "../../assests/Images/denimjacket.png";
import Shirt5 from "../../assests/Images/Hoodie.png";
import Shirt6 from "../../assests/Images/polo.png";
import jeans from "../../assests/Images/jeans.png";
import sweatshirt from '../../assests/Images/Sweatshirt.png';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaTrash, FaTable, FaPlus } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const products = [
  { 
    name: 'T-Shirt', 
    price: '₹1000', 
    discount: '10%', 
    variants: [
      { size: 'M', color: 'Red', stock: 20 },
      { size: 'L', color: 'Blue', stock: 15 },
      { size: 'XL', color: 'Green', stock: 10 }
    ],
    image: shirtImage 
  },
  { 
    name: 'Casual Shirt', 
    price: '₹1200', 
    discount: '15%', 
    variants: [
      { size: 'M', color: 'White', stock: 10 },
      { size: 'L', color: 'Black', stock: 20 }
    ],
    image: Shirt2 
  },
  { 
    name: 'Formal Shirt', 
    price: '₹1500', 
    discount: '20%', 
    variants: [
      { size: 'S', color: 'Blue', stock: 5 },
      { size: 'M', color: 'Grey', stock: 10 }
    ],
    image: Shirt3 
  },
  { 
    name: 'Denim Jacket', 
    price: '₹2500', 
    discount: '25%', 
    variants: [
      { size: 'XL', color: 'Denim', stock: 10 }
    ],
    image: Shirt4 
  },
  { 
    name: 'Hoodie', 
    price: '₹2000', 
    discount: '30%', 
    variants: [
      { size: 'M', color: 'Black', stock: 5 },
      { size: 'L', color: 'Grey', stock: 10 }
    ],
    image: Shirt5 
  },
  { 
    name: 'Polo Shirt', 
    price: '₹800', 
    discount: '35%', 
    variants: [
      { size: 'M', color: 'Red', stock: 15 },
      { size: 'L', color: 'Blue', stock: 10 },
      { size: 'XL', color: 'Black', stock: 5 }
    ],
    image: Shirt6 
  },
  { 
    name: 'Jeans', 
    price: '₹1800', 
    discount: '40%', 
    variants: [
      { size: 'S', color: 'Blue', stock: 10 },
      { size: 'M', color: 'Black', stock: 15 },
      { size: 'L', color: 'Blue', stock: 5 }
    ],
    image: jeans 
  },
  { 
    name: 'Sweatshirt', 
    price: '₹1500', 
    discount: '45%', 
    variants: [
      { size: 'XL', color: 'Grey', stock: 20 },
      { size: 'XL', color: 'Black', stock: 15 }
    ],
    image: sweatshirt 
  },
];

export default function ProductPage() {
  const navigate = useNavigate();

  const handleEdit = (product) => {
    navigate('/add-product', { state: { product } });
  };

  const handleDelete = (product) => {
    console.log(`Deleting product: ${product.name}`);
  };

  const productadd = () => {
    navigate("/products");
  };

  const handleExportUsersData = () => {
    exportToExcel(products, 'Products');
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data.flatMap(p => p.variants.map(v => ({
      ...p,
      size: v.size,
      color: v.color,
      stock: v.stock
    }))));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-custom-heading">Products</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the products including their name, price, discount, sizes, colors, stock, and image.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleExportUsersData}
          >
            <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
            Export Products
          </button>
        </div>
        <div className="mt-2 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={productadd}
          >
            <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Product Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Discount
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Size
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Color
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Stock
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Image
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  product.variants.map((variant, index) => (
                    <tr key={`${product.name}-${variant.size}-${variant.color}`}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.price}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.discount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variant.size}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variant.color}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {variant.stock}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md" />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-lg text-gray-500 flex items-center space-x-4">
                        <div className='bg-blue-500 p-2 rounded'>
                          <FaPen
                            onClick={() => handleEdit(product)}
                            className="text-white hover:text-blue-800 cursor-pointer"
                          />
                        </div>
                        <div className='bg-red-500 p-2 rounded'>
                          <FaTrash
                            onClick={() => handleDelete(product)}
                            className="text-white hover:text-red-800 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
