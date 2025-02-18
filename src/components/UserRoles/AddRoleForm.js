import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
// import Popup from "../../components/Popup/Popup";

import Select from "react-select";
import { FETCH_PERMISSION_URL } from "../../Constants/apiRoutes";
import { CREATE_OR_UPDATE_ROLE_URL } from "../../Constants/apiRoutes";
import { DataContext } from "../../Context/DataContext";
import { toast, ToastContainer } from "react-toastify";
const AddRoleForm = () => {
  const [roleName, setRoleName] = useState("");
  const [storeId, setStoreId] = useState("0");
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);

  const navigate = useNavigate();

   // Retrieve the navbar-collapsed value from localStorage
   const storedCollapsed = localStorage.getItem('navbar-collapsed') === 'true';

   // Set the initial state based on the stored value
   const [isExpanded, setIsExpanded] = useState(!storedCollapsed);
 
   // Toggle the expanded/collapsed state and update localStorage
   const toggleExpandCollapse = () => {
     setIsExpanded(!isExpanded);
     // Save the state to localStorage
     localStorage.setItem('navbar-collapsed', !isExpanded);
   };
 
   useEffect(() => {
     // Set the initial state based on the localStorage value
     const storedCollapsed = localStorage.getItem('navbar-collapsed');
     if (storedCollapsed !== null) {
       setIsExpanded(storedCollapsed === 'false');
     }
   }, []); // Only run this once on component mount
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);

        const response = await axios.get(FETCH_PERMISSION_URL);
        const data = response.data;
        const categorizedPermissions = {};

        if (data.Permissions && Array.isArray(data.Permissions)) {
          data.Permissions.forEach((permission) => {
            if (!categorizedPermissions[permission.Module]) {
              categorizedPermissions[permission.Module] = [];
            }
            categorizedPermissions[permission.Module].push(permission);
          });
        }

        setPermissionsByModule(categorizedPermissions);
      } catch (err) {
        setError("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);
  let roleData = {
    roleId: 0,
    roleName: roleName,
    storeId: storeId,
    permissions: [],
  };
  const handleCheckboxChange = (moduleName, permissionId) => {
    setPermissionsByModule((prevState) => {
      const updatedPermissions = { ...prevState };
      updatedPermissions[moduleName] = updatedPermissions[moduleName].map(
        (permission) =>
          permission.ID === permissionId
            ? { ...permission, IsChecked: !permission.IsChecked }
            : permission
      );
      return updatedPermissions;
    });
  };

  const handleSelectAllChange = (moduleName, isChecked) => {
    setPermissionsByModule((prevState) => {
      const updatedPermissions = { ...prevState };
      updatedPermissions[moduleName] = updatedPermissions[moduleName].map(
        (permission) => ({
          ...permission,
          IsChecked: isChecked,
        })
      );
      return updatedPermissions;
    });
  };

  const handleClose = () => {
    navigate("/RoleUser");
  };

  if (error) return <div>{error}</div>;

  const storeOptions = stores.map((store) => ({
    value: store.StoreID,
    label: store.StoreName,
  }));

  const handleStoreChange = (selectedOption) => {
    setStoreId(selectedOption.value);
  };
  const handleSaveRole = async (event) => {
    event.preventDefault();

    let roleData = {
      roleId: 0,
      roleName: roleName,
      storeId: storeId,
      permissions: [],
    };

    // Validation
    const validateRoleDataSubmit = () => {
      const newErrors = {};
      if (roleData.storeId === "0") {
        newErrors.StoreIdError = "Store Name is required.";
      }
      if (!roleData.roleName) {
        newErrors.RoleNameError = "Role Name is required.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length > 0; // Return true if there are errors
    };

    const validationError = validateRoleDataSubmit();
    if (validationError) {
      return; // Exit function if validation fails
    }

    Object.keys(permissionsByModule).forEach((module) => {
      permissionsByModule[module].forEach((permission) => {
        roleData.permissions.push({
          permissionId: permission.ID,
          isChecked: permission.IsChecked,
        });
      });
    });

    try {
      setLoading(true);
      const response = await axios.post(CREATE_OR_UPDATE_ROLE_URL, roleData);
      // Handle successful role saving here (e.g., navigate or update state)
      setTimeout(() => {
        navigate("/roleuser");
      }, 5500);
    } catch (error) {
      setErrors({ saveError: "Error saving role. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    // <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
    // <div className="main-container">
    <div
    className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
  >
      <div className=" p-6 rounded-lg ">
        <ToastContainer />
        {loading && <LoadingAnimation />}

        {/* <div className="mt-6 bg-white p-6 rounded-lg shadow-md"> */}
        <h2 className="heading">Add Role</h2>
        <hr className="border-gray-300 my-4 mb-4" />

        <div className="mb-4 flex flex-col items-center justify-center">
          <div className=" flex flex-col sm:flex-row justify-center items-center w-full ">
            <label className="block font-semibold mr-[14px]">
              Store Name <span className="text-red-500">*</span>
            </label>
            <Select
              value={storeOptions.find((option) => option.value === storeId)}
              onChange={handleStoreChange}
              options={storeOptions}
              className={`w-full sm:w-1/2 border rounded-md ${
                errors.StoreIdError && roleData.storeId === "0"
                  ? "border-red-500"
                  : "border-gray-300"
              } `}
            />
          </div>
          <div className="w-full sm:w-1/2 flex justify-center sm:mr-[294px] mt-1 mb-1 ">
            {errors.StoreIdError && roleData.storeId === "0" && (
              <p className="text-red-500 text-sm ">{errors.StoreIdError}</p>
            )}
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center justify-center">
          <div className=" flex flex-col sm:flex-row justify-center items-center w-full ">
            <label className="block font-semibold mr-[14px]">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className={`border ${
                errors.RoleNameError && !roleData.roleName ? "border-red-500" : "border-gray-300"
              } p-2 w-full sm:w-1/2 rounded-md`}
              placeholder="Enter Role Name"
            />
          </div>
          <div className="w-full sm:w-1/2 flex justify-center sm:mr-[300px] mt-1 mb-1 ">
            {errors.RoleNameError && !roleData.roleName && (
              <p className="text-red-500 text-sm ">{errors.RoleNameError}</p>
            )}
          </div>
        </div>
        <hr className="border-gray-300 my-4 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(permissionsByModule).map((moduleName) => {
            const isAllSelected = permissionsByModule[moduleName].every(
              (permission) => permission.IsChecked
            );

            return (
              <div
                key={moduleName}
                className="border p-4 rounded-lg shadow bg-[#e5efff]"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{moduleName}</h2>
                  <label className="text-sm">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) =>
                        handleSelectAllChange(moduleName, e.target.checked)
                      }
                      className="mr-2 form-checkbox h-[12px] w-[12px] text-blue-600"
                    />
                    Select All
                  </label>
                </div>
                <hr className="border-gray-300 my-4 mt-2 mb-4" />

                {permissionsByModule[moduleName].map((permission) => (
                  <div key={permission.ID} className="flex items-center mb-2">
                    <label>
                      <input
                        type="checkbox"
                        checked={permission.IsChecked}
                        onChange={() =>
                          handleCheckboxChange(moduleName, permission.ID)
                        }
                        className="mr-2 form-checkbox h-[12px] w-[12px] text-blue-600"
                      />
                      {permission.Name}
                    </label>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded shadow w-full sm:w-auto"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="bg-[#003375] text-white px-4 py-2 rounded shadow w-full sm:w-auto"
            onClick={handleSaveRole}
          >
            Save Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleForm;
