import { buildSearchParams } from '@ffp-web/utils/link.utils';
import { getToken } from '@ffp-web/utils/storage.utils';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiVersion = `${baseUrl}/api/v1`;
const headers: HeadersInit = {
  'Authorization': `Bearer ${getToken()}`,
};
const path = {
  categories: `${apiVersion}/categories`,
};

const getCategories = async (params: {
  showHidden?: boolean,
  withCategories?: boolean,
  withCategoriesCount?: boolean,
}) => {
  const urlParams = buildSearchParams(params);

  return await fetch(
    `${path.categories}?${urlParams}`,
    {
      method: 'GET',
      headers,
    }
  );
};

export const queryApi = {
  getCategories,
};