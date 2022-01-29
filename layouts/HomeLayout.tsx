import type { FC } from 'react';

const HomeLayout: FC = ({ children }) => {
  return (
    <div>
      <h1>Home page</h1>
      {children}
    </div>
  );
};

export default HomeLayout;
