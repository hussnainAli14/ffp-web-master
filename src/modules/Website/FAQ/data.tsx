import Link from 'next/link';

export const general = [
  {
    title: 'What is FFPTravels?',
    content: 'FFPTravels is a booking platform for traveling fitness enthusiasts worldwide. Offering the ability to book unique adventure and sightseeing activities PLUS your favorite fitness facilities, sports clubs, healthy food outlets and wellness clinics.',
  },
  {
    title: 'How does it work?',
    content: 'Browse activities based on your destination or interests, compare options using reviews and descriptions, and book securely through our platform. You’ll receive a confirmation email with all the details you need for your adventure or activity.',
  },
  {
    title: 'Is FFPTravels available in all countries?',
    content: 'Not yet, but that is the plan.  Currently we offer activities in popular destinations like Dubai, Abu Dhabi, Melbourne, Sydney, Brisbane and Cairns. New locations and providers are added regularly, so check back for updates.',
  },
  {
    title: 'Are there membership or registration fees?',
    content: 'Registration is free for all providers and travelers. Premium plans are available for travelers that wish to access exclusive discounts, perks or exclusive events.',
  },
];

export const booking = [
  {
    title: 'How do I find activities or tours in my destination?',
    content: 'Use our search bar to enter your desired activity or destination. Filters will make it easy to refine your search from there.',
  },
  {
    title: 'What types of activities can I book?',
    content: 'Activities include outdoor adventures, cultural experiences, guided tours, some wellness and fitness sessions, professional services and family-friendly options. From snorkeling and hiking to yoga retreats, there’s something for everyone.',
  },
  {
    title: 'How far in advance should I book?',
    content: 'To secure your spot, we recommend booking at least 7 days in advance, especially during peak travel seasons. Some last-minute options are also available.',
  },
  {
    title: 'Can I customize my booking?',
    content: 'Many providers offer customizable packages. Look for the \'customizable\' tag on activity pages or talk with one of our FFPTravel representatives to discuss your preferences.',
  },
];

export const payments = [
  {
    title: 'What payment methods are accepted?',
    content: 'We accept major credit cards and local debit cards.',
  },
  {
    title: 'Is my payment secure?',
    content: 'Yes, we use industry-standard encryption to ensure your payment details are protected. Your privacy and security are our top priorities.',
  },
  {
    title: 'What is your refund or cancellation policy?',
    content: 'Refund policies vary by provider. Most activities allow free cancellation up to 48 hours before the activity date. Specific policies are detailed on each activity page.',
  },
  {
    title: 'Will I receive a confirmation email or receipt?',
    content: 'Yes, after booking, you will receive a confirmation email with your receipt, booking details, and contact information for the provider.',
  },
];

export const support = [
  {
    title: 'How can I contact customer support?',
    content: <span>
      Our support team is available via live chat & email at support@ffptravels.com. Visit our <Link href={'/contact-us'} className='text-primary-btn font-semibold'>Contact Us</Link> page for more details.
      </span>,
  },
  {
    title: 'What should I do if I encounter issues with my booking?',
    content: 'If you experience a problem, contact us immediately through our support channels. We’ll work with the provider to resolve the issue as quickly as possible.',
  },
];

export const providers = [
  {
    title: 'How are activity providers verified?',
    content: 'We partner with vetted providers that must provide legal documentation during registration and who meet our safety and quality standards. Reviews and ratings from previous customers help ensure providers are trustworthy and reliable.',
  },
  {
    title: 'Can I leave a review for an activity?',
    content: 'Absolutely! After completing your booking, you’ll receive an email inviting you to leave a review. Your feedback helps other travelers and improves the services offered.',
  },
];


export const accesibility = [
  {
    title: 'Are your activities accessible for people with disabilities?',
    content: 'Many activities are accessible, but availability depends on the provider. Please ensure you check the activity details for specific information.',
  },
  {
    title: 'Do you offer activities for families or children?',
    content: 'Yes, we have a range of family-friendly options. Look for activities marked as suitable for children or families.',
  },
];

export const safety = [
  {
    title: 'What safety measures are in place for activities?',
    content: 'Providers adhere to local safety regulations and guidelines. Activity descriptions include details about safety measures, such as trained guides, equipment standards, and emergency protocols.',
  },
  {
    title: 'What happens in case of bad weather or cancellations by providers?',
    content: 'In the event of bad weather or provider cancellations, you’ll be notified immediately. Most providers offer full refunds or alternative dates.',
  },
];
