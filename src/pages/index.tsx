import Banners from '@/components/Home/Banners/Banners';
import { Layout } from '@/components/Layout';
import PageHead from '@/components/PageHead';
import { ProductsByCategory } from '@/components/ProductsByCategory';
import { ProductsGroup } from '@/components/ProductsGroup/ProductsGroup';
import SafeHydrate from '@/components/SafeHydrate';
import { homeBanners } from '@/data/dummy.data';
import { IBanner } from '@/interfaces/banners.interface';
import { IProduct } from '@/interfaces/products.interface';
import { fetchData } from '@/utils/fetch.utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';

interface IHomePageProps {
  banners: IBanner[];
  popularProducts: IProduct[];
}

export default function Home({ banners, popularProducts }: IHomePageProps) {
  const { t } = useTranslation();

  return (
    <PageHead
      title={t('pages.home.title')}
      description={t('pages.home.description')}
    >
      <Layout>
        <SafeHydrate>
          <div className="container">
            <div className="info-text">
              <h2 className="heading heading--tertiary">{t('headerTitle')}</h2>
            </div>
          </div>
          <Banners banners={banners} />
        </SafeHydrate>
        <ProductsGroup
          title="Ommabop mahsulotlar"
          categoryId="popular"
          products={popularProducts}
          isModalProduct
        />
        <ProductsByCategory />
      </Layout>
    </PageHead>
  );
}

export const getStaticProps: GetStaticProps<IHomePageProps> = async (ctx) => {
  const locale = ctx.locale || ctx.defaultLocale;
  const localesData = await serverSideTranslations(locale!, ['common']);
  try {
    const banners = await fetchData('banners', undefined, locale);
    const products = await fetchData(
      'products/?trending=true',
      undefined,
      locale
    );

    return {
      props: {
        banners: banners?.data || homeBanners,
        popularProducts: products?.data || [],
        ...localesData,
      },
      revalidate: 20,
    };
  } catch {
    return {
      props: {
        banners: homeBanners,
        popularProducts: [],
        ...localesData,
      },
    };
  }
};
