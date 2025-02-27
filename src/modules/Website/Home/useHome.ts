'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CategoryRes, PlaceHomeCityProps, ProductListCardProps } from '@ffp-web/app/index.types';
import { getCategories } from '@ffp-web/lib/category/data';
import { getHomeCities } from '@ffp-web/lib/place/data';
import { getProductListCard } from '@ffp-web/lib/product/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { LoadingStates, UseHome } from './Home.types';


const useHome = (): UseHome => {
  const [loading, setLoading] = useState<LoadingStates>({ category: false, product: false, places: false });
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Record<string, ProductListCardProps[]>>({});
  const [places, setPlaces] = useState<PlaceHomeCityProps[]>([]);

  const states = {
    loading,
    setLoading,
    categories,
    setCategories,
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    setProducts,
    places,
    setPlaces,
  };

  const fetchProducts = useCallback(async (categoryId: string) => {
    try {
      if (products[categoryId]?.length > 0) return;
      setLoading(prev => ({ ...prev, product: true }));
      const { data, message } = await getProductListCard({
        categoryId,
        pagination: { limit: 8, offset: 0 },
      });
      if (data) {
        setProducts(prev => ({ ...prev, [categoryId]: data }));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, product: false }));
    }
  }, [products]);

  const _fetchCategories = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, category: true }));
      if (categories.length > 0) return;
      const { data, message } = await getCategories();
      if (data) {
        setCategories(data);
        setSelectedCategoryId(data[0].categoryId);
        fetchProducts(data[0].categoryId);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }
  }, [categories.length, fetchProducts]);

  const _fetchPlaces = async () => {
    try {
      setLoading(prev => ({ ...prev, places: true }));
      const { data, message } = await getHomeCities();
      if (data) {
        setPlaces(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, places: false }));
    }
  };

  useEffect(() => {
    _fetchCategories();
  }, [_fetchCategories]);

  useEffect(() => {
    _fetchPlaces();
  }, []);

  return {
    ...states,
    fetchProducts,
  };
};

export default useHome;