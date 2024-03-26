import { ElementProps } from "@/interfaces/utils.interface";
import classNames from "classnames";
import { FC, ReactNode, memo, useState } from "react";
import { TooltipMessage, WarningIcon } from "../CustomIcons";
import styles from './BubbleText.module.scss';

interface BubbleTextProps extends ElementProps<HTMLDivElement> {
  children: ReactNode;
  contentText: ReactNode;
  wrapperClassName?: string;
  show?: boolean;
}

export const BubbleText: FC<BubbleTextProps> = memo(({
  children,
  wrapperClassName,
  contentText,
  show,
  ...restProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={classNames(styles.bubble, restProps.className)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseEnter={() => setShowTooltip(true)}
      {...restProps}
    >
      {(showTooltip || show) && (
        <div className={classNames(styles.content, 'fadeIn')}>
          <div className="title">
            <WarningIcon />
            {contentText}
          </div>
          <TooltipMessage />
        </div>
      )}
      <div className={wrapperClassName}>
        {children}
      </div>
    </div>
  );
});

BubbleText.displayName = 'BubbleText';