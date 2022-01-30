import { FC, ComponentType, useMemo } from 'react';

const EmptyLayout: FC = ({ children }) => <>{children}</>;

export function useLayout<LP extends {}>(
  Component: ComponentType<any>,
  Layout?: ComponentType<any>
): ComponentType<LP> {
  const ComponentLayout = (Component as any).Layout;
  const memoizedLayout = useMemo(() => {
    return ComponentLayout || Layout || EmptyLayout;
  }, [ComponentLayout, Layout]);

  return memoizedLayout;
}
