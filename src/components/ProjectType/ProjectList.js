
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTable } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { Combobox } from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";
import { getProjects, deleteProjectType } from "../../Constants/apiRoutes";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { toast, ToastContainer } from 'react-toastify';
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import 'react-toastify/dist/ReactToastify.css';
import { IoEllipsisVertical } from 'react-icons/io5'; // Add this import

const ProjectTable = () => {

  const [page, setPage] = useState(0);
  const dropdownRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [value, setValue] = useState(null);
  const storesData = [{ StoreID: 1, StoreName: "Store 1" }, { StoreID: 2, StoreName: "Store 2" }];
  const stores = storesData;
  const searchName = "";
  const searchItems = (value) => console.log("Searching for:", value);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginatedData, setPaginatedData] = useState([]);
  const navigate = useNavigate();
  const handleCreateProject = () => {
    navigate("/ProjectCreation");
  };
  const handleExportOrder = () => alert("Export Order functionality not implemented.");
  const handleEditProject = (ProjectTypeID) => {
    navigate(`/ProjectCreation/${ProjectTypeID}`)
  }
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          getProjects
        );
        setProjects(response.data.data); // Set the response directly
      } catch (error) {
        console.error("Error fetching project data:", error);
      }finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [refresh]);

  useEffect(() => {
    // Filter the projects based on the search query
    const filteredProjects = projects.filter(project =>
      (project.ProjectTypeName && project.ProjectTypeName.replace(/"/g, '').toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.ProjectTypeID && project.ProjectTypeID.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Paginate the filtered projects
    const paginatedData = filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Set the paginated data to the state
    setPaginatedData(paginatedData);
  }, [searchQuery, projects, page, rowsPerPage]); // Only run when any of these change


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update searchQuery state
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveMenu(null); // Close the menu
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleDeleteProject = async (ProjectTypeID) => {
    setLoading(true);
    try {
      const response = await fetch(`${deleteProjectType}/${ProjectTypeID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Display success toast if the project is deleted successfully
        toast.success(result.message || "Project deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRefresh(prev => !prev);  // Refresh the data if necessary
      } else {
        // Display error toast if deletion fails
        toast.error(result.message || `Failed to delete project with ID ${ProjectTypeID}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      // Handle any unexpected errors during the request
      console.error('Error:', error);
      toast.error("An error occurred while deleting the project", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  };
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (projectTypeID) => {
    setActiveMenu(activeMenu === projectTypeID ? null : projectTypeID);
  };
  const [isExpanded, setIsExpanded] = useState(() => {
       const storedCollapsed = localStorage.getItem('navbar-collapsed');
       return storedCollapsed !== 'true'; // Default to expanded if not set
     });
  return (
    // <div ref={dropdownRef} className="main-container">
    <div ref={dropdownRef} className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <ToastContainer />{loading && <LoadingAnimation />}
      <div className="body-container">
        <h2 className="heading">Projects</h2>

        <div className="flex justify-end">
          <ul>
            <li>
              <button
                type="button"
                className="action-button flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateProject}
              >
                <FaPlus aria-hidden="true" className="icon" />
                <span>Create Project</span>
              </button>
            </li>
          </ul>
        </div>


      </div>
      <div className="flex flex-wrap justify-end gap-2 mt-2">
        {/* Container for centering search box */}
        <div className="flex justify-center items-center w-full mt-4">
          <div className="relative flex items-center">
            <label htmlFor="searchName" className="sr-only">
              Search
            </label>
            <input
              id="searchName"
              type="text"
              placeholder=" Search by Project Number / Project Name "
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pr-10 border border-gray-400 rounded-md w-full sm:w-[400px] md:w-[500px] text-sm leading-6 h-[40px]"
            />
            <div className="absolute right-3 text-gray-500">
              <IoIosSearch />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map((project) => (
          <div
            key={project.projectTypeID}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:scale-105 h-full"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                src={project.FileUrl || "/placeholder.jpg"}
                alt={project.ProjectTypeName}
                className="w-full h-48 object-cover"
              />
              {/* Dropdown Menu */}
              {activeMenu === project.ProjectTypeID && (
                <div
                  className="absolute top-28 right-3 bg-white shadow-md rounded-md z-10">
                  <ul className="text-sm text-gray-700">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEditProject(project.ProjectTypeID)}
                    >
                      Edit
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDeleteProject(project.ProjectTypeID)}
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex-grow">
              <div className="flex items-center justify-between">
                {/* Project Name */}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {(project.ProjectTypeName || "Unnamed Project").replace(/['"]/g, '')}
                </h3>
                {/* Status Section */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${project.Status === "Active" ? "bg-green-600" : "bg-red-600"}`}
                  ></span>
                  <p
                    className={`text-sm font-semibold ${project.Status === "Inactive" ? "text-red-600" : "text-green-600"}`}
                  >
                    {project.Status}
                  </p>
                  <button
                    className="text-gray-500 text-2xl cursor-pointer focus:outline-none p-0"
                    onClick={() => toggleMenu(project.ProjectTypeID)}
                  >
                    <IoEllipsisVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>



          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={(page + 1) * rowsPerPage >= projects.length}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectTable;
