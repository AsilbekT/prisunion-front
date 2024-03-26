import { FC, Fragment, memo, useMemo } from "react";
import styles from './StepsBar.module.scss';

interface StepsBarProps {
  stepsCount: number;
  currentStep: number;
  title?: string;
}

export const StepsBar: FC<StepsBarProps> = memo((props) => {
  const { stepsCount, currentStep, title } = props;

  const stepEls = useMemo(() => {
    return Array.from(Array(stepsCount)).map((_, index) => {

      return (
        <Fragment key={index}>
          <span
            className="round-checkbox"
            data-active={index === currentStep}
          >
            <span />
          </span>
          {index < stepsCount - 1 && (
            <span className={styles.delimeter}></span>
          )}
        </Fragment>
      );
    });
  }, [stepsCount, currentStep]);

  return (
    <div className={styles.bar}>
      {title && (
        <p className="title-lg">{title}</p>
      )}
      <div>{stepEls}</div>
    </div>
  );
});

StepsBar.displayName = 'StepsBar';
