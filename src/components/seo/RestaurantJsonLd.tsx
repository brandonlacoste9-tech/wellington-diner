import { house, hoursRows, shop } from '@/content/house';

const dayMap: Record<string, string> = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
};

export function RestaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: house.name,
    url: house.liveSite,
    telephone: '+1-613-798-7800',
    email: house.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1385 Wellington Street West',
      addressLocality: 'Ottawa',
      addressRegion: 'ON',
      postalCode: shop.postal,
      addressCountry: 'CA',
    },
    openingHoursSpecification: hoursRows.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayMap[row.day.en]}`,
      opens: '08:00',
      closes: '21:00',
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
