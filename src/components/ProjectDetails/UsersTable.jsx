import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { visuallyHidden } from "@mui/utils";
import { Button, Menu, MenuItem, Skeleton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CachedIcon from "@mui/icons-material/Cached";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import api from "../../services";
import {
  TRANSFER_OWNERSHIP,
  REMOVE_USER,
  EDIT_USER,
} from "../../constant/constant";
import FilterMenu from "./FilterMenu";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { getUserType } from "../../helper/getUserType";
import { useSelector } from "react-redux";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name/Email",
    sortable: true,
    isVisible: true,
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
    sortable: false,
    isVisible: true,
  },
  {
    id: "permission",
    numeric: false,
    disablePadding: false,
    label: "Permission",
    sortable: false,
    isVisible: true,
  },
  // {
  //   id: "actions",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Actions",
  //   sortable: false,

  // },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    isActive,
    isVisible,
    user,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {user.userRole !== "user" && (
          <TableCell padding="checkbox">
            <Checkbox
              disabled={!isActive}
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.numeric
                ? "right"
                : headCell.id === "permission"
                ? "left"
                : "left"
            }
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {!headCell.sortable && headCell.label}
            {headCell.sortable && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}{" "}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        {!isVisible && <TableCell key={"actions"}>Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const initialPayload = {
  is_admin: false,
  is_owner: false,
  is_analyzer: "",
  is_reporter: "",
  is_uploader: "",
  initial: true,
  page_size: 15,
};
// Component start
function UsersTable({
  onMenuClick,
  onMenuItemClick,
  anchorEl,
  open,
  onClose,
  onAddClick,
  handleSelection,
  onDeleteSelection,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const isActive = useSelector((state) => state?.projectDetails?.data?.active);
  const { totalActiveFilterCount } = useSelector((state) => state.userFilter);
  const [selectedFilter, setSelectedFilter] = useState(initialPayload);
  const res = useSelector((state) => state.projectDetails.data);
  const tableContainerRef = useRef(null);
  const user = useSelector((state) => state.projectDetails.permissions);
  const { isLoading, data, refetch } = useQuery(
    ["getProjectUsersList"],
    () => api.user.getListOfUsers(selectedFilter),
    {
      enabled: !!res,
      onSuccess: (res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setTableData((prev) => {
            const updatedData =
              totalActiveFilterCount === 0 && !selectedFilter.initial
                ? [...prev, ...data]
                : data;
            return updatedData;
          });
        } else {
          console.error("Expected an array but got something else:", data.data);
        }
      },
    }
  );

  const usersList =
    !isLoading && data && Array.isArray(data?.data) ? data?.data : [];

  // Refetch data when selectedFilter changes
  useEffect(() => {
    if (!res || !isActive) return;
    refetch();
  }, [selectedFilter, refetch, res, isActive]);

  const rows = usersList ? [...usersList] : [];
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.user_email);
      setSelected(newSelected);
      handleSelection(newSelected);
      return;
    }
    handleSelection([]);
    setSelected([]);
  };
  const onFilterMenuItemClick = (val) => {
    setSelectedFilter(val);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    handleSelection(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleMenuClick = (event, item) => {
    event.stopPropagation();
    onMenuClick(event, item);
    setSelected([]);
  };

  const onResetFilter = () => {
    setTableData([]);
    setSelectedFilter(initialPayload);
  };
  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    const handleClearSelection = () => {
      setSelected([]);
      handleSelection([]);
    };

    const handleDeleteSelection = () => {
      onDeleteSelection();
      setSelected([]);
    };

    return (
      <Toolbar
        sx={{
          background: "#DCDCDC",
          height: "66px",
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {}),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} Selected
            <Tooltip title="Clear selection" arrow sx={{ marginLeft: "5px" }}>
              <IconButton onClick={handleClearSelection}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
            className="text-background text-md"
          >
            {t("label.usersList")} {`(${tableData?.length})`}
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDeleteSelection}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div className=" w-[400px]">
            <div className="flex gap-4 items-center justify-end">
              {user?.userRole !== "user" && (
                <FilterMenu
                  onItemClick={onFilterMenuItemClick}
                  onResetFilter={onResetFilter}
                />
              )}

              {user?.userRole !== "user" && (
                <Tooltip title="Add new user" arrow>
                  <Button
                    disabled={!isActive}
                    sx={{
                      fontSize: "14px",
                      borderRadius: "25px",
                      minWidth: "140px",
                    }}
                    variant="outlined"
                    onClick={() => onAddClick()}
                  >
                    <AddCircleOutlineIcon
                      fontSize="small"
                      sx={{ marginRight: "8px" }}
                    />
                    {t("actions.addUser")}
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </Toolbar>
    );
  }

  const handleScroll = useCallback(() => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        setSelectedFilter((prev) => ({ ...prev, initial: false }));
      }
    }
  }, [setSelectedFilter]);

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);
  const renderSkeleton = () =>
    Array.from(new Array(5)).map((_, index) => (
      <TableRow key={index}>
        <TableCell padding="checkbox">
          <Skeleton variant="rectangular" width={24} height={24} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}>
            <Skeleton variant="text" />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={6}>Users not found</TableCell>
    </TableRow>
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected?.length} />
        <TableContainer ref={tableContainerRef} id="table-container">
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              isActive={isActive}
              isVisible={user.userRole === "user"}
              user={user}
            />
            <TableBody>
              {isLoading
                ? renderSkeleton()
                : tableData?.length > 0
                ? tableData?.map((row, index) => {
                    const isItemSelected = isSelected(row?.user_email);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row?.user_email}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        {user.userRole !== "user" && (
                          <StyledTableCell
                            padding="checkbox"
                            onClick={(event) =>
                              handleClick(event, row?.user_email)
                            }
                          >
                            <Checkbox
                              disabled={!isActive}
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </StyledTableCell>
                        )}
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="row"
                        >
                          {row.name}
                          <p className="text-xs text-muted">{row.user_email}</p>
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.type} {getUserType(row)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.is_owner || row.is_admin ? (
                            "All Permissions Granted"
                          ) : (
                            <div className="flex gap-4">
                              <Tooltip
                                title={`Upload photo - ${row?.is_uploader}`}
                                arrow
                              >
                                <IconButton
                                  sx={{
                                    background: "#EFF6FF",
                                    border: "1px solid #177CF0",
                                    opacity: row?.is_uploader ? "" : "0.4",
                                  }}
                                >
                                  <InsertPhotoIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title={`Analyze photo - ${row?.is_analyzer}`}
                                arrow
                              >
                                <IconButton
                                  sx={{
                                    background: "#EFF6FF",
                                    border: "1px solid #177CF0",
                                    opacity: row?.is_analyzer ? "" : "0.4",
                                  }}
                                >
                                  <AnalyticsIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title={`Generate report - ${row.is_reporter}`}
                                arrow
                              >
                                <IconButton
                                  sx={{
                                    background: "#EFF6FF",
                                    border: "1px solid #177CF0",
                                    opacity: row?.is_reporter ? "" : "0.4",
                                  }}
                                >
                                  <DescriptionIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}
                        </StyledTableCell>

                        {user.userRole !== "user" && (
                          <StyledTableCell align="right">
                            <Tooltip title="More actions" arrow>
                              <IconButton
                                disabled={selected.length > 1 || !isActive}
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={(e) => handleMenuClick(e, row)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Tooltip>

                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl}
                              open={open}
                              onClose={onClose}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                              key={row?.user_email}
                            >
                              <MenuItem
                                onClick={() => onMenuItemClick(EDIT_USER)}
                              >
                                <CachedIcon sx={{ marginRight: "8px" }} />{" "}
                                {t("actions.editUser")}
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  onMenuItemClick(TRANSFER_OWNERSHIP)
                                }
                                sx={{
                                  display:
                                    user.userRole === "admin" ? "none" : "",
                                }}
                              >
                                <SyncAltIcon sx={{ marginRight: "8px" }} />{" "}
                                {t("actions.transferOwnership")}
                              </MenuItem>

                              <MenuItem
                                onClick={() => onMenuItemClick(REMOVE_USER)}
                              >
                                <PersonIcon sx={{ marginRight: "8px" }} />{" "}
                                {t("actions.removeUser")}
                              </MenuItem>
                            </Menu>
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    );
                  })
                : renderEmptyState()}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default React.memo(UsersTable);
