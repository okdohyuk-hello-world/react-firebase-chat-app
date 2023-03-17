import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../assets/firebase';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email, password }) => {
    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setErrorFromSubmit(e.message);
      setTimeout(() => setErrorFromSubmit(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center' }}>
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p> This field is required</p>}
        <label>Password</label>
        <input
          name="password"
          type="password"
          {...register('password', { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === 'required' && (
          <p> This password field is required</p>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <p> Password must have at least 6 characters</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" disabled={loading} />
        <Link style={{ color: 'gray', textDecoration: 'none' }} to="/register">
          회원가입
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
