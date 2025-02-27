import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ProductListCardProps } from '@ffp-web/app/index.types';
import { getProductListCard } from '@ffp-web/lib/product/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { UseProducts } from './Products.types';

const useProducts = (): UseProducts => {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') ?? '';
  const city = searchParams?.get('city') ?? '';

  const [products, setProducts] = useState<ProductListCardProps[]>([]);
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(true);
  const states = {
    products,
    setProducts,
    isLoadingQuery,
    setIsLoadingQuery,
  };

  const _fetchProductList = useCallback(async () => {
    try {
      setIsLoadingQuery(true);
      const cities = city ? [Number(city)] : [];
      const { data, message } = await getProductListCard({ query, cities });
      if (data) {
        setProducts(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setIsLoadingQuery(false);
    }
  }, [city, query]);

  useEffect(() => {
    _fetchProductList();
  }, [_fetchProductList]);

  return {
    ...states,
    query,
  };
};

export default useProducts;