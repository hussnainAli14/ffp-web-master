'use client';

import Link from 'next/link';
import { useState } from 'react';

import { PlaceHomeCityProps } from '@ffp-web/app/index.types';
import {
  Carousel,
  CategoriesSlider,
  CategoriesTab,
  PlacesSlider,
  SectionTitle,
} from '@ffp-web/components';
import SearchFilterModal from '@ffp-web/components/SearchFilterModal';


import useHome from './useHome';

const HomePage = () => {
  const {
    loading,
    categories,
    products,
    selectedCategoryId,
    setSelectedCategoryId,
    fetchProducts,
    places,
  } = useHome();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<PlaceHomeCityProps[]>(
    []
  );

  const handleApplyFilters = (filters: {
    cities: number[];
    countries: number[];
    categories: number[];
  }) => {
    if (filters.categories.length === 0) {
      setSelectedCategories([]);
    } else {
      const category = categories.filter((category) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
        filters.categories.includes(category.categoryId)
      );
      fetchProducts(category[0].categoryId);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
      setSelectedCategories(category);
      setSelectedCategoryId(category[0].categoryId);
    }

    if (filters.cities.length === 0) {
      setSelectedCities([]);
    } else {
      const city = places.filter((place) =>
        filters.cities.includes(place.cityId)
      );
      setSelectedCities(city);
    }
  };

  return (
    <div className="mb-8 md:mb-16">
      <Carousel />

      <div className="px-4 md:px-20 xl:px-28 mt-8 md:mt-12 xl:mt-16 flex justify-between items-center">
        <SectionTitle keyTitle="Popular" restTitle="in Your Area" />
        <SearchFilterModal
          isOpen={isFilterModalOpen}
          setIsFilterModalOpen={setIsFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          searchData={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
            cities: places,
            // countries: selectedCountries,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
            categories: categories,
          }}
        />
        <button
          className="ml-2 bg-gray-100 px-3 py-1 rounded-full border hover:bg-gray-200 flex items-center"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            height="12"
            style={{ paddingRight: '5px' }}
          >
            <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
          </svg>
          Filters
        </button>
      </div>
      <CategoriesTab
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
        categories={
          selectedCategories.length > 0 ? selectedCategories : categories
        }
        products={products[selectedCategoryId] ?? []}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        isLoadingCategories={loading.category}
        isLoadingProducts={loading.product}
        fetchProducts={fetchProducts}
      />

      <div className="px-4 md:px-20 xl:px-28 mt-10 md:mt-14 xl:mt-20">
        <SectionTitle keyTitle="Popular" restTitle="Attractions" />
      </div>
      <CategoriesSlider
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
        categories={
          selectedCategories.length > 0 ? selectedCategories : categories
        }
        isLoadingCategories={loading.category}
      />

      {(selectedCities.length > 0 || places.length > 0) && (
        <div className="px-4 md:px-20 xl:px-28 mt-6">
          <div className="flex flex-wrap justify-between items-center">
            <SectionTitle keyTitle="Popular" restTitle="Places" />
            <button className="hidden text-lg text-primary-btn font-semibold">
              View More
            </button>
          </div>
        </div>
      )}
      {selectedCities.length > 0 ? (
        <PlacesSlider
          places={selectedCities}
          isLoadingPlaces={loading.places}
        />
      ) : (
        places.length > 0 && (
          <PlacesSlider places={places} isLoadingPlaces={loading.places} />
        )
      )}
      <div className="card mx-8 md:mx-20 xl:mx-28 p-8 md:p-12 xl:p-16 bg-primary-bg rounded-xl flex flex-wrap gap-4 justify-center xl:justify-between items-center">
        <div className="text-center xl:text-left text-primary-white">
          <div className="text-xl md:text-3xl font-semibold">
            Still not sure?{' '}
            <span className="text-secondary-btn">Let us help you!</span>
          </div>
          <div className="text-base md:text-lg font-normal mt-3 md:mt-4">
            Our agents can create packages tailored to your interest, contact us
            now!
          </div>
        </div>
        <Link
          href="/contact-us"
          className="w-full md:w-auto text-center text-base text-primary-white font-semibold px-4 py-2 rounded-full bg-primary-btn hover:bg-opacity-90"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
