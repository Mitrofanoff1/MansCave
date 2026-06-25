import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://xn----7sbcbut1ajfegice8bxe.xn--p1ai'),
  title: "Барбершоп Men's Cave в Мурино",
  description: "Мужские стрижки любой сложности без поездок в центр. Оформление бороды и уход. Только опытные барберы. Ежедневно с 11:00 до 22:00. Онлайн-запись.",
  keywords: "барбершоп Мурино, мужская стрижка Мурино, стрижка бороды, барбершоп Бугры, Men's Cave, мужская парикмахерская",
  openGraph: {
    title: "Барбершоп Men's Cave в Мурино",
    description: "Мужские стрижки любой сложности без поездок в центр. Оформление бороды и уход. Только опытные барберы. Онлайн-запись.",
    url: 'https://xn----7sbcbut1ajfegice8bxe.xn--p1ai',
    siteName: "Men's Cave Барбершоп",
    images: [{ url: '/og-about.jpg', width: 1200, height: 630, alt: "Барбершоп Men's Cave в Мурино" }],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Барбершоп Men's Cave в Мурино",
    description: "Мужские стрижки любой сложности без поездок в центр. Оформление бороды и уход. Только опытные барберы. Онлайн-запись.",
    images: ['/og-about.jpg'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    yandex: '6255f0c4748388ce',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Men's Cave — Барбершоп в Мурино",
  description: "Мужские стрижки любой сложности, оформление бороды и уход. Только опытные барберы. Онлайн-запись.",
  image: "https://xn----7sbcbut1ajfegice8bxe.xn--p1ai/og-about.jpg",
  url: "https://xn----7sbcbut1ajfegice8bxe.xn--p1ai",
  telephone: "+79219998862",
  priceRange: "₽₽",
  currenciesAccepted: "RUB",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Воронцовский бульвар, 20",
    addressLocality: "Мурино",
    addressRegion: "Ленинградская область",
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 60.067465,
    longitude: 30.429488,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "11:00",
      closes: "22:00",
    },
  ],
  sameAs: [
    "https://vk.com/menscave_barbershop_spb",
    "https://t.me/menscavespb",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
