import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Country } from '@ffp-web/app/index.types';
import { getCountries } from '@ffp-web/lib/geoApi/data';
import { mailContactUsNotify } from '@ffp-web/lib/mailer/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { ContactUsForm, UseContactUs } from './ContactUs.types';

const useContactUs = (): UseContactUs => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useForm<ContactUsForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      phoneCountry: 'US',
      message: '',
    },
  });

  const onSubmit = (data: ContactUsForm) => {
    _sentNotify(data);
  };

  const _sentNotify = async (form: ContactUsForm) => {
    try {
      setLoading(true);
      const { data, message } = await mailContactUsNotify({
        name: form.name,
        email: form.email,
        phone: form.phone ? `(+${countries.find(e => e.iso2 === form.phoneCountry)?.phonecode})${form.phone}` : undefined,
        message: form.message,
      });

      if (data) {
        toast.success('Thank you for contacting us, our team will contact you within 24 hours.');
        methods.reset();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(false);
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

  useEffect(() => {
    _getCountries();
  }, []);

  return {
    ...methods,
    countries,
    setCountries,
    onSubmit,
    loading,
    setLoading,
  };
};

export default useContactUs;