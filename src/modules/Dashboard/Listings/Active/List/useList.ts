import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { PlaceCityProps, PlaceCountryProps, PRODUCT_STATUS, ProductListProps, STORAGE_KEY, USER_TYPE } from '@ffp-web/app/index.types';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { getListProductByStatus, removeProduct, unlistProduct } from '@ffp-web/lib/product/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getStorage, getToken, hasAccess } from '@ffp-web/utils/storage.utils';

import { UseList } from './List.types';

const useList = (): UseList => {
  const userData = getStorage(STORAGE_KEY.USER);
  const [listProduct, setListProduct] = useState<ProductListProps[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductListProps>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalUnlist, setOpenModalUnlist] = useState<boolean>(false);
  const [countries, setCountries] = useState<PlaceCountryProps[]>([]);
  const [listingCountry, setListingCountry] = useState<number[]>([]);
  const [cities, setCities] = useState<PlaceCityProps[]>([]);
  const [listingCity, setListingCity] = useState<number[]>([]);
  const [isOpenFilterCountryListing, setIsOpenFilterCountryListing] = useState<boolean>(false);
  const [isopenFilterCityListing, setIsopenFilterCityListing] = useState<boolean>(false);
  const states = {
    listProduct,
    setListProduct,
    isLoadingList,
    setIsLoadingList,
    selectedProduct,
    setSelectedProduct,
    openModalDelete,
    setOpenModalDelete,
    openModalUnlist,
    setOpenModalUnlist,
    countries,
    setCountries,
    listingCountry,
    setListingCountry,
    cities,
    setCities,
    listingCity,
    setListingCity,
    isOpenFilterCountryListing,
    setIsOpenFilterCountryListing,
    isopenFilterCityListing,
    setIsopenFilterCityListing,
  };

  const handleDelete = (row: ProductListProps) => {
    setSelectedProduct(row);
    setOpenModalDelete(true);
  };

  const handleUnlist = (row: ProductListProps) => {
    setSelectedProduct(row);
    setOpenModalUnlist(true);
  };

  const onDelete = () => {
    _removeProduct();
    setOpenModalDelete(false);
  };

  const onUnlist = () => {
    _unlistProduct();
    setOpenModalUnlist(false);
  };

  const handleCloseListingCountry = (item?: number[]) => {
    if (item) {
      setListingCountry(item);
      setListingCity([]);
    }

    setIsOpenFilterCountryListing(false);
  };

  const handleCloseListingCity = (item?: number[]) => {
    if (item) {
      setListingCity(item);
    }

    setIsopenFilterCityListing(false);
  };

  const _removeProduct = async () => {
    try {
      setIsLoadingList(true);
      if (selectedProduct?.productId) {
        const { data, message } = await removeProduct({ productId: selectedProduct?.productId }, getToken());
        if (data) {
          toast.success(`"${selectedProduct?.productName}" succesfully deleted`);
          setSelectedProduct(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListProduct();
    }
  };

  const _unlistProduct = async () => {
    try {
      setIsLoadingList(true);
      if (selectedProduct?.productId) {
        const { data, message } = await unlistProduct({ productId: selectedProduct?.productId }, getToken());
        if (data) {
          toast.success(`"${selectedProduct?.productName}" succesfully unlisted`);
          setSelectedProduct(undefined);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      _getListProduct();
    }
  };

  const _getListProduct = useCallback(async () => {
    try {
      setIsLoadingList(true);
      const { data, message } = await getListProductByStatus({
        status: PRODUCT_STATUS.ACTIVE,
        provider: hasAccess(USER_TYPE.PROVIDER) ? userData?.id : undefined,
        countries: (listingCountry.length > 0 && listingCountry.length !== countries.length) ? listingCountry : undefined,
        cities: (listingCity.length > 0 && listingCity.length !== cities.length) ? listingCity : undefined,
      });
      if (data) {
        setListProduct(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingList(false);
    }
  }, [cities.length, countries.length, listingCity, listingCountry, userData?.id]);

  const _getCountries = async () => {
    try {
      const { data, message } = await getCountries();
      if (data) {
        setCountries(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCitiesByCountry = useCallback(async (countryId: number) => {
    try {
      const { data, message } = await getCities({ countryId });
      if (data) {
        setCities(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, []);

  useEffect(() => {
    _getCountries();
  }, []);

  useEffect(() => {
    if (listingCountry[0]) _getCitiesByCountry(listingCountry[0]);
  }, [_getCitiesByCountry, listingCountry]);

  useEffect(() => {
    _getListProduct();
  }, [_getListProduct]);

  return {
    ...states,
    handleDelete,
    onDelete,
    handleUnlist,
    onUnlist,
    handleCloseListingCountry,
    handleCloseListingCity,
  };
};

export default useList;