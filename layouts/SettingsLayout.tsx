import type { FC } from 'react';

const SettingsLayout: FC = ({ children }) => {
  return (
    <div>
      <h1>Settings</h1>
      {children}
    </div>
  );
};

export default SettingsLayout;
