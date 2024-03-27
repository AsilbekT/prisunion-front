import { Layout } from "@/components/Layout";
import { NotificationsList } from "@/components/NotificationsList/NotificationsList";
import PageHead from "@/components/PageHead";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const NotificationsPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <PageHead
      title={t('pages.notifications.title')}
      description={t('pages.notification.description')}
    >
      <Layout>
        <main>
          <ProfileLayout>
            <NotificationsList />
          </ProfileLayout>
        </main>
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

export default NotificationsPage;