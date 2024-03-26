import Login from "@/components/Login";
import PageHead from "@/components/PageHead";
import { LoginContextProvider } from "@/contexts/LoginContext";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LoginPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <PageHead title={t('pages.login.title')} description={t('pages.login.description')}>
      <main>
        <LoginContextProvider>
          <Login />
        </LoginContextProvider>
      </main>
    </PageHead>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const locale = (ctx.locale || ctx.defaultLocale)!;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
};

export default LoginPage;