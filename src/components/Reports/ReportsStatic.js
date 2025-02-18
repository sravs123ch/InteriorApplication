// import React, { useState } from 'react';

// function ReportGenerator() {
//   const [activeTab, setActiveTab] = useState('salesReport');

//   const [salesReport, setSalesReport] = useState({
//     dateRange: { startDate: '', endDate: '' },
//     productCategory: '',
//     salesChannel: '',
//     region: '',
//     customerDemographics: {
//       ageGroup: '',
//       gender: '',
//       incomeBracket: '',
//     },
//     includeTopSellingProducts: false,
//   });

//   const [inventoryReport, setInventoryReport] = useState({
//     dateRange: { startDate: '', endDate: '' },
//     productCategory: '',
//     stockLevelThreshold: '',
//     showOutOfStockItems: false,
//     showSlowMovingItems: false,
//     generateReorderRecommendations: false,
//   });

//   const [customerFeedbackReport, setCustomerFeedbackReport] = useState({
//     dateRange: { startDate: '', endDate: '' },
//     productCategory: '',
//     feedbackType: '',
//     filterByNpsScore: '',
//     includeCustomerComments: false,
//   });

//   const [generatedReport, setGeneratedReport] = useState(null);

//   const handleInputChange = (reportType, field, value) => {
//     if (reportType === 'salesReport') {
//       setSalesReport(prev => ({ ...prev, [field]: value }));
//     } else if (reportType === 'inventoryReport') {
//       setInventoryReport(prev => ({ ...prev, [field]: value }));
//     } else if (reportType === 'customerFeedbackReport') {
//       setCustomerFeedbackReport(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleNestedInputChange = (reportType, field, value) => {
//     if (reportType === 'salesReport') {
//       setSalesReport(prev => ({
//         ...prev,
//         customerDemographics: { ...prev.customerDemographics, [field]: value },
//       }));
//     }
//   };

//   const handleSubmit = (reportType) => {
//     let reportData;
//     switch (reportType) {
//       case 'salesReport':
//         reportData = salesReport;
//         break;
//       case 'inventoryReport':
//         reportData = inventoryReport;
//         break;
//       case 'customerFeedbackReport':
//         reportData = customerFeedbackReport;
//         break;
//       default:
//         return;
//     }
//     setGeneratedReport({ reportType, data: reportData });
//   };

//   const renderTable = (reportType, data) => {
//     // Table rendering logic remains the same as your current implementation
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-80 w-auto p-6 bg-white shadow-lg rounded-lg mt-10 mx-10 mb-10">
//       <h2 className="text-2xl font-bold mb-4">Report Generator</h2>

//       {/* Tab Navigation */}
//       <div className="flex space-x-4 mb-6">
//         {['salesReport', 'inventoryReport', 'customerFeedbackReport'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             {tab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//           </button>
//         ))}
//       </div>

//       {/* Form Fields */}
//       {activeTab === 'salesReport' && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Sales Report</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Form fields for Sales Report */}
//               {/* Reuse similar pattern for other fields */}
//             </div>
//             <button
//               onClick={() => handleSubmit('salesReport')}
//               className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Generate Report
//             </button>
//           </div>
//         </>
//       )}

//       {activeTab === 'inventoryReport' && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Inventory Report</h3>
//             <div className="grid grid-cols-2 gap-6">
//               {/* Form fields for Inventory Report */}
//               {/* Reuse similar pattern for other fields */}
//             </div>
//             <button
//               onClick={() => handleSubmit('inventoryReport')}
//               className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Generate Report
//             </button>
//           </div>
//         </>
//       )}

//       {activeTab === 'customerFeedbackReport' && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Customer Feedback Report</h3>
//             <div className="grid grid-cols-2 gap-6">
//               {/* Form fields for Customer Feedback Report */}
//               {/* Reuse similar pattern for other fields */}
//             </div>
//             <button
//               onClick={() => handleSubmit('customerFeedbackReport')}
//               className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Generate Report
//             </button>
//           </div>
//         </>
//       )}

//       {/* Display generated report */}
//       {generatedReport && (
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold mb-4">Generated {generatedReport.reportType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
//           {renderTable(generatedReport.reportType, generatedReport.data)}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReportGenerator;


// import React, { useState } from 'react';

// function ReportGenerator() {
//   const [activeTab, setActiveTab] = useState('salesReport');
//   const [generatedReport, setGeneratedReport] = useState(null);

//   // Static Data
//   const staticSalesReport = {
//     dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
//     productCategory: 'Electronics',
//     salesChannel: 'Online',
//     region: 'North America',
//     customerDemographics: {
//       ageGroup: '25-34',
//       gender: 'Male',
//       incomeBracket: '50k-75k',
//     },
//     includeTopSellingProducts: true,
//   };

//   const staticInventoryReport = {
//     dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
//     productCategory: 'Home Appliances',
//     stockLevelThreshold: 'Low',
//     showOutOfStockItems: true,
//     showSlowMovingItems: false,
//     generateReorderRecommendations: true,
//   };

//   const staticCustomerFeedbackReport = {
//     dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
//     productCategory: 'Clothing',
//     feedbackType: 'Positive',
//     filterByNpsScore: 'Above 8',
//     includeCustomerComments: true,
//   };

//   const handleSubmit = (reportType) => {
//     let reportData;
//     switch (reportType) {
//       case 'salesReport':
//         reportData = staticSalesReport;
//         break;
//       case 'inventoryReport':
//         reportData = staticInventoryReport;
//         break;
//       case 'customerFeedbackReport':
//         reportData = staticCustomerFeedbackReport;
//         break;
//       default:
//         return;
//     }
//     setGeneratedReport({ reportType, data: reportData });
//   };

//   const renderTable = (reportType, data) => {
//     switch (reportType) {
//       case 'salesReport':
//         return (
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr>
//                 <th>Date Range</th>
//                 <th>Product Category</th>
//                 <th>Sales Channel</th>
//                 <th>Region</th>
//                 <th>Customer Demographics</th>
//                 <th>Top Selling Products</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className='ml-14'>{data.dateRange.startDate} to {data.dateRange.endDate}</td>
//                 <td className='ml-10'>{data.productCategory}</td>
//                 <td className='ml-14'>{data.salesChannel}</td>
//                 <td className='ml-14'>{data.region}</td>
//                 <td className='ml-14'>
//                   Age Group: {data.customerDemographics.ageGroup}, Gender: {data.customerDemographics.gender}, Income Bracket: {data.customerDemographics.incomeBracket}
//                 </td>
//                 <td className='ml-14'>{data.includeTopSellingProducts ? 'Yes' : 'No'}</td>
//               </tr>
//             </tbody>
//           </table>
//         );
//       case 'inventoryReport':
//         return (
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr>
//                 <th>Date Range</th>
//                 <th>Product Category</th>
//                 <th>Stock Level Threshold</th>
//                 <th>Out Of Stock Items</th>
//                 <th>Slow Moving Items</th>
//                 <th>Reorder Recommendations</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className='ml-14'>{data.dateRange.startDate} to {data.dateRange.endDate}</td>
//                 <td className='ml-14'>{data.productCategory}</td>
//                 <td className='ml-14'>{data.stockLevelThreshold}</td>
//                 <td className='ml-14'>{data.showOutOfStockItems ? 'Yes' : 'No'}</td>
//                 <td className='ml-14'>{data.showSlowMovingItems ? 'Yes' : 'No'}</td>
//                 <td className='ml-14'>{data.generateReorderRecommendations ? 'Yes' : 'No'}</td>
//               </tr>
//             </tbody>
//           </table>
//         );
//       case 'customerFeedbackReport':
//         return (
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr>
//                 <th>Date Range</th>
//                 <th>Product Category</th>
//                 <th>Feedback Type</th>
//                 <th>NPS Score Filter</th>
//                 <th>Customer Comments</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className='ml-10 pl-4'>{data.dateRange.startDate} to {data.dateRange.endDate}</td>
//                 <td  className='ml-10 pl-4'>{data.productCategory}</td>
//                 <td  className='ml-10 pl-4'>{data.feedbackType}</td>
//                 <td  className='ml-10 pl-4'>{data.filterByNpsScore}</td>
//                 <td  className='ml-10 pl-4'>{data.includeCustomerComments ? 'Yes' : 'No'}</td>
//               </tr>
//             </tbody>
//           </table>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-80 w-auto p-6 bg-white shadow-lg rounded-lg mt-10 mx-10 mb-10">
//       <h2 className="text-2xl font-bold mb-4">Report Generator</h2>

//       {/* Tab Navigation */}
//       <div className="flex space-x-4 mb-6">
//         {['salesReport', 'inventoryReport', 'customerFeedbackReport'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//           >
//             {tab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//           </button>
//         ))}
//       </div>

//       {/* Form Fields */}
//       {activeTab === 'salesReport' && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Sales Report</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Form fields for Sales Report */}
//               {/* Use your existing fields or static placeholders */}
//             </div>
//             <button
//               onClick={() => handleSubmit('salesReport')}
//               className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Generate Report
//             </button>
//           </div>
//         </>
//       )}

//       {activeTab === 'inventoryReport' && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Inventory Report</h3>
//             <div className="grid grid-cols-2 gap-6">
//               {/* Form fields for Inventory Report */}
//               {/* Use your existing fields or static placeholders */}
//             </div>
//             <button
//               onClick={() => handleSubmit('inventoryReport')}
//               className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Generate Report
//             </button>
//           </div>
//         </>
//       )}

//       {activeTab === 'customerFeedbackReport' && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Customer Feedback Report</h3>
//             <div className="grid grid-cols-2 gap-6">
//               {/* Form fields for Customer Feedback Report */}
//               {/* Use your existing fields or static placeholders */}
//             </div>
//             <button
//               onClick={() => handleSubmit('customerFeedbackReport')}
//               className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Generate Report
//             </button>
//           </div>
//         </>
//       )}

//       {/* Display generated report */}
//       {generatedReport && (
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold mb-4">Generated {generatedReport.reportType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
//           {renderTable(generatedReport.reportType, generatedReport.data)}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReportGenerator;


import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';


function ReportGenerator() {
  const [activeTab, setActiveTab] = useState('salesReport');
  const [generatedReport, setGeneratedReport] = useState(null);

  // Static Data
  const staticSalesReports = [
    {
      dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      productCategory: 'Electronics',
      salesChannel: 'Online',
      region: 'North America',
      customerDemographics: {
        ageGroup: '25-34',
        gender: 'Male',
        incomeBracket: '50k-75k',
      },
      includeTopSellingProducts: true,
    },
    {
      dateRange: { startDate: '2024-02-01', endDate: '2024-02-28' },
      productCategory: 'Home Appliances',
      salesChannel: 'In-Store',
      region: 'Europe',
      customerDemographics: {
        ageGroup: '35-44',
        gender: 'Female',
        incomeBracket: '75k-100k',
      },
      includeTopSellingProducts: false,
    },
    {
      dateRange: { startDate: '2024-03-01', endDate: '2024-03-31' },
      productCategory: 'Books',
      salesChannel: 'Online',
      region: 'Asia',
      customerDemographics: {
        ageGroup: '18-24',
        gender: 'Male',
        incomeBracket: '25k-50k',
      },
      includeTopSellingProducts: true,
    },
  ];
  
  const staticInventoryReports = [
    {
      dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      productCategory: 'Home Appliances',
      stockLevelThreshold: 'Low',
      showOutOfStockItems: true,
      showSlowMovingItems: false,
      generateReorderRecommendations: true,
    },
    {
      dateRange: { startDate: '2024-02-01', endDate: '2024-02-28' },
      productCategory: 'Office Supplies',
      stockLevelThreshold: 'Medium',
      showOutOfStockItems: false,
      showSlowMovingItems: true,
      generateReorderRecommendations: false,
    },
    {
      dateRange: { startDate: '2024-03-01', endDate: '2024-03-31' },
      productCategory: 'Furniture',
      stockLevelThreshold: 'High',
      showOutOfStockItems: false,
      showSlowMovingItems: false,
      generateReorderRecommendations: true,
    },
  ];
  
  const staticCustomerFeedbackReports = [
    {
      dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      productCategory: 'Clothing',
      feedbackType: 'Positive',
      filterByNpsScore: 'Above 8',
      includeCustomerComments: true,
    },
    {
      dateRange: { startDate: '2024-02-01', endDate: '2024-02-28' },
      productCategory: 'Electronics',
      feedbackType: 'Negative',
      filterByNpsScore: 'Below 4',
      includeCustomerComments: false,
    },
    {
      dateRange: { startDate: '2024-03-01', endDate: '2024-03-31' },
      productCategory: 'Home Appliances',
      feedbackType: 'Neutral',
      filterByNpsScore: '5-7',
      includeCustomerComments: true,
    },
  ];
  

  const handleSubmit = (reportType) => {
    let reportData;
    switch (reportType) {
      case 'salesReport':
        reportData = staticSalesReports;
        break;
      case 'inventoryReport':
        reportData = staticInventoryReports;
        break;
      case 'customerFeedbackReport':
        reportData = staticCustomerFeedbackReports;
        break;
      default:
        return;
    }
    setGeneratedReport({ reportType, data: reportData });
  };
  const exportToExcel = (reportType, data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${reportType} Report`);
    XLSX.writeFile(wb, `${reportType}_report.xlsx`);
  };

  const exportToPDF = (reportType, data) => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.text(`${reportType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Report`, 10, 10);

    let yOffset = 20;
    data.forEach((report, index) => {
      if (yOffset > 270) { // Check if page is full
        doc.addPage();
        yOffset = 10;
      }
      doc.text(`${index + 1}. ${JSON.stringify(report)}`, 10, yOffset);
      yOffset += 10;
    });

    doc.save(`${reportType}_report.pdf`);
  };

  const renderTable = (reportType, data) => {
    switch (reportType) {
      case 'salesReport':
        return (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th>Date Range</th>
                <th>Product Category</th>
                <th>Sales Channel</th>
                <th>Region</th>
                <th>Customer Demographics</th>
                <th>Top Selling Products</th>
              </tr>
            </thead>
            <tbody>
              {data.map((report, index) => (
                <tr key={index}>
                  <td>{report.dateRange.startDate} to {report.dateRange.endDate}</td>
                  <td>{report.productCategory}</td>
                  <td>{report.salesChannel}</td>
                  <td>{report.region}</td>
                  <td>
                    Age Group: {report.customerDemographics.ageGroup}, Gender: {report.customerDemographics.gender}, Income Bracket: {report.customerDemographics.incomeBracket}
                  </td>
                  <td>{report.includeTopSellingProducts ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'inventoryReport':
        return (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th>Date Range</th>
                <th>Product Category</th>
                <th>Stock Level Threshold</th>
                <th>Out Of Stock Items</th>
                <th>Slow Moving Items</th>
                <th>Reorder Recommendations</th>
              </tr>
            </thead>
            <tbody>
              {data.map((report, index) => (
                <tr key={index}>
                  <td>{report.dateRange.startDate} to {report.dateRange.endDate}</td>
                  <td>{report.productCategory}</td>
                  <td>{report.stockLevelThreshold}</td>
                  <td>{report.showOutOfStockItems ? 'Yes' : 'No'}</td>
                  <td>{report.showSlowMovingItems ? 'Yes' : 'No'}</td>
                  <td>{report.generateReorderRecommendations ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'customerFeedbackReport':
        return (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th>Date Range</th>
                <th>Product Category</th>
                <th>Feedback Type</th>
                <th>NPS Score Filter</th>
                <th>Customer Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.map((report, index) => (
                <tr key={index}>
                  <td>{report.dateRange.startDate} to {report.dateRange.endDate}</td>
                  <td>{report.productCategory}</td>
                  <td>{report.feedbackType}</td>
                  <td>{report.filterByNpsScore}</td>
                  <td>{report.includeCustomerComments ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-80 w-auto p-6 bg-white shadow-lg rounded-lg mt-10 mx-10 mb-10">
      <h2 className="text-2xl font-bold mb-4">Report Generator</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {['salesReport', 'inventoryReport', 'customerFeedbackReport'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {tab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      {activeTab === 'salesReport' && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Sales Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form fields for Sales Report */}
              {/* Use your existing fields or static placeholders */}
            </div>
            <button
              onClick={() => handleSubmit('salesReport')}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Generate Report
            </button>

            <button
              onClick={() => exportToExcel('salesReport', staticSalesReports)}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Export to Excel
            </button>
            <button
              onClick={() => exportToPDF('salesReport', staticSalesReports)}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Export to PDF
            </button>
          </div>
        </>
      )}

      {activeTab === 'inventoryReport' && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Inventory Report</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Form fields for Inventory Report */}
              {/* Use your existing fields or static placeholders */}
            </div>
            <button
              onClick={() => handleSubmit('inventoryReport')}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Generate Report
            </button>
            <button
              onClick={() => exportToExcel('salesReport', staticSalesReports)}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Export to Excel
            </button>
            <button
              onClick={() => exportToPDF('salesReport', staticSalesReports)}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Export to PDF
            </button>
          </div>
        </>
      )}

      {activeTab === 'customerFeedbackReport' && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Customer Feedback Report</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Form fields for Customer Feedback Report */}
              {/* Use your existing fields or static placeholders */}
            </div>
            <button
              onClick={() => handleSubmit('customerFeedbackReport')}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Generate Report
            </button>
            <button
              onClick={() => exportToExcel('salesReport', staticSalesReports)}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Export to Excel
            </button>
            <button
              onClick={() => exportToPDF('salesReport', staticSalesReports)}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Export to PDF
            </button>
          </div>
        </>
      )}

      {/* Display generated report */}
      {generatedReport && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Generated {generatedReport.reportType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
          {renderTable(generatedReport.reportType, generatedReport.data)}
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;
