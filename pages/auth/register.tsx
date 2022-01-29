import Link from 'next/link';
import { NextApiRequest } from 'next';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import { TypedFormEvent } from '@/typings/types';
import withSession from '@/lib/withSession';
import isAuth from '@/lib/isAuth';

interface ILoginForm {
  email: HTMLInputElement;
  password: HTMLInputElement;
  name: HTMLInputElement;
}

const RegisterPage: FC = () => {
  const router = useRouter();
  const [state, setState] = useState<{ error?: string }>({});

  async function login(e: TypedFormEvent<HTMLFormElement, ILoginForm>) {
    e.preventDefault();
    setState({});

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
      name: e.target.name.value,
    };
    
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    if (res.code === 200) {
      router.reload();
    } else {
      setState({ error: res.message });
    }
  }

  return (
    <div style={{ maxWidth: 300 }}>
      <h1>Register</h1>
      <Link href="/">Go to home</Link>
      <br />
      <form onSubmit={login}>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="SuperUser"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="qwe123qwe"
          />
        </div>
        {state.error && (
          <div style={{ padding: '3px 6px', backgroundColor: '#ededed', marginBottom: 12 }}>
            <span>{state.error}</span>
          </div>
        )}
        <button type="submit" style={{ width: '100%' }}>Register</button>
        <p>Already have an account? <Link href="/auth/login">Login</Link></p>
      </form>
    </div>
  );
};

export const getServerSideProps = withSession(async (req: NextApiRequest) => {
  if (isAuth(req)) {
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

export default RegisterPage;
