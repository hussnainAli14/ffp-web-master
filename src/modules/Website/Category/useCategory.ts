import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Pagination, ProductListCardProps } from '@ffp-web/app/index.types';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { getProductListCard } from '@ffp-web/lib/product/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { FilterData, FilterStates, LoadingStates, ModalStates, UseCategory } from './Category.types';

const defaultFilterData: FilterData = {
  countries: [],
  cities: [],
};

const defaultFilterStates: FilterStates = {
  selectedCountry: [],
  selectedCity: [],
};

const defaultModalStates: ModalStates = {
  filterCountry: false,
  filterCity: false,
};

const useCategory = (): UseCategory => {
  const params = useParams<{ id: string }>();
  const searcParams = useSearchParams();
  const categoryId = params?.id ?? '';
  const categoryName = searcParams?.get('categoryName') ?? '';
  const subCategoryId = searcParams?.get('subCategoryId') ?? '';
  const subCategoryName = searcParams?.get('subCategoryName') ?? '';
  const cityId = searcParams?.get('cityId') ?? '';
  const cityName = searcParams?.get('cityName') ?? '';

  const [popularProducts, setPopularProducts] = useState<ProductListCardProps[]>([]);
  const [products, setProducts] = useState<ProductListCardProps[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ limit: 12, offset: 0 });
  const [loading, setLoading] = useState<LoadingStates>({ products: true });
  const [filterData, setFilterData] = useState<FilterData>(defaultFilterData);
  const [filterStates, setFilterStates] = useState<FilterStates>(defaultFilterStates);
  const [openModal, setOpenModal] = useState<ModalStates>(defaultModalStates);

  const states = {
    categoryId,
    categoryName,
    subCategoryId,
    subCategoryName,
    cityId,
    cityName,
    popularProducts,
    setPopularProducts,
    products,
    setProducts,
    pagination,
    setPagination,
    loading,
    setLoading,
    filterData,
    setFilterData,
    filterStates,
    setFilterStates,
    openModal,
    setOpenModal,
  };

  const handleCloseFilterCountry = (item?: number[]) => {
    if (item) {
      setFilterStates(prev => ({
        ...prev,
        selectedCountry: item,
        selectedCity: [],
      }));
    }
    setOpenModal(prev => ({ ...prev, filterCountry: false }));
  };

  const handleCloseFilterCity = (item?: number[]) => {
    if (item) {
      setFilterStates(prev => ({
        ...prev,
        selectedCity: item,
      }));
    }
    setOpenModal(prev => ({ ...prev, filterCity: false }));
  };

  const _fetchProductList = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const { data, message } = await getProductListCard({
        categoryId,
        subCategoryId,
        countries: filterStates.selectedCountry,
        cities: filterStates.selectedCity,
      });
      if (data) {
        const popular = data.slice(0, 8);
        const more = data.slice(8);
        setPopularProducts(popular);
        setProducts(more);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, [categoryId, filterStates.selectedCity, filterStates.selectedCountry, subCategoryId]);

  const _getCountries = async () => {
    try {
      const { data, message } = await getCountries();
      if (data) {
        return data;
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCities = async () => {
    try {
      const { data, message } = await getCities();
      if (data) {
        return data;
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _fetchAllData = useCallback(async () => {
    try {
      const [countries, cities] = await Promise.all([
        _getCountries(),
        _getCities(),
      ]);

      setFilterData(prev => ({
        ...prev,
        countries: countries ?? [],
        cities: cities ?? [],
      }));
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      _fetchProductList();
    }
  }, [_fetchProductList, categoryId]);

  useEffect(() => {
    if (cityId) {
      setFilterStates(prev => ({ ...prev, selectedCity: [Number(cityId)] }));
    }
  }, [cityId]);

  useEffect(() => {
    _fetchAllData();
  }, [_fetchAllData]);

  return {
    ...states,
    handleCloseFilterCountry,
    handleCloseFilterCity,
  };
};

export default useCategory;