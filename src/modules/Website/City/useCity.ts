import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Pagination, ProductListCardProps } from '@ffp-web/app/index.types';
import { getProductListCard } from '@ffp-web/lib/product/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { LoadingStates, UseCity } from './City.types';

const useCity = (): UseCity => {
  const params = useParams<{ id: string }>();
  const searcParams = useSearchParams();
  const cityId = params?.id ?? '';
  const cityName = searcParams?.get('city') ?? '';

  const [popularProducts, setPopularProducts] = useState<ProductListCardProps[]>([]);
  const [products, setProducts] = useState<ProductListCardProps[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ limit: 12, offset: 0 });
  const [loading, setLoading] = useState<LoadingStates>({ popularProduct: true, moreProduct: true });

  
  const states = {
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
    categories,
  };

  const _fetchPopularProducts = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, popularProduct: true }));
      if (cityId) {
        const { data, message } = await getProductListCard({
          cities: [Number(cityId)],
          pagination: { limit: 8, offset: 0 },
        });
        if (data) {
          setPopularProducts(data);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, popularProduct: false }));
    }
  }, [cityId]);

  const _fetchProductList = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, moreProduct: true }));
      if (cityId) {
        const { data, message } = await getProductListCard({
          cities: [Number(cityId)],
          pagination: { offset: 8 },
        });
        if (data) {
          setProducts(data);
          setCategories(data[0].categoryList);
        } else {
          toast.error(message);
        }
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, moreProduct: false }));
    }
  }, [cityId]);

  useEffect(() => {
    if (cityId) {
      _fetchPopularProducts();
      _fetchProductList();
    }
  }, [_fetchPopularProducts, _fetchProductList, cityId]);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => window.scrollTo(0, 0);
  }, []);

  return {
    ...states,
  };
};

export default useCity;