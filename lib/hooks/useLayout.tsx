import type { FC, ComponentType } from 'react';

const EmptyLayout: FC = ({ children }) => <>{children}</>;

export function useLayout<LP extends {}>(
  Component: ComponentType<any>
): ComponentType<LP> {
  return (Component as any).Layout || EmptyLayout;
}
