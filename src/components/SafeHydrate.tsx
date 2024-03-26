import { ElementProps } from "@/interfaces/utils.interface";
import { FC, useEffect, useState } from "react";

interface SafeHydrateProps extends ElementProps<HTMLDivElement> {
  children: React.ReactNode;
  releaseContent?: boolean;
  onRender?: () => void;
}

const SafeHydrate: FC<SafeHydrateProps> = ({
  children,
  releaseContent,
  onRender,
  ...restProps
}) => {
  const [contentRendered, setContentRendered] = useState(false);

  useEffect(() => {
    setContentRendered(true);
    if (typeof onRender === 'function') {
      onRender();
    }
  }, [onRender]);

  if (!contentRendered) return null;

  return (
    <div
      {...restProps}
      style={releaseContent ? { display: 'contents' } : undefined}
    >
      {typeof window === 'undefined' ? null : children}
    </div>
  );
};

SafeHydrate.displayName = 'SafeHydrate';

export default SafeHydrate;