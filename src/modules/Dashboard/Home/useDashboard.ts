import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ListingByCategory, PlaceCityProps, PlaceCountryProps, USER_TYPE, UserByCity, UserByCountry } from '@ffp-web/app/index.types';
import { getListingByCategory, getUserByCity, getUserByCountry } from '@ffp-web/lib/dashboard/data';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { FilterStates } from './Home.types';

const defaultFilter: FilterStates = {
  selectedCountry: [],
  selectedCity: [],
  openModalCountry: false,
  openModalCity: false,
  loading: true,
};

const useDashboard = (props: {
  limit?: number,
  fetchCountry?: boolean,
  fetchCity?: boolean,
  fetchListing?: boolean,
  fetchProviderByCountry?: boolean,
  fectProviderByCity?: boolean,
  fetchUserByCountry?: boolean,
  fectUserByCity?: boolean,
}) => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const countryId = params?.id;
  const countryName = searchParams?.get('name') ?? '';
  const [countries, setCountries] = useState<PlaceCountryProps[]>([]);
  const [cities, setCities] = useState<PlaceCityProps[]>([]);
  const [filterListing, setFilterListing] = useState<FilterStates>(defaultFilter);
  const [filterProvider, setFilterProvider] = useState<FilterStates>(defaultFilter);
  const [filterUser, setFilterUser] = useState<FilterStates>(defaultFilter);
  const [listings, setListings] = useState<ListingByCategory>({
    listings: [],
    total: 0,
  });
  const [providersByCountry, setProvidersByCountry] = useState<UserByCountry>({
    summary: [],
    countries: [],
  });
  const [providersByCity, setProvidersByCity] = useState<UserByCity>({
    cities: [],
  });
  const [usersByCountry, setUsersByCountry] = useState<UserByCountry>({
    summary: [],
    countries: [],
  });
  const [usersByCity, setUsersByCity] = useState<UserByCity>({
    cities: [],
  });

  const states = {
    countries,
    setCountries,
    cities,
    setCities,
    filterListing,
    setFilterListing,
    filterProvider,
    setFilterProvider,
    listings,
    setListings,
    providersByCountry,
    setProvidersByCountry,
    providersByCity,
    setProvidersByCity,
    filterUser,
    setFilterUser,
    usersByCountry,
    setUsersByCountry,
    usersByCity,
    setUsersByCity,
  };

  const handleCloseListingCountry = (item?: number[]) => {
    if (item) {
      setFilterListing(prev => ({
        ...prev,
        selectedCountry: item,
        selectedCity: [],
        openModalCountry: false,
      }));
    } else {
      setFilterListing(prev => ({
        ...prev,
        openModalCountry: false,
      }));
    }
  };

  const handleCloseListingCity = (item?: number[]) => {
    if (item) {
      setFilterListing(prev => ({
        ...prev,
        selectedCity: item,
        openModalCity: false,
      }));
    } else {
      setFilterListing(prev => ({
        ...prev,
        openModalCity: false,
      }));
    }
  };

  const handleCloseProviderCountry = (item?: number[]) => {
    if (item) {
      setFilterProvider(prev => ({
        ...prev,
        selectedCountry: item,
        selectedCity: [],
        openModalCountry: false,
      }));
    } else {
      setFilterProvider(prev => ({
        ...prev,
        openModalCountry: false,
      }));
    }
  };

  const handleCloseProviderCity = (item?: number[]) => {
    if (item) {
      setFilterProvider(prev => ({
        ...prev,
        selectedCity: item,
        openModalCity: false,
      }));
    } else {
      setFilterProvider(prev => ({
        ...prev,
        openModalCity: false,
      }));
    }
  };

  const handleCloseUserCountry = (item?: number[]) => {
    if (item) {
      setFilterUser(prev => ({
        ...prev,
        selectedCountry: item,
        selectedCity: [],
        openModalCountry: false,
      }));
    } else {
      setFilterUser(prev => ({
        ...prev,
        openModalCountry: false,
      }));
    }
  };

  const handleCloseUserCity = (item?: number[]) => {
    if (item) {
      setFilterUser(prev => ({
        ...prev,
        selectedCity: item,
        openModalCity: false,
      }));
    } else {
      setFilterUser(prev => ({
        ...prev,
        openModalCity: false,
      }));
    }
  };

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

  const _getListingByCategory = useCallback(async () => {
    try {
      setFilterListing(prev => ({ ...prev, loading: true }));
      const { data, message } = await getListingByCategory({
        countries: filterListing.selectedCountry,
        cities: filterListing.selectedCity,
        limit: props?.limit,
      });
      if (data) {
        setListings(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setFilterListing(prev => ({ ...prev, loading: false }));
    }
  }, [filterListing.selectedCity, filterListing.selectedCountry, props?.limit]);

  const _getProviderByCountry = useCallback(async () => {
    try {
      setFilterProvider(prev => ({ ...prev, loading: true }));
      const { data, message } = await getUserByCountry({
        type: USER_TYPE.PROVIDER,
        countries: filterProvider.selectedCountry,
        limit: props?.limit,
      });
      if (data) {
        setProvidersByCountry(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setFilterProvider(prev => ({ ...prev, loading: false }));
    }
  }, [filterProvider.selectedCountry, props?.limit]);

  const _getProviderByCity = useCallback(async (countryId: number) => {
    try {
      setFilterProvider(prev => ({ ...prev, loading: true }));
      const { data, message } = await getUserByCity({
        type: USER_TYPE.PROVIDER,
        countries: [countryId],
        cities: filterProvider.selectedCity,
      });
      if (data) {
        setProvidersByCity(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setFilterProvider(prev => ({ ...prev, loading: false }));
    }
  }, [filterProvider.selectedCity]);

  const _getUserByCountry = useCallback(async () => {
    try {
      setFilterUser(prev => ({ ...prev, loading: true }));
      const { data, message } = await getUserByCountry({
        type: USER_TYPE.USER,
        countries: filterUser.selectedCountry,
        limit: props?.limit,
      });
      if (data) {
        setUsersByCountry(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setFilterUser(prev => ({ ...prev, loading: false }));
    }
  }, [filterUser.selectedCountry, props?.limit]);

  const _getUserByCity = useCallback(async (countryId: number) => {
    try {
      setFilterUser(prev => ({ ...prev, loading: true }));
      const { data, message } = await getUserByCity({
        type: USER_TYPE.USER,
        countries: [countryId],
        cities: filterUser.selectedCity,
      });
      if (data) {
        setUsersByCity(data);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setFilterUser(prev => ({ ...prev, loading: false }));
    }
  }, [filterUser.selectedCity]);

  useEffect(() => {
    if (props.fetchCountry) _getCountries();
  }, [props.fetchCountry]);

  useEffect(() => {
    if (filterListing.selectedCountry[0] && props.fetchCity) _getCitiesByCountry(filterListing.selectedCountry[0]);
  }, [_getCitiesByCountry, filterListing.selectedCountry, props.fetchCity]);

  useEffect(() => {
    if (countryId && props.fetchCity) _getCitiesByCountry(Number(countryId));
  }, [_getCitiesByCountry, countryId, props.fetchCity]);

  useEffect(() => {
    if (props.fetchListing) _getListingByCategory();
  }, [_getListingByCategory, props.fetchListing]);

  useEffect(() => {
    if (props.fetchProviderByCountry) _getProviderByCountry();
  }, [_getProviderByCountry, props.fetchProviderByCountry]);

  useEffect(() => {
    if (props.fectProviderByCity && countryId) _getProviderByCity(Number(countryId));
  }, [_getProviderByCity, countryId, props.fectProviderByCity]);

  useEffect(() => {
    if (props.fetchUserByCountry) _getUserByCountry();
  }, [_getUserByCountry, props.fetchUserByCountry]);

  useEffect(() => {
    if (props.fectUserByCity && countryId) _getUserByCity(Number(countryId));
  }, [_getUserByCity, countryId, props.fectUserByCity]);

  return {
    ...states,
    countryId,
    countryName,
    handleCloseListingCountry,
    handleCloseListingCity,
    handleCloseProviderCountry,
    handleCloseProviderCity,
    handleCloseUserCountry,
    handleCloseUserCity,
  };
};

export default useDashboard;