import { FAQ_ITEMS } from "@/data/common.data";
import Collapsable from "@/lib/collapsable";
import { useTranslation } from "next-i18next";
import { FC, useLayoutEffect, useMemo, useRef } from "react";
import { ChevronDown } from "../CustomIcons";
import { SectionHead } from "../SectionHead";
import styles from './FaqList.module.scss';

export const FaqList: FC = () => {
  const itemRefs = useRef<HTMLElement[]>([]);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (itemRefs.current.length) {
      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const instance = new Collapsable({
          toggler: el.querySelector('div')!,
          element: el.querySelector('p')!,
          container: el,
        });
        if (index === 0) instance.open();
      });
    }
  }, []);

  const faqEls = useMemo(() => {
    return FAQ_ITEMS.map((item, index) => {
      return (
        <li ref={(ref) => itemRefs.current.push(ref!)} className={styles.item} key={index}>
          <div tabIndex={0}>
            <ChevronDown />
            <span className="label">{t(`faq:${item}.q`)}</span>
          </div>
          <p className="text">
            {t(`faq:${item}.a`)}
          </p>
        </li>
      );
    });
  }, []);

  return (
    <section>
      <SectionHead title="Eng ko'p beriladigan savollar" />
      <ul>
        {faqEls}
      </ul>
    </section>
  );
};