import '@/assets/sass/index.scss';
import { CheckoutModal } from '@/components/CheckoutModal/CheckoutModal';
import ProductModal from '@/components/ProductModal/ProductModal';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { CheckoutContextProvider } from '@/contexts/CheckoutContext';
import { FavoritesContextProvider } from '@/contexts/FavoritesContext';
import { GlobalContextProvider } from '@/contexts/GlobalContext';
import { ICategory } from '@/interfaces/category.interface';
import { fetchData } from '@/utils/fetch.utils';
import { inter } from '@/utils/media.utils';
import { appWithTranslation } from 'next-i18next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import Script from 'next/script';
import "react-datepicker/dist/react-datepicker.css";

interface GlobalProps {
  categories: ICategory[];
}

type PageProps = AppProps & GlobalProps
function MyApp({
  Component,
  pageProps,
  categories
}: PageProps) {
  return (
    <div className={inter.className}>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></Script>
      <AuthContextProvider>
        <GlobalContextProvider categories={categories}>
          <FavoritesContextProvider>
            <CartProvider>
              <CheckoutContextProvider>
                <ProductModal />
                <CheckoutModal />
                <Component {...pageProps} />
              </CheckoutContextProvider>
            </CartProvider>
          </FavoritesContextProvider>
        </GlobalContextProvider>
      </AuthContextProvider>
    </div>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<GlobalProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);
  try {
    const locale = context.ctx.locale || context.ctx.defaultLocale;
    const productCategories = await fetchData('productcategories', undefined, locale);

    return {
      ...ctx,
      categories: productCategories?.data || [],
    };
  } catch {
    return {
      ...ctx,
      categories: [],
    };
  }
}

export default appWithTranslation(MyApp);