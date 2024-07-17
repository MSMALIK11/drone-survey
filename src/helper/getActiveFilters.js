export const getActiveFilters =(filters) => {
    const activeFilters = Object?.entries(filters).flatMap(([key, value]) =>
      typeof value === "object"
        ? Object.entries(value).filter(([, v]) => v).map(([subKey]) => `${key}.${subKey}`)
        : value
        ? [key]
        : []
    );

    return activeFilters.length;
  }