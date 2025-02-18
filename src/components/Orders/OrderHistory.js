import React, { useState, useEffect } from "react";
import { IoMdMore, IoEllipsisVertical } from "react-icons/io";
import { GET_ALL_HYSTORYID_API } from "../../Constants/apiRoutes";
import { RiCloseLine } from "react-icons/ri";
import { FiDownload, FiEye } from 'react-icons/fi';
import IconButton from '@mui/material/IconButton'; // Import IconButton from Material-UI
import { TablePagination } from "@mui/material";
import { AiOutlineEye } from 'react-icons/ai'; // Import AiOutlineEye from react-icons
import { FaEdit } from "react-icons/fa";
import {
    MdPending as PendingIcon,
    MdCheckBox as ApprovedIcon,
    MdPrecisionManufacturing as ProductionIcon,
    MdEngineering as TechnicalIcon,
    MdDesignServices,
} from "react-icons/md";
import { MdStraighten } from 'react-icons/md';
import { useStatusColors } from "../../Context/StatusColorsContext";
import {
    FaCheckCircle,
    FaEllipsisH as MoreHoriz,
    FaRulerCombined as Straighten,
    FaCogs as DesignServices,
    FaClipboardCheck as FactCheck,
    FaCamera as CameraOutdoor,
    FaTruck as LocalShipping,
    FaBox as Inventory,
    FaThumbsUp,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
const OrderHistory = ({ OrderID, handleEditstatus }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusDetails, setStatusDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    // const { OrderID } = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangeRowsPerPage = (event) => {
        const rows = parseInt(event.target.value, 10);
        setRowsPerPage(rows);
        setPage(0); // Reset to first page
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Calculate paginated data
    const paginatedData = statusDetails.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [formData, setFormData] = useState({ imagePreview: '' }); // Initialize with a default empty image preview
    const handleView = (imageUrl) => {
        setFormData({ imagePreview: imageUrl }); // Set the image URL to display in the modal
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };
    const fetchOrderDetails = async () => {
        try {
            if (OrderID === "new") return;

            setIsLoading(true);
            const response = await fetch(`${GET_ALL_HYSTORYID_API}${OrderID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const result = await response.json();
            const statuses = Array.isArray(result) ? result : [result];
            setTotalRecords(statuses.length);

            const mappedStatusDetails = statuses.map((status) => ({
                StatusID: status.StatusID || "N/A",
                OrderHistoryID: status.OrderHistoryID || "N/A",
                OrderID: status.OrderID || "N/A",
                AssignTo: `${status.FirstName || "N/A"} ${status.LastName || ""}`,
                RoleName: status.RoleName || "N/A",
                OrderStatus: status.OrderStatus || "0",
                SubStatusId: status.SubStatusId || "0",
                DeliveryDate: status.EndDate || "N/A",
                Comment: status.Comment || "N/A",
                StartDate: status.StartDate || "N/A",
                RoleName: status.RoleName || "N/A",
                DownloadDocuments: status.DownloadDocuments || [], // Handle document URLs or objects
                ViewDocuments: status.viewdocuments || [], // Handle document URLs or objects
            }));

            setStatusDetails(mappedStatusDetails);
            console.log("ViewDocuments:", statusDetails)
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        console.log("statusColors", statusColors)
        fetchOrderDetails();
    }, []);

    const handlePagination = (direction) => {
        setCurrentPage((prev) => Math.max(prev + direction, 1));
    };
    const statusColors = useStatusColors();

    const icons = {
        "Quick Quote": <ApprovedIcon className={`w-6 h-6`} style={{ color: statusColors["Quick Quote"] }} />,
        "Initial Design": <MdDesignServices className={`w-6 h-6`} style={{ color: statusColors["Initial Design"] }} />,
        More: <MoreHoriz className={`w-6 h-6`} style={{ color: statusColors["More"] || "text-orange-500" }} />,
        "Initial Measurements": <Straighten className={`w-6 h-6`} style={{ color: statusColors["Initial Measurements"] }} />,
        "Revised Design": <TechnicalIcon className={`w-6 h-6`} style={{ color: statusColors["Revised Design"] }} />,
        "Final Measurement": <DesignServices className={`w-6 h-6`} style={{ color: statusColors["Final Measurement"] }} />,
        "Signup Document": <FactCheck className={`w-6 h-6`} style={{ color: statusColors["Signup Document"] }} />,
        "PDI": <CameraOutdoor className={`w-6 h-6`} style={{ color: statusColors["PDI"] }} />,
        "Dispatch": <LocalShipping className={`w-6 h-6`} style={{ color: statusColors["Dispatch"] }} />,
        "Installation": <Inventory className={`w-6 h-6`} style={{ color: statusColors["Installation"] }} />,
        "Completion": <FaThumbsUp className={`w-6 h-6`} style={{ color: statusColors["Completion"] }} />,
        "Production": <ProductionIcon className={`w-6 h-6`} style={{ color: statusColors["Production"] }} />,
        "Pre-Final Measurement": <MdStraighten className={`w-6 h-6`} style={{ color: statusColors["Pre-Final Measurement"] }} />,
    };
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedData.map((order, index) => (
                    <div
                        key={index}
                        className="bg-white border rounded-lg transition-transform transform hover:scale-105"
                    >
                        {/* Header */}
                        <div className="flex items-center p-4 border-b bg-gray-50">
                            <div className="bg-gray-100 rounded-full p-3">
                                {icons[order.OrderStatus] || (
                                    <div className="w-6 h-6 text-gray-500">?</div>
                                )}
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-800 flex items-center">
                                {order.OrderStatus || "N/A"}
                                <span
                                    className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${order.OrderStatus === "Revised Design"
                                        ? "text-green-700 bg-green-100"
                                        : order.OrderStatus === "Installation"
                                            ? "text-green-700 bg-green-100"
                                            : ""
                                        }`}
                                >
                                    {order.OrderStatus === "Revised Design"
                                        ? `R${order.SubStatusId}`
                                        : order.OrderStatus === "Installation"
                                            ? `Phase ${order.SubStatusId}`
                                            : ""}
                                </span>
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Details */}
                            {[
                                { label: "StartDate", value: order.StartDate ? new Date(order.StartDate).toLocaleDateString() : "N/A" },
                                { label: "Delivery Date", value: order.DeliveryDate ? new Date(order.DeliveryDate).toLocaleDateString() : "N/A" },
                                { label: "Assigned To", value: order.AssignTo || "N/A" },
                                { label: "Department", value: order.RoleName || "N/A" },
                                { label: "Comments", value: order.Comment || "N/A" },
                            ].map((detail, index) => (
                                <div key={index} className="grid grid-cols-[1fr_auto_2fr] items-center mt-0.5">
                                    <strong className="text-sm text-gray-600">{detail.label}</strong>
                                    <span className="pr-2 text-center">:</span>
                                    <p className="text-gray-900 py-1 rounded-md overflow-wrap break-words">{detail.value}</p>
                                </div>
                            ))}

                            {/* Dummy Image Preview Section */}
                        </div>
                        {/* Footer */}
                        <div className="border-t p-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                                {/* Left-aligned "Document" label */}
                                {/* Icons section */}
                                <div className="flex items-center">
                                    <span className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all duration-200">
                                        Document
                                    </span>

                                    <IconButton
                                        onClick={() => handleView(order.ViewDocuments)} // Pass the image URL to the handler
                                        color="primary"
                                        className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full flex items-center justify-center"
                                        title="View"
                                    >
                                        <AiOutlineEye size={20} className="text-red-600" /> {/* View icon color set to blue */}
                                    </IconButton>

                                    <IconButton
                                        href={order.DownloadDocuments} // URL for downloading the document
                                        download
                                        color="primary"
                                        className="flex items-center justify-center text-gray-600 hover:text-gray-800"
                                        aria-label="Download document"
                                        title="Download"
                                    >
                                        <FiDownload size={20} className="text-green-600" /> {/* Download icon color set to green */}
                                    </IconButton>
                                </div>


                                {/* Right-aligned "View Details" button */}

                                <button
                                    onClick={() =>
                                        handleEditstatus(
                                            order.OrderHistoryID,
                                            order.StatusID
                                        )
                                    }
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-all duration-200"
                                >
                                    <FaEdit />
                                    Edit Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center z-10 justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md relative" style={{ width: '500px', height: '500px' }}>
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 flex items-center justify-center text-red-600 bg-red-50 rounded-md hover:bg-red-100 p-2"
                        >
                            <RiCloseLine size={18} />
                        </button>
                        <img
                            src={formData.imagePreview}
                            alt="Full View"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={statusDetails.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default OrderHistory;
