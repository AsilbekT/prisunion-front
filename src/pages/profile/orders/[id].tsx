import { Layout } from "@/components/Layout";
import { SingleOrder } from "@/components/Orders/SingleOrder/SingleOrder";
import PageHead from "@/components/PageHead";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SingleOrderPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <PageHead title={t('pages.singleOrder.title')} description={t('pages.singleOrder.description')}>
      <Layout>
        <ProfileLayout>
          <main>
            <SingleOrder />
          </main>
        </ProfileLayout>
      </Layout>
    </PageHead>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = (ctx.locale || ctx.defaultLocale)!;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
};

export default SingleOrderPage;