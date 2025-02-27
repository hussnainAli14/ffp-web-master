import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ProductListCardProps, STORAGE_KEY } from '@ffp-web/app/index.types';
import { getListBookmarkProduct, removeFromBookmark } from '@ffp-web/lib/bookmark/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getToken, setStorage } from '@ffp-web/utils/storage.utils';

import { FilterBookmark, Props, UseBookmark } from '../User.types';

const defaultFilterBookmark: FilterBookmark = {
  selectedCountry: [],
  selectedCity: [],
  selectedCategory: [],
  selectedSubCategory: [],
  query: '',
};

const useBookmark = ({ setIsLoading, setOpenModal, userData }: Partial<Props>): UseBookmark => {
  const [products, setProducts] = useState<ProductListCardProps[]>([]);
  const [selectedBookmarkProduct, setSelectedBookmarkProduct] = useState<{ productId: string, productName: string }>({ productId: '', productName: '' });
  const [filterBookmark, setFilterBookmark] = useState<FilterBookmark>(defaultFilterBookmark);

  const states = {
    products,
    setProducts,
    selectedBookmarkProduct,
    setSelectedBookmarkProduct,
    filterBookmark,
    setFilterBookmark,
  };

  const handleRemoveBookmark = (productId: string, productName: string) => {
    setOpenModal?.(prev => ({ ...prev, removeBookmark: true }));
    setSelectedBookmarkProduct({ productId, productName });
  };

  const onRemoveBookmark = () => {
    setOpenModal?.(prev => ({ ...prev, removeBookmark: false }));
    _removeBookmark();
  };

  const handleCloseFilterCountry = (item?: number[]) => {
    if (item) {
      setFilterBookmark(prev => ({
        ...prev,
        selectedCountry: item,
        selectedCity: [],
      }));
    }
    setOpenModal?.(prev => ({ ...prev, filterCountry: false }));
  };

  const handleCloseFilterCity = (item?: number[]) => {
    if (item) {
      setFilterBookmark(prev => ({
        ...prev,
        selectedCity: item,
      }));
    }
    setOpenModal?.(prev => ({ ...prev, filterCity: false }));
  };

  const handleCloseFilterCategory = (item?: string[]) => {
    if (item) {
      setFilterBookmark(prev => ({
        ...prev,
        selectedCategory: item,
        selectedSubCategory: [],
      }));
    }
    setOpenModal?.(prev => ({ ...prev, filterCategory: false }));
  };

  const handleCloseFilterSubCategory = (item?: string[]) => {
    if (item) {
      setFilterBookmark(prev => ({
        ...prev,
        selectedSubCategory: item,
      }));
    }
    setOpenModal?.(prev => ({ ...prev, filterSubCategory: false }));
  };

  const _removeBookmark = async () => {
    try {
      setIsLoading?.(prev => ({ ...prev, removeBookmark: true }));
      const { data, message } = await removeFromBookmark({ productId: selectedBookmarkProduct.productId, token: getToken() });
      if (data) {
        const bookmarks = userData?.bookmarks.filter(e => e !== selectedBookmarkProduct.productId) ?? [];
        setStorage(STORAGE_KEY.USER, { ...userData, bookmarks });
        setProducts(prev => prev.filter(item => item.productId !== selectedBookmarkProduct.productId));
        toast.success(`“${selectedBookmarkProduct.productName}” successfully removed from your Must Do`);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading?.(prev => ({ ...prev, removeBookmark: false }));
      setSelectedBookmarkProduct({ productId: '', productName: '' });
    }
  };

  const _fetchProducts = useCallback(async () => {
    try {
      setIsLoading?.(prev => ({ ...prev, bookmark: true }));
      const { data, message } = await getListBookmarkProduct({
        countries: filterBookmark.selectedCountry,
        cities: filterBookmark.selectedCity,
        categoryIds: filterBookmark.selectedCategory,
        subCategoryIds: filterBookmark.selectedSubCategory,
        query: filterBookmark.query,
      }, getToken());
      if (data) {
        setProducts(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoading?.(prev => ({ ...prev, bookmark: false }));
    }
  }, [filterBookmark.query, filterBookmark.selectedCategory, filterBookmark.selectedCity, filterBookmark.selectedCountry, filterBookmark.selectedSubCategory, setIsLoading]);

  useEffect(() => {
    _fetchProducts();
  }, [_fetchProducts]);

  return {
    ...states,
    handleRemoveBookmark,
    onRemoveBookmark,
    handleCloseFilterCountry,
    handleCloseFilterCity,
    handleCloseFilterCategory,
    handleCloseFilterSubCategory,
  };
};

export default useBookmark;