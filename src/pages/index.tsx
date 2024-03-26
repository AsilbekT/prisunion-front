import Banners from "@/components/Home/Banners/Banners";
import MobileBanners from "@/components/Home/MobileBanners/MobileBanners";
import { Layout } from "@/components/Layout";
import PageHead from "@/components/PageHead";
import { ProductsByCategory } from "@/components/ProductsByCategory";
import { ProductsGroup } from "@/components/ProductsGroup/ProductsGroup";
import SafeHydrate from "@/components/SafeHydrate";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { IBanner } from "@/interfaces/banners.interface";
import { IProduct } from "@/interfaces/products.interface";
import { fetchData } from "@/utils/fetch.utils";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';

interface IHomePageProps {
  banners: IBanner[];
  popularProducts: IProduct[];
}

export default function Home({ banners, popularProducts }: IHomePageProps) {
  const { media } = useGlobalContext();
  const { t } = useTranslation();

  return (
    <PageHead title={t('pages.home.title')} description={t('pages.home.description')}>
      <Layout>
        <SafeHydrate>
          {media.tablet
            ? <MobileBanners banners={banners} />
            : <Banners banners={banners} />
          }
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
  const banners = await fetchData('banners', undefined, locale);
  const products = await fetchData('products/?trending=true', undefined, locale);

  return {
    props: {
      banners: banners?.data || [],
      popularProducts: products?.data || [],
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 10000,
  };
};