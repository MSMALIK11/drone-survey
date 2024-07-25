// import React, { useState } from "react";
// import Modal from "@mui/material/Modal";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import "../style/dataprocessingmodel.css";
// import CloseIcon from "@mui/icons-material/Close";
// import TextField from "@mui/material/TextField";
// import SearchIcon from "@mui/icons-material/Search";

// const DataProcessingModel = ({ open, onClose }) => {
//   {
//     /* Search functionlity start here  */
//   }
//   const [searchValue, setSearchValue] = useState("");

//   const handleSearchChange = (e) => {
//     setSearchValue(e.target.value);
//   };

//   {
//     /* Search functionlity End here  */
//   }

//   const checkboxValues1 = ["Personal", "Shared"];
//   const checkboxValues = [
//     "Mining",
//     "Sloar",
//     "Agriculture",
//     "Transmission Inspection",
//     "Wind Inspection",
//     "Corridor Inspection",
//   ];

//   const [selectedValues, setSelectedValues] = useState([]);

//   const handleCheckboxChange = (value) => {
//     if (selectedValues.includes(value)) {
//       setSelectedValues(selectedValues.filter((item) => item !== value));
//     } else {
//       setSelectedValues([...selectedValues, value]);
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "flex-end",
//       }}
//     >
//       <Box
//         sx={{
//           width: 500,
//           height: "100vh",
//           bgcolor: "background.paper",
//           boxShadow: 24,
//         }}
//       >
//         {/* Fixed Header part start model */}
//         <Box className="dataproceesing_model_header">
//           <Box className="dataprocessing_model_heading_left">
//             <h3
//               style={{
//                 fontSize: "1.25rem",
//                 fontWeight: "700",
//                 lineHeight: "1.875rem",
//                 letterSpacing: "0rem",
//                 fontFamily: "Satoshi-Variable",
//                 textTransform: "none",
//                 paddingLeft: "15px",
//               }}
//             >
//               Filters
//             </h3>
//             <h5
//               style={{
//                 paddingLeft: "15px",
//                 fontSize: "16px",
//                 fontWeight: "500",
//               }}
//             >
//               {" "}
//               Apply filters to table data.
//             </h5>
//           </Box>
//           <Box
//             className="dataprocessing_model_heading_right"
//             sx={{ paddingRight: "15px" }}
//           >
//             <CloseIcon onClick={onClose} />
//           </Box>
//         </Box>
//         {/* Fixed Header part end model */}

//         {/* Data processing Body part start here */}
//         <Box className="data_processing_sub_header">
//           <h3 style={{ fontSize: "20px", fontWeight: "500" }}>
//             Select Project
//           </h3>
//           <TextField
//             label="Search"
//             fullWidth
//             variant="outlined"
//             value={searchValue}
//             onChange={handleSearchChange}
//             style={{
//               width: "400px",
//               height: "10px",
//               marginTop: "16px",
//             }}
//             InputProps={{
//               startAdornment: <SearchIcon color="action" />,
//             }}
//           />

//           {/*  checkbox value start here */}
//           <Box style={{ marginTop: "3.5rem" }}>
//             <p
//               style={{
//                 marginTop: "5px",
//                 marginBottom: "15px",
//                 fontSize: "18px",
//               }}
//             >
//               Select Project
//             </p>
//             {checkboxValues1.map((value) => (
//               <div
//                 key={value}
//                 style={{
//                   marginBottom: "20px",
//                   marginTop: "10px",
//                   fontSize: "18px",
//                 }}
//               >
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={value}
//                     checked={selectedValues.includes(value)}
//                     onChange={() => handleCheckboxChange(value)}
//                   />
//                   {value}
//                 </label>
//               </div>
//             ))}

//             <hr />
//           </Box>

//           <Box style={{ marginTop: "2rem" }}>
//             <p
//               style={{
//                 marginTop: "5px",
//                 marginBottom: "15px",
//                 fontSize: "18px",
//               }}
//             >
//               By Status
//             </p>
//             {checkboxValues.map((value) => (
//               <div
//                 key={value}
//                 style={{
//                   marginBottom: "20px",
//                   marginTop: "10px",
//                   fontSize: "18px",
//                 }}
//               >
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={value}
//                     checked={selectedValues.includes(value)}
//                     onChange={() => handleCheckboxChange(value)}
//                   />
//                   {value}
//                 </label>
//               </div>
//             ))}
//           </Box>

//           {/*  checkbox value start here */}
//         </Box>
//         {/* Data processing Body part End here */}

//         <Box className="data_processing_fixed_footer">
//           <Box className="reset_text">
//             <p style={{ color: "orange" }}>Reset Filter</p>
//           </Box>
//           <Box
//             className="canceel_text"
//             style={{ display: "flex", gap: "20px" }}
//           >
//             <Button
//               style={{ backgroundColor: "white", color: "black" }}
//               variant="contained"
//               onClick={onClose}
//             >
//               Cancel
//             </Button>
//             <Button
//               style={{ backgroundColor: "red" }}
//               variant="contained"
//               color="primary"
//             >
//               Apply
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default DataProcessingModel;
