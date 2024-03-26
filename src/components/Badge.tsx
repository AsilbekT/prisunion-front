import { FC } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { CheckmarkIcon } from "./CustomIcons";

interface BadgeProps {
  content: string;
  type?: 'success' | 'fail' | 'warning' | 'info';
  noIcon?: boolean;
}

export const Badge: FC<BadgeProps> = ({
  content,
  type = 'success',
  noIcon = false
}) => (
  <div className={`badge badge--${type}`}>
    {!noIcon && (
      <span>
        {type === 'success' ? <CheckmarkIcon /> : <IoCloseOutline />}
      </span>
    )}
    {content}
  </div>
);