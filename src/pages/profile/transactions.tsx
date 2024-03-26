import { Layout } from "@/components/Layout";
import PageHead from "@/components/PageHead";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { TransactionsList } from "@/components/TransactionsList/TransactionsList";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const TransactionsPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <PageHead title={t('pages.transactions.title')} description={t('pages.transactions.description')}>
      <Layout>
        <main>
          <ProfileLayout>
            <TransactionsList />
          </ProfileLayout>
        </main>
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

export default TransactionsPage;