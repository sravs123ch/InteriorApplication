import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

import { FaPlus, FaTable } from "react-icons/fa";
import * as XLSX from "xlsx";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { UserContext } from "../../Context/userContext";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import UserIcone from "../../assests/Images/user-png-33842.png"
import { MdOutlineCancel } from "react-icons/md";
import {
  GETALLUSERS_API,
  GETALLUSERSBYID_API,
  DELETEUSERSBYID_API,
} from "../../Constants/apiRoutes";
import "../../style.css";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";

import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { DataContext } from "../../Context/DataContext";

function User() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  // useEffect(() => {
  //   if (storesData) {
  //     setStores(storesData);
  //     // Automatically set selectedStore if there's only one store
  //     if (storesData.length === 1) {
  //       setSelectedStore(storesData[0]);
  //     }
  //   }
  // }, [storesData]);
  const getStoreIDs = (stores) => {
    return stores.map((store) => store.StoreID); // Return an array of StoreIDs
  };

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
      // Automatically set selectedStore if there's only one store
      if (storesData.length === 1) {
        setSelectedStore(storesData[0]);
      }
    }
  }, [storesData]);

  const handleStoreChange = (newStore) => {
    setSelectedStore(newStore);
    setPage(0); // Reset to first page when store changes
  };
  const getAllUsers = async (pageNum, pageSize, search = "", storeIDs = []) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(GETALLUSERS_API, {
        params: {
          pageNumber: pageNum + 1,
          pageSize: pageSize,
          SearchText: search,
          StoreIDs: storeIDs,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return {
        users: response.data.users,
        totalCount: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchName, stores, selectedStore]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const storeIDs = selectedStore
        ? [selectedStore.StoreID] // Wrap single StoreID in an array
        : getStoreIDs(stores); // Get array of StoreIDs
      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setIsLoading(false);
        return;
      }
      const { users, totalCount } = await getAllUsers(
        page,
        rowsPerPage,
        searchName,
        storeIDs
        // selectedStore?.StoreID || "" // Pass the selected store ID
      );
      setUsers(users);
      setTotalUsers(totalCount);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getUserById = async (userId) => {
    const token = localStorage.getItem("token");
    setIsLoading(true); // Set isLoading to true before making the network call
    try {
      const response = await axios.get(`${GETALLUSERSBYID_API}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the headers
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    } finally {
      setIsLoading(false); // Set isLoading to false in the finally block
    }
  };

  const deleteUserById = async (userId) => {
    const token = localStorage.getItem("token");
    setIsLoading(true); // Set isLoading to true before making the network call
    try {
      const response = await axios.delete(`${DELETEUSERSBYID_API}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the headers
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      setIsLoading(false); // Set isLoading to false in the finally block
    }
  };

  const handleEditClick = (userId) => {
    navigate(`/userform/${userId}`);
  };

  const handleDeleteClick = async (userId) => {
    setIsLoading(true);
    try {
      await deleteUserById(userId);
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setUserDetails(null);
    navigate("/userform/new");
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportUsersData = async () => {
    try {
      const { users } = await getAllUsers(0, totalUsers); // Fetch all users for export
      exportToExcel(users, "Customers");
    } catch (error) {
      console.error("Error exporting users data:", error);
    }
  };

  // Search function
  const searchItems = (searchValue) => {
    setSearchName(searchValue);
  };
   // Retrieve the navbar-collapsed value from localStorage
   const storedCollapsed = localStorage.getItem('navbar-collapsed') === 'true';

   // Set the initial state based on the stored value
   const [isExpanded, setIsExpanded] = useState(!storedCollapsed);
 
   useEffect(() => {
     // Set the initial state based on the localStorage value
     const storedCollapsed = localStorage.getItem('navbar-collapsed');
     if (storedCollapsed !== null) {
       setIsExpanded(storedCollapsed === 'false');
     }
   }, []); // Only run this once on component mount

  return (
    // <div className="main-container">
    <div
    className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
  >
      <div className="body-container">
        <h2 className="heading">Users</h2>
        <div className="search-button-group">
          <ul className="button-list">
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleAddUserClick}
              >
                <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
                Add Users
              </button>
            </li>
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleExportUsersData}
              >
                <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
                Export Users
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-container">
          <div className="search-container-c-u">
            <input
              id="searchName"
              type="text"
              placeholder="Search by Name or Email or Mobile"
              value={searchName}
              onChange={(e) => searchItems(e.target.value)}
              className="search-input"
            />
            <div className="search-icon-container-c-u">
              <IoIosSearch />
            </div>
          </div>
          <div className="combobox-container flex items-center">
            <Combobox value={selectedStore} onChange={setSelectedStore}>
              <div className="combobox-wrapper h-[40px]">
                <Combobox.Input
                  className={`combobox-input w-full h-full ${selectedStore}`}
                  displayValue={(store) =>
                    store?.StoreName || "Select Store ID"
                  }
                  placeholder="Select Store Name"
                  readOnly={storesData.length === 1}
                />
                {storesData.length > 1 && (
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                )}
                {storesData.length > 1 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                    {/* Add "Select Store ID" option */}
                    <Combobox.Option
                      key="select-store-id"
                      value={{ StoreID: null, StoreName: "Select Store ID" }}
                      className={({ active }) =>
                        `cursor-pointer select-none relative p-2 ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
                            Select Store ID
                          </span>
                          {selected && (
                            <CheckIcon
                              className="h-5 w-5 text-white absolute right-2"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      )}
                    </Combobox.Option>
                    {/* Render all store options */}
                    {storesData.map((store) => (
                      <Combobox.Option
                        key={store.StoreID}
                        value={store}
                        className={({ active }) =>
                          `cursor-pointer select-none relative p-2 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={
                                selected ? "font-semibold" : "font-normal"
                              }
                            >
                              {store.StoreName}
                            </span>
                            {selected && (
                              <CheckIcon
                                className="h-5 w-5 text-white absolute right-2"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile No</StyledTableCell>
              <StyledTableCell>Roles</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? ( // Show loading animation while fetching
              <StyledTableRow></StyledTableRow>
            ) : (
              users.map((person) => (
                <StyledTableRow key={person.UserID}>
                  <StyledTableCell>
                    <div className="flex flex-col md:flex-col lg:flex-row items-center lg:space-x-2 space-y-2 lg:space-y-0 w-full">
                      <img
                        src={person.ProfileImage||UserIcone}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col sm:flex-row sm:space-x-2  w-full md:pr-8 lg:pr-8">
                        <span>{person.FirstName}</span>
                        <span>{person.LastName}</span>
                      </div>
                    </div>
                  </StyledTableCell>

                  <StyledTableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {person.Email}
                  </StyledTableCell>

                  <StyledTableCell>{person.PhoneNumber}</StyledTableCell>

                  <StyledTableCell>{person.RoleName}</StyledTableCell>

                  <StyledTableCell>
                    <span
                      className={`w-[68px] text-center gender-pill ${
                        person.Gender === "M"
                          ? "gender-male"
                          : person.Gender === "F"
                          ? "gender-female"
                          : "gender-na"
                      }`}
                    >
                      {person.Gender === null
                        ? "N/A"
                        : person.Gender === "M"
                        ? person.Gender + "ale"
                        : person.Gender + "emale"}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell>
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={() => handleEditClick(person.UserID)}
                        className="button edit-button"
                      >
                        <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(person.UserID)}
                        className="button delete-button"
                      >
                        <MdOutlineCancel
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                        Delete
                      </button>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 25]}
                colSpan={6}
                count={totalUsers}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {isLoading && <LoadingAnimation />}
    </div>
  );
}

export default User;
