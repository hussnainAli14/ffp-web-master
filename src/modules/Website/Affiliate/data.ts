import { BiSolidBriefcaseAlt } from 'react-icons/bi';
import { BsLaptopFill } from 'react-icons/bs';
import { FaStar, FaUserGroup } from 'react-icons/fa6';
import { PiLaptop, PiMoneyWavy, PiMoneyWavyFill } from 'react-icons/pi';
import { TbPlaneTilt } from 'react-icons/tb';


export const benefits = [
  {
    title: 'Earn commission from sales',
    subtitle: 'Get rewarded for every booking made through your referrals. Our program offers competitive commission rates, with the potential to earn up to 20% per sale.',
    icon: PiMoneyWavy,
  },
  {
    title: 'Sell online, work from anywhere',
    subtitle: 'As an affiliate, you can promote FFP products and services online and generate sales from anywhere in the world—perfect for those who crave a flexible, location-independent lifestyle.',
    icon: PiLaptop,
  },
  {
    title: 'Combine travel with work',
    subtitle: 'Take advantage of the unique opportunity to travel while you work, sharing your experiences with others and introducing them to exciting travel options.',
    icon: TbPlaneTilt,
  },
];

export const roles = [
  {
    role: 'Affiliate',
    details: [
      {
        title: 'Role',
        content: 'Act as an FFP agent and sell travel bookings directly to your network.',
        icon: BiSolidBriefcaseAlt,
      },
      {
        title: 'Earnings',
        content: 'Earn 5% commission per fulfilled booking. $1,000 in commission = $500 bonus.',
        icon: PiMoneyWavyFill,
      },
      {
        title: 'Flexibility',
        content: 'No specific travel requirements; you can work entirely online from anywhere.',
        icon: BsLaptopFill,
      },
    ],
  },
  {
    role: 'Ambassador',
    details: [
      {
        title: 'Required',
        content: 'Earn $2,500 in commission from sales.',
        icon: BiSolidBriefcaseAlt,
      },
      {
        title: 'Earnings',
        content: 'Earn 10% commission per fulfilled booking.',
        icon: PiMoneyWavyFill,
      },
      {
        title: 'Perks',
        content: 'Gain free access to selected tours or facilities to experience what you’re promoting firsthand.',
        icon: FaStar,
      },
    ],
  },
  {
    role: 'Agency',
    details: [
      {
        title: 'Role',
        content: 'Lead and build a team of Agents and Promoters.',
        icon: BiSolidBriefcaseAlt,
      },
      {
        title: 'Earnings',
        content: 'Earn commissions on your own sales as well as from the activities of your team, maximizing your income potential.',
        icon: PiMoneyWavyFill,
      },
      {
        title: 'Responsibilities',
        content: 'As a manager, you’ll create a network of affiliates, empowering your team to generate sales and grow their reach.',
        icon: FaUserGroup,
      },
    ],
  },
];

export const affiliateType = [
  {
    value: 'Affiliate',
    label: 'Affiliate',
  },
  {
    value: 'Ambassador',
    label: 'Ambassador',
  },
  {
    value: 'Manager',
    label: 'Manager',
  },
];