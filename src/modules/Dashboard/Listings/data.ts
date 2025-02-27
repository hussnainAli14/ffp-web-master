import { CONTENT_TYPE, CTA_TYPE, SelectOption } from '@ffp-web/app/index.types';

export const quickDetailsOption: SelectOption[] = [
  {
    label: 'Location',
    value: 'Location',
  },
  {
    label: 'Duration',
    value: 'Duration',
  },
  {
    label: 'Price',
    value: 'Price',
  },
  {
    label: 'Intensity',
    value: 'Intensity',
  },
  {
    label: 'Zone',
    value: 'Zone',
  },
  {
    label: 'Working Hours',
    value: 'Working Hours',
  },
  {
    label: 'Time',
    value: 'Time',
  },
  {
    label: 'Age',
    value: 'Age',
  },
  {
    label: 'Type',
    value: 'Type',
  },
  {
    label: 'Qualified in',
    value: 'Qualified in',
  },
  {
    label: 'Date',
    value: 'Date',
  },
  {
    label: 'Distance',
    value: 'Distance',
  },
];

export const contentOption: SelectOption[] = [
  {
    label: 'Free text',
    value: CONTENT_TYPE.TEXT,
  },
  {
    label: 'Bullet points',
    value: CONTENT_TYPE.LIST,
  },
];

export const ctaOption: SelectOption[] = [
  {
    label: 'Book Now',
    value: CTA_TYPE.BOOK,
  },
  {
    label: 'Contact Us',
    value: CTA_TYPE.CONTACT,
  },
  {
    label: 'View Map',
    value: CTA_TYPE.MAP,
  },
  {
    label: 'Register',
    value: CTA_TYPE.REGISTER,
  },
  {
    label: 'Contact Me',
    value: CTA_TYPE.CONTACT_ME,
  },
];

export const filteredCtaOption = (params: { isInclude: boolean, keys: CTA_TYPE[] }[]): SelectOption[] => {
  const excludes: CTA_TYPE[] = [];

  params.forEach(e => {
    if (!e.isInclude) {
      excludes.push(...e.keys);
    }
  });

  return ctaOption.filter(e => !excludes.some(i => e.value === i));
};