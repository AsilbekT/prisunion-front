import { Layout } from "@/components/Layout";
import { OrdersList } from "@/components/Orders/OrdersList/OrdersList";
import PageHead from "@/components/PageHead";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const OrdersPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <PageHead title={t('pages.singleOrder.title')} description={t('pages.singleOrder.description')}>
      <Layout>
        <ProfileLayout>
          <OrdersList />
        </ProfileLayout>
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

export default OrdersPage;