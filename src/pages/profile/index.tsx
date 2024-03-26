import { Layout } from "@/components/Layout";
import PageHead from "@/components/PageHead";
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { ProfileLayout } from "@/components/ProfileLayout/ProfileLayout";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ProfilePage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <PageHead title={t('pages.profile.title')} description={t('pages.profile.description')}>
      <Layout>
        <main>
          <ProfileLayout>
            <ProfileInfo />
          </ProfileLayout>
        </main>
      </Layout>
    </PageHead>
  )
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = (ctx.locale || ctx.defaultLocale)!;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
};

export default ProfilePage;