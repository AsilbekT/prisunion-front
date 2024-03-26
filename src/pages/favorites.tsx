import { FavoritesList } from "@/components/FavoritesList/FavoritesList";
import { Layout } from "@/components/Layout";
import PageHead from "@/components/PageHead";
import SafeHydrate from "@/components/SafeHydrate";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Favorites: NextPage = () => {
  const { t } = useTranslation();
  return (
    <PageHead title={t('pages.favorites.title')} description={t('pages.favorites.description')}>
      <Layout>
        <SafeHydrate>
          <main>
            <FavoritesList />
          </main>
        </SafeHydrate>
      </Layout>
    </PageHead>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = (ctx.locale || ctx.defaultLocale)!;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
};

export default Favorites;