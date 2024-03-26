import { ElementProps } from "@/interfaces/utils.interface";
import { FC, RefObject, forwardRef, useMemo } from "react";
import { ChevronDown } from "./CustomIcons";

interface CustomSelectProps extends Omit<ElementProps<HTMLSelectElement>, 'onChange'> {
  options: {
    label: string;
    value: string;
  }[];
  label?: string;
}

export const CustomSelect: FC<Omit<CustomSelectProps, 'ref'>> = forwardRef((props, ref) => {
  const { options, label, ...restProps } = props;

  const optionEls = useMemo(() => {
    return options.map((option) => (
      <option key={option.value} value={option.value} title={option.label}>
        {option.label}
      </option>
    ));
  }, [options]);

  return (
    <div className="select-wrapper">
      <span className="text-pale">{label}</span>
      <div className="input-wrapper">
        <select
          ref={ref as RefObject<HTMLSelectElement>}
          className="input"
          {...restProps}
        >
          {optionEls}
        </select>
        <ChevronDown />
      </div>
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';
