import { FaqList } from "@/components/FaqList/FaqList";
import { Layout } from "@/components/Layout";
import PageHead from "@/components/PageHead";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const FaqPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <PageHead title={t('pages.faq.title')} description={t('pages.faq.description')}>
      <Layout>
        <ProfileLayout>
          <FaqList />
        </ProfileLayout>
      </Layout>
    </PageHead>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = (ctx.locale || ctx.defaultLocale)!;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'faq'])),
    }
  };
};

export default FaqPage;