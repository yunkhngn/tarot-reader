import { HeroUIProvider } from "@heroui/system";
import { Playfair_Display, Mulish } from 'next/font/google';
import '../styles/globals.css';
import Footer from '../components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mulish',
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${playfair.variable} ${mulish.variable}`}>
      <HeroUIProvider>
        <Component {...pageProps} />
        <Footer />
      </HeroUIProvider>
    </div>
  );
}

