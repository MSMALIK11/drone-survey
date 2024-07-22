export function getUserPermissions(apiResponse) {
  const permissions = {
    userRole: "user",
    canAnalyze: { read: false, write: false,all:false },
    canReport: { read: false, write: false ,all:false},
    canUpload: { read: false, write: false,all:false },
    isOwner: apiResponse.is_owner,
    canTransferOwnership: false,
    isVisibleAnalyze :true,
    isVisibleReport :true,
    isVisibleUpload :true,
  
    
  };

  // Check if the user is an admin
  if (apiResponse.is_admin) {
    permissions.userRole = "admin";
    permissions.canAnalyze = { read: true, write: true };
    permissions.canReport = { read: true, write: true };
    permissions.canUpload = { read: true, write: true };
    permissions.canTransferOwnership = false; // Admin cannot transfer ownership
  } else {
    // Set analyzer permissions
    if (apiResponse.is_analyzer === "read") {
      permissions.canAnalyze.read = true;
    } else if (apiResponse.is_analyzer === "write") {
      permissions.canAnalyze = { read: true, write: true };
    } else if (apiResponse.is_analyzer === "") {
      permissions.canAnalyze = { read: false, write: false,all:false };
      permissions.isVisibleAnalyze=false
    }

    // Set reporter permissions
    if (apiResponse.is_reporter === "read") {
      permissions.canReport.read = true;
    } else if (apiResponse.is_reporter === "write") {
      permissions.canReport = { read: true, write: true };
    } else if (apiResponse.is_reporter === "") {
      permissions.canReport = { read: false, write: false,all:false };
      permissions.isVisibleReport=false
    }

    // Set uploader permissions
    if (apiResponse.is_uploader === "read") {
      permissions.canUpload.read = true;
    } else if (apiResponse.is_uploader === "write") {
      permissions.canUpload = { read: true, write: true };
    } else if (apiResponse.is_uploader === "") {
      permissions.canUpload = { read: false, write: false,all:false };
      permissions.isVisibleUpload=false
    }
  }

  // If the user is an owner, they have all permissions including transferring ownership
  if (apiResponse.is_owner) {
    permissions.userRole = "owner";
    permissions.canAnalyze = { read: true, write: true };
    permissions.canReport = { read: true, write: true };
    permissions.canUpload = { read: true, write: true };
    permissions.canTransferOwnership = true;
  }

  return permissions;
}

