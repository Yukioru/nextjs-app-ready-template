import Link from 'next/link';
import withSession from '@/lib/withSession';
import isAuth from '@/lib/isAuth';
import SettingsLayout from '@/layouts/SettingsLayout';
import { NextApiRequest } from 'next';

export default function Settings() {
  return (
    <div>
      <Link href="/">Go to home</Link>
    </div>
  )
}

Settings.Layout = SettingsLayout;

export const getServerSideProps = withSession(async (req: NextApiRequest) => {
  if (!isAuth(req)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
