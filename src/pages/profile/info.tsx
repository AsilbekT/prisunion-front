import { Footer } from "@/components/Footer/Footer";
import { Layout } from "@/components/Layout";
import PageHead from "@/components/PageHead";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { SectionHead } from "@/components/SectionHead";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const AdditionalInfoPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <PageHead title={t('pages.info.title')} description={t('pages.info.description')}>
      <Layout>
        <ProfileLayout>
          <SectionHead title={t('additionalInfo')} />
          <Footer asPage />
        </ProfileLayout>
      </Layout>
    </PageHead>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = ctx.locale || ctx.defaultLocale;

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common']))
    },
    revalidate: 10000,
  };
};

export default AdditionalInfoPage;