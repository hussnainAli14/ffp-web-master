import { FaBookOpen, FaClipboardCheck, FaClock, FaCommentAlt, FaLink, FaMap, FaTag, FaThList, FaUserTie } from 'react-icons/fa';
import { FaLocationDot, FaUser } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { RxDashboard } from 'react-icons/rx';

import { USER_TYPE } from '../index.types';

export const menus = [
  {
    label: 'Dashboard',
    href: '/dashboard/home',
    icon: <RxDashboard />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Categories',
    href: '/dashboard/categories',
    icon: <FaThList />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Providers',
    href: '/dashboard/providers',
    icon: <FaUserTie />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Listings',
    href: '#',
    icon: <FaBookOpen />,
    access: [USER_TYPE.ADMIN, USER_TYPE.PROVIDER],
    subMenuItems: [
      {
        label: 'Pending Listings',
        href: '/dashboard/listings/pending',
        icon: <FaClock />,
        access: [USER_TYPE.ADMIN, USER_TYPE.PROVIDER],
      },
      {
        label: 'Active Listings',
        href: '/dashboard/listings/active',
        icon: <FaClipboardCheck />,
        access: [USER_TYPE.ADMIN, USER_TYPE.PROVIDER],
      },
    ],
  },
  {
    label: 'Affiliates',
    href: '/dashboard/affiliates',
    icon: <FaLink />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Tags',
    href: '/dashboard/tags',
    icon: <FaTag />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Places',
    href: '#',
    icon: <FaMap />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [
      {
        label: 'Regions',
        href: '/dashboard/places/regions',
        icon: <FaLocationDot />,
        access: [USER_TYPE.ADMIN],
      },
      {
        label: 'Countries',
        href: '/dashboard/places/countries',
        icon: <FaLocationDot />,
        access: [USER_TYPE.ADMIN],
      },
      {
        label: 'Cities',
        href: '/dashboard/places/cities',
        icon: <FaLocationDot />,
        access: [USER_TYPE.ADMIN],
      },
    ],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: <FaUser />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Reviews',
    href: '/dashboard/reviews',
    icon: <FaCommentAlt />,
    access: [USER_TYPE.ADMIN],
    subMenuItems: [],
  },
  {
    label: 'Account',
    href: '/dashboard/account',
    icon: <IoMdSettings />,
    access: [USER_TYPE.ADMIN, USER_TYPE.PROVIDER],
    subMenuItems: [],
  },
];