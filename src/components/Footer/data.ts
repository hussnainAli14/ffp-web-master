import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';

import { Resource, Sosmed } from './Footer.types';

export const sosmed: Sosmed[] = [
  {
    key: 'x',
    icon: FaXTwitter,
    href: 'https://x.com/ffptravels',
  },
  {
    key: 'instagram',
    icon: FaInstagram,
    href: 'https://www.instagram.com/ffptravels/',
  },
  {
    key: 'facebook',
    icon: FaFacebook,
    href: 'https://www.facebook.com/ffptravels',
  },
  {
    key: 'tiktok',
    icon: FaTiktok,
    href: 'https://www.tiktok.com/@ffptravels',
  },
  {
    key: 'youtube',
    icon: FaYoutube,
    href: 'https://www.youtube.com/@ffptravels',
  },
];
export const resources: Resource[] = [
  {
    key: 'faq',
    name: 'FAQ\'s',
    href: '/frequently-asked-questions',
  },
  {
    key: 'contact',
    name: 'Contact Us',
    href: '/contact-us',
  },
  {
    key: 'about',
    name: 'About Us',
    href: '/about-us',
  },
  // {
  //   key: 'affiliate',
  //   name: 'Become Affiliate',
  //   href: '/affiliate',
  // },
  {
    key: 'advertising',
    name: 'Advertising',
    href: '/advertising',
  },
  {
    key: 'register-user',
    name: 'Register as User',
    href: '/user/register',
    target: '_blank',
  },
  {
    key: 'profile',
    name: 'My Profile',
    href: '/user/detail?menu=3',
  },
];

export const providers: Resource[] = [
  {
    key: 'provider',
    name: 'Become A Provider',
    href: '/become-a-provider',
  },
  {
    key: 'login',
    name: 'Login as Provider',
    href: '/dashboard/login',
    target: '_blank',
  },
];