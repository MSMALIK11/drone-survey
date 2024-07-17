export const getAccessLevel = (filter) => {
    if (filter?.read && filter?.write) return "all";
    if (filter?.read) return "read";
    if (filter?.write) return "write";
    return "";
  };
  