import { useGlobalContext } from "@/contexts/GlobalContext";
import { ELocales, LocaleTypes, localeKeys } from "@/interfaces/locales.interface";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useMemo } from "react";
import { CheckmarkIcon } from "../CustomIcons";
import Modal from "../Modal/Modal";
import styles from './LanguageModal.module.scss';

export const LanguageModal: FC = memo(() => {
  const { showLanguages, setShowLanguages } = useGlobalContext();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const onChangeLang = useCallback(async (lang: LocaleTypes) => {
    await i18n.changeLanguage(lang);
    let { pathname } = window.location;
    localeKeys.forEach(locale => {
      const langPath = `/${locale}`;
      if (pathname.includes(langPath)) {
        pathname = pathname.replace(langPath, '');
      }
    });
    window.location.pathname = `/${lang}/${pathname}`;
  }, [i18n.changeLanguage, router.query]);

  const languageEls = useMemo(() => {
    return localeKeys.map(lang => {
      const isActive = lang === i18n.language;
      return (
        <li
          key={lang}
          tabIndex={0}
          className="label"
          onClick={() => onChangeLang(lang)}
          data-active={isActive}
        >
          {ELocales[lang]}
          {isActive && <CheckmarkIcon />}
        </li>
      );
    });
  }, [i18n.language, onChangeLang,]);

  return (
    <Modal
      contentClassName={styles.languages}
      open={showLanguages}
      onClose={() => setShowLanguages(false)}
    >
      <h6 className="heading--tertiary">
        {t('language')}
      </h6>
      <ul>{languageEls}</ul>
    </Modal>
  );
});

LanguageModal.displayName = 'LanguageModal';
