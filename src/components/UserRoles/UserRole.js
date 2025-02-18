import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import { AiOutlineEdit } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { FaTable } from "react-icons/fa";
import axios from "axios";
import { UserRoleContext } from "../../Context/roleContext";
import {
  GETALLROLESS_API,
  DELETEROLESBYID_API,
} from "../../Constants/apiRoutes";
import { MdOutlineCancel } from "react-icons/md";
import "../../style.css";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { DataContext } from "../../Context/DataContext";

function UserRoles() {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [totalRoles, setTotalRoles] = useState(0);
  const navigate = useNavigate();
  const { setRoleDetails } = useContext(UserRoleContext);
  const [loading, setLoading] = useState(true);

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
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

  const getAllRoles = async (pageNum, pageSize, search = "", storeIDs = []) => {
    try {
      const response = await axios.get(GETALLROLESS_API, {
        params: {
          page: pageNum + 1,
          limit: pageSize,
          SearchText: search,
          StoreIDs: storeIDs,
        },
      });
      return {
        roles: response.data.roles,
        totalCount: response.data.totalItems,
      };
    } catch (error) {}
  };

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage, searchName, stores, selectedStore]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const storeIDs = selectedStore
        ? [selectedStore.StoreID] // Wrap single StoreID in an array
        : getStoreIDs(stores); // Get array of StoreIDs

      // Debugging: Log storeIDs

      // Prevent API call if storeIDs is empty or invalid
      if (!storeIDs || storeIDs.length === 0) {
        console.warn("No StoreIDs provided. Skipping network call.");
        setLoading(false);
        return;
      }
      const { roles, totalCount } = await getAllRoles(
        page, // Page number
        rowsPerPage, // Page size
        searchName, // Search text
        storeIDs // Pass the selected StoreID here
      );

      // Update roles and total count
      setRoles(roles);
      setTotalRoles(totalCount);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle the deletion of a role
  const deleteRoleById = async (roleId) => {
    try {
      const response = await axios.delete(`${DELETEROLESBYID_API}/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  };

  // Handle edit button click
  const handleEditClick = async (roleId, roleName, storeId, storeMap) => {
    navigate(`/RoleUserEditform/${roleId}`, {
      state: { roleId, roleName, storeId, storeMap },
    });
  };

  // Handle delete button click
  const handleDeleteClick = async (roleId) => {
    try {
      await deleteRoleById(roleId);
      fetchRoles(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportUserRolesData = async () => {
    try {
      const { roles } = await getAllRoles(0, totalRoles); // Fetch all users for export
      exportToExcel(roles, "userRoles");
    } catch (error) {
      console.error("Error exporting userrole data:", error);
    }
  };

  const handleAddUserRoleClick = () => {
    setRoleDetails(null);
    navigate("/RoleUserAddform");
  };

  const searchItems = (searchValue) => {
    setSearchName(searchValue);
    fetchRoles();
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
      {loading && <LoadingAnimation />}
      <div className="body-container">
        <h2 className="heading">Roles</h2>

        <div className="search-button-group">
          <ul className="button-list">
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleAddUserRoleClick}
              >
                <FaPlus aria-hidden="true" className="icon" />
                Add Roles
              </button>
            </li>
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleExportUserRolesData}
              >
                <FaTable aria-hidden="true" className="icon" />
                Export Roles
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-container">
        <div className="search-container-c-u w-1/4">
          <label htmlFor="searchName" className="sr-only">
            Search
          </label>
          <input
            id="searchName"
            type="text"
            placeholder="Search by ID / Name / Status "
            value={searchName}
            onChange={(e) => searchItems(e.target.value)}
            className="search-input w-full pr-10 "
          />
          <div className="search-icon-container-c-u">
            <IoIosSearch className="text-gray-500" />
          </div>
        </div>
        {/* <div className="combobox-container">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper">
              <Combobox.Input
                className="combobox-input  w-full h-10 px-3"
                displayValue={(store) => store?.StoreName || "Select Store ID"}
                placeholder="Select Store Name"
              />
              <Combobox.Button className="combobox-button">
                <ChevronUpDownIcon
                  className="combobox-icon"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="combobox-options">
                
                <Combobox.Option
                  key="select-store-id"
                  className={({ active }) =>
                    active ? "combobox-option-active" : "combobox-option"
                  }
                  value={{ StoreID: null, StoreName: "Select Store ID" }}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={
                          selected
                            ? "combobox-option-text font-semibold"
                            : "combobox-option-text font-normal"
                        }
                      >
                        Select Store ID
                      </span>
                      {selected && (
                        <span
                          className={
                            active
                              ? "combobox-option-selected-icon active-selected-icon"
                              : "combobox-option-selected-icon"
                          }
                        >
                          <CheckIcon
                            className="combobox-check-icon"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>

                
                {stores.map((store) => (
                  <Combobox.Option
                    key={store.StoreID}
                    className={({ active }) =>
                      active ? "combobox-option-active" : "combobox-option"
                    }
                    value={store}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={
                            selected
                              ? "combobox-option-text font-semibold"
                              : "combobox-option-text font-normal"
                          }
                        >
                          {store.StoreName}
                        </span>
                        {selected && (
                          <span
                            className={
                              active
                                ? "combobox-option-selected-icon active-selected-icon"
                                : "combobox-option-selected-icon"
                            }
                          >
                            <CheckIcon
                              className="combobox-check-icon"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div> */}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper h-[40px]">
              <Combobox.Input
                 className={`combobox-input w-full h-full ${
                  selectedStore
                }`}
                displayValue={(store) => store?.StoreName || "Select Store ID"}
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
                          className={selected ? "font-semibold" : "font-normal"}
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

      <TableContainer
        component={Paper}
        className="mt-4"
        sx={{ width: "100%", margin: "0 auto", marginTop: "1rem" }}
      >
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Role ID</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="center">Store Name</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? ( // Show loading animation while fetching
              <StyledTableRow></StyledTableRow>
            ) : (
              roles.map((row) => (
                <StyledTableRow key={row.RoleID}>
                  <StyledTableCell align="left">{row.RoleID}</StyledTableCell>
                  <StyledTableCell align="left">{row.RoleName}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.StoreName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <span
                      className={`status-pill ${
                        row.Status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {row.Status}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="center" colSpan={2}>
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(row.RoleID, row.RoleName, row.StoreID)
                        }
                        className="button edit-button "
                      >
                        <AiOutlineEdit
                          aria-hidden="true"
                          className="h-4 w-4 mr-1"
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(row.RoleID)}
                        className="button delete-button "
                      >
                        <MdOutlineCancel
                          aria-hidden="true"
                          className="h-4 w-4 mr-1"
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
                colSpan={4}
                count={totalRoles}
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
    </div>
  );
}

export default UserRoles;
