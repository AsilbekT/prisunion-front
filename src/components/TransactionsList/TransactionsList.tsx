import { useFetch } from "@/hooks/useFetch";
import { FC, useEffect } from "react";
import { SectionHead } from "../SectionHead";
import styles from './TransactionsList.module.scss';

export const TransactionsList: FC = () => {
  const fetch = useFetch(true);

  useEffect(() => {
    fetch.makeRequest({
      url: '/'
    })
  }, []);

  return (
    <section className={styles.transactions}>
      <SectionHead title="Tranzaksiyalar tarixi" />
    </section>
  );
};