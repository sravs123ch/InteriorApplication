import React, { useState } from "react";
import { MdDesignServices } from "react-icons/md";
import {
  PendingActions as PendingIcon,
  CheckBox as ApprovedIcon,
  PrecisionManufacturing as ProductionIcon,
  Engineering as TechnicalIcon,
  Architecture as DesignIcon,
} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GppBadIcon from "@mui/icons-material/GppBad";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ListIcon from "@mui/icons-material/List";
import EngineeringIcon from "@mui/icons-material/Engineering";
import InventoryIcon from "@mui/icons-material/Inventory";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import StraightenIcon from "@mui/icons-material/Straighten";
import CameraOutdoorIcon from "@mui/icons-material/CameraOutdoor";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const FilterBar = ({ selectedFilter, onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElTime, setAnchorElTime] = useState(null); // Anchor for Time filter button

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeMenuOpen = (event) => {
    setAnchorElTime(event.currentTarget);
  };

  const handleTimeMenuClose = () => {
    setAnchorElTime(null);
  };

  const buttonStyles = {
    height: "40px",
    color: "#1f2937",
    boxShadow: "none",
    borderRadius: "9999px",
    padding: "12px",
    fontSize: "14px",
    marginRight: "10px",
    marginBottom: "5px",
    width: "140px",
  };

  const buttonStylesInside = {
    height: "40px",
    color: "#1f2937",
    boxShadow: "none",
    borderRadius: "9999px",
    padding: "12px",
    fontSize: "14px",
    marginTop: "10px",
    marginRight: "5px",
    marginLeft: "5px",
    boxShadow: "0 0 0 1px black inset",
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-0">
      <Button
        disableRipple
        variant="contained"
        startIcon={<ListIcon />}
        sx={{ mx: 1 }}
        style={{
          ...buttonStyles,
          textTransform: "capitalize",
          backgroundColor: selectedFilter === "All" ? "#9f2042" : "#fde2e4",
          color: selectedFilter === "All" ? "white" : "#9e0059",
          boxShadow: "0 0 0 1px #9e0059 inset",
        }}
        onClick={() => onFilterChange("All")}
      >
        All
      </Button>

      <Button
        disableRipple
        variant="contained"
        startIcon={<ApprovedIcon />}
        style={{
          ...buttonStyles,
          textTransform: "capitalize",
          backgroundColor:
            selectedFilter === "Quick Quote" ? "#0891b2" : "#cffafe",
          color: selectedFilter === "Quick Quote" ? "white" : "#155e75",
          boxShadow: "0 0 0 1px #155e75 inset",
        }}
        onClick={() => onFilterChange("Quick Quote")}
      >
        Quick Quote
      </Button>
      <Button
        disableRipple
        variant="contained"
        startIcon={<MdDesignServices />}
        style={{
          ...buttonStyles,
          textTransform: "capitalize",
          backgroundColor:
            selectedFilter === "Initial Design" ? "#ff9c68" : "#ffdfce",
          color: selectedFilter === "Initial Design" ? "white" : "#bc4000",
          boxShadow: "0 0 0 1px #bc4000 inset",
        }}
        onClick={() => onFilterChange("Initial Design")}
      >
        Initial Design
      </Button>


      {/* More Button with Dropdown */}
      <Button
        disableRipple
        variant="contained"
        startIcon={<MoreHorizIcon />}
        onClick={handleMenuOpen}
        style={{
          ...buttonStyles,
          textTransform: "capitalize",
          color: "#92400e",
          boxShadow: "0 0 0 1px #8a5a44 inset",
          backgroundColor:
            selectedFilter !== "All" &&
            selectedFilter !== "Pending" &&
            selectedFilter !== "Quick Quote" &&
            selectedFilter !== "Initial Design" &&
            selectedFilter !== "2" &&
            selectedFilter !== "1"
              ? "#9d6b53"
              : "#fef3c7",
          color:
            selectedFilter !== "All" &&
            selectedFilter !== "Pending" &&
            selectedFilter !== "Quick Quote" &&
            selectedFilter !== "Initial Design" &&
            selectedFilter !== "2" &&
            selectedFilter !== "1"
              ? "white"
              : "#8a5a44",
        }}
      >
        More
      </Button>

      {/* Time Filter Button */}
      {/* Time Filter Button */}
      <Button
        disableRipple
        variant="contained"
        startIcon={<MoreHorizIcon />}
        onClick={handleTimeMenuOpen}
        style={{
          ...buttonStyles,
          textTransform: "capitalize",
          backgroundColor:
            selectedFilter === "2" || selectedFilter === "1"
              ? "#9d174d"
              : "#fce7f3",
          color:
            selectedFilter === "2" || selectedFilter === "1"
              ? "white"
              : "#9d174d",
          boxShadow: "0 0 0 1px #9d174d inset",
        }}
      >
        Time Filters
      </Button>
      {/* Dropdown Menu for More Filters */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: "200px",
            width: "220px",
            backgroundColor: "#f1f5f9",
          },
        }}
      >
        {/* Other filter options in More */}
        <MenuItem
          onClick={() => {
            onFilterChange("Initial Measurements");
            handleMenuClose();
          }}
          style={buttonStylesInside}
        >
          <StraightenIcon sx={{ mr: 1 }} />
          Initial Measurements
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange("Revised Design");
            handleMenuClose();
          }}
          style={buttonStylesInside}
        >
          <EngineeringIcon sx={{ mr: 1 }} />
          Revised Design
        </MenuItem>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              maxHeight: "200px",
              width: "220px",
              backgroundColor: "#f1f5f9",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onFilterChange("Initial Measurements");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Initial Measurement"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Initial Measurement" ? "white" : "#92400e",
            }}
          >
            <StraightenIcon sx={{ mr: 1 }} />
            Initial Measurements
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Revised Design");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Revised Design"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Revised Design" ? "white" : "#92400e",
            }}
          >
            <EngineeringIcon sx={{ mr: 1 }} />
            Revised Design
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Final Measurement");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Final Measurement"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Final Measurement" ? "white" : "#92400e",
            }}
          >
            <DesignIcon sx={{ mr: 1 }} />
            Final Measurement
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Signup Document");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Signup Document"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Signup Document" ?"white" : "#92400e",
            }}
          >
            <FactCheckIcon sx={{ mr: 1 }} />
            Signup Document
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Production");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Production"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Production" ? "white" : "#92400e",
            }}
          >
            <ProductionIcon sx={{ mr: 1 }} />
            Production
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("PDI");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "PDI"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "PDI" ? "white" : "#92400e",
            }}
          >
            <CameraOutdoorIcon sx={{ mr: 1 }} />
            PDI
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Dispatch");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Dispatch"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Dispatch" ? "white" : "#92400e",
            }}
          >
            <LocalShippingIcon sx={{ mr: 1 }} />
            Dispatch
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Installation");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Installation"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Installation" ? "white" : "#92400e",
            }}
          >
            <InventoryIcon sx={{ mr: 1 }} />
            Installation
          </MenuItem>

          <MenuItem
            onClick={() => {
              onFilterChange("Completion");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor: "#fef3c7",
              // backgroundColor:
              //   selectedFilter === "Completed"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Completed" ? "white" : "#92400e",
            }}
          >
            <ThumbUpIcon sx={{ mr: 1 }} />
            Completed
          </MenuItem>
          <MenuItem
            onClick={() => {
              onFilterChange("Cancelled");
              handleMenuClose();
            }}
            style={{
              ...buttonStylesInside,
              padding: "10px 15px",
              fontSize: "14px",
              // color: "#92400e",
              // backgroundColor:
              //   selectedFilter === "Cancelled"
              //     ? "#92400e  "
              //     : "#fef3c7 ",
              // color: selectedFilter === "Cancelled" ? "white" : "#92400e",
            }}
          >
            <GppBadIcon sx={{ mr: 1 }} />
            Cancelled
          </MenuItem>
        </Menu>

        {/* Additional menu items... */}
      </Menu>

      {/* Dropdown Menu for Time Filters */}
      <Menu
        anchorEl={anchorElTime}
        open={Boolean(anchorElTime)}
        onClose={handleTimeMenuClose}
        PaperProps={{
          style: {
            maxHeight: "200px",
            width: "220px",
            backgroundColor: "#f1f5f9",
          },
        }}
      >
        {/* Time Filter Options */}
        <MenuItem
          onClick={() => {
            onFilterChange("2");
            handleTimeMenuClose();
          }}
          style={buttonStylesInside}
        >
          <WatchLaterIcon sx={{ mr: 1 }} />
          Delay
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFilterChange("1");
            handleTimeMenuClose();
          }}
          style={buttonStylesInside}
        >
          <EmojiEmotionsIcon sx={{ mr: 1 }} />
          On Time
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FilterBar;
