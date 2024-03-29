import { ElementProps, StateSetter } from "@/interfaces/utils.interface";
import { FC, useCallback, useMemo, useRef } from "react";

interface CellInputProps extends ElementProps<HTMLInputElement> {
  cellsCount: number;
  value: string;
  setValue: StateSetter<string>;
}

export const CellInput: FC<CellInputProps> = (props) => {
  const { cellsCount, value, setValue, ...restProps } = props;
  const inputRefEls = useRef<HTMLInputElement[]>([]);

  const onInputChange = useCallback((val: string, index: number) => {
    const nextInput = inputRefEls.current[index + 1];
    const prevElement = inputRefEls.current[index - 1];

    if (val) {
      nextInput?.focus();
    } else {
      prevElement?.focus();
    }

    setValue(prev => {
      if (val && prev.charAt(index)) return prev;
      return val
        ? prev + val.charAt(0)
        : prev.slice(0, prev.length - 1)
    });
  }, [setValue]);

  const inputCells = useMemo(() => {
    return Array.from(Array(cellsCount)).map((_, index) => {
      return (
        <input
          ref={el => inputRefEls.current[index] = el as any}
          key={index}
          type="number"
          className="input"
          value={value.charAt(index)}
          onChange={(e) => onInputChange(e.target.value, index)}
          {...restProps}
          autoFocus={(restProps.autoFocus && index === 0) || undefined}
        />
      );
    });
  }, [cellsCount, restProps, onInputChange, value]);

  return (
    <div className="input-group">
      {inputCells}
    </div>
  );
};