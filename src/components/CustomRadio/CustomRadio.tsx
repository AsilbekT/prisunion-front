import classNames from "classnames";
import { FC, memo } from "react";
import styles from './CustomRadio.module.scss';

interface CustomRadioProps {
  options: {
    label: string;
    value: string;
  }[];
  onChange: (val: string) => unknown;
  label?: string;
  value: string;
}

export const CustomRadio: FC<CustomRadioProps> = memo((props) => {
  const { options, value, onChange, label, } = props;

  const radioOptionEls = options.map(option => {
    const isActive = option.value === value;
    return (
      <li
        tabIndex={0}
        role="checkbox"
        onClick={() => onChange(option.value)}
        key={option.value}
        className={styles.option}
        data-active={isActive}
      >
        <div
          className={classNames(styles.checkbox, "round-checkbox round-checkbox--primary")}
          data-active={isActive}
        >
          <span />
        </div>
        <span className="label">{option.label}</span>
      </li>
    );
  });

  return (
    <div className={classNames('input-wrapper', styles.radio)}>
      {label && (
        <span className="text-pale">{label}</span>
      )}
      <ul>
        {radioOptionEls}
      </ul>
    </div>
  );
});

CustomRadio.displayName = 'CustomRadio';