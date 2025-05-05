import React, { createContext, useContext, useState } from "react";

export type Filters = {
  genres: number[];
  platforms: number[];
};

type FiltersContextType = {
  selectedFilters: Filters;
  setSelectedFilters: (filters: Filters) => void;
};

const FiltersContext = createContext<FiltersContextType>({
  selectedFilters: { genres: [], platforms: [] },
  setSelectedFilters: () => {},
});

export const FiltersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    genres: [],
    platforms: [],
  });

  return (
    <FiltersContext.Provider value={{ selectedFilters, setSelectedFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);

export default FiltersContext;
