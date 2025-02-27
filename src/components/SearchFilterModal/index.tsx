/* eslint-disable no-console, @typescript-eslint/ban-ts-comment */

'use client';

import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';

interface FilterOption {
  id: number;
  name: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsFilterModalOpen: (isOpen: boolean) => void;
  searchData: {
    categories: number[];
    cities: number[];
    countries: number[];
  };
  onApplyFilters: (filters: {
    cities: number[];
    countries: number[];
    categories: number[];
  }) => void;
}

const SearchFilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  setIsFilterModalOpen,
  searchData,
}) => {
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [cities, setCities] = useState<FilterOption[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const asyncfetchFilterData = async () => {
      setLoading(true);

      // const { categories, subcategories, cities, countries } =
      //   await fetchFilterData();

      if (searchData.categories && searchData.categories.length > 0) {
        const cat = searchData.categories.map((category) => ({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...category,
          type: 'categories',
        }));
        setCategories(cat);
      }

      if (searchData.cities && searchData.cities.length > 0) {
        const cit = searchData.cities.map((city) => ({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...city,
          type: 'city',
        }));
        setCities(cit);
      }

      // console.log("searchData", categories[0]);

      // setSubcategories(subcategories);
      // setCountries(countries);

      setLoading(false);
    };
    if (isOpen) {
      asyncfetchFilterData();
    }
  }, [isOpen, searchData.categories, searchData.cities]);

  const handleCheckboxChange = (
    id: number,
    type: 'city' | 'category' | 'country'
  ) => {
    if (type === 'city') {
      setSelectedCities((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else if (type === 'country') {
      setSelectedCountries((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else if (type === 'category') {
      setSelectedCategories((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handleReset = () => {
    setSelectedCities([]);
    setSelectedCountries([]);
    setSelectedCategories([]);
    onApplyFilters({
      cities: [],
      countries: [],
      categories: [],
    });
    setIsFilterModalOpen(false);
  };

  const handleShowResults = () => {
    onApplyFilters({
      categories: selectedCategories,
      cities: selectedCities,
      countries: selectedCountries,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md p-4 rounded shadow"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        {loading ? (
          <div className="mx-auto my-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Categories */}
            <div className="mb-4">
              <h3 className="font-bold mb-2">Interests / Categories</h3>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {categories.map((cat) => (
                  /* eslint-disable */
                  <label key={cat.id} className="flex items-center mb-2">
                    <input
                      key={cat.id}
                      type="checkbox"
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      checked={selectedCategories.includes(cat.categoryId)}
                      onChange={() =>
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        handleCheckboxChange(cat.categoryId, "category")
                      }
                      className="mr-2"
                    />
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      cat.categoryName
                    }
                  </label>
                  /* eslint-enable */
                ))}
              </div>
            </div>

            {/* Countries */}
            {/* <div className="mb-4">
              <h3 className="font-bold mb-2">Countries</h3>
              <div className="max-h-32 overflow-y-auto border rounded p-2">
                {countries.map((country) => (
                  <label key={country.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country.id)}
                      onChange={() =>
                        handleCheckboxChange(country.id, "country")
                      }
                      className="mr-2"
                    />
                    {country.name}
                  </label>
                ))}
              </div>
            </div> */}

            {/* Cities */}
            {cities && cities.length > 0 && (
              /* eslint-disable */

              <div className="mb-4">
                <h3 className="font-bold mb-2">Cities</h3>
                <div className="max-h-32 overflow-y-auto border rounded p-2">
                  {cities.map((city) => (
                    <label key={city.id} className="flex items-center mb-2">
                      <input
                        key={city.id}
                        type="checkbox"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        checked={selectedCities.includes(city.cityId)}
                        onChange={() =>
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          handleCheckboxChange(city.cityId, "city")
                        }
                        className="mr-2"
                      />
                      {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        city.cityName
                      }
                    </label>
                  ))}
                </div>
              </div>
              /* eslint-enable */
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            className="text-sm bg-gray-200 px-3 py-1 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleShowResults}
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterModal;
