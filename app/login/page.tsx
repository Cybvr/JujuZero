"use client";

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, getRedirectResult, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { initializeUserCredits } from '@/lib/credits';
import Image from 'next/image';
import { useTheme } from 'next-themes';

function LogoWrapper() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoSrc = resolvedTheme === 'dark' ? "/images/logoy.png" : "/images/logoz.png";

  return (
    <Image 
      src={logoSrc}
      alt="Logo" 
      width={96} 
      height={24} 
      className="w-24 h-8 object-contain"
    />
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Auth state on load:", auth.currentUser);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
    });

    const handleRedirectResult = async () => {
      try {
        console.log("Checking for redirect result...");
        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result);
        if (result) {
          console.log("User signed in after redirect:", result.user);
          await initializeUserCredits(result.user.uid);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Redirect error:", error);
        setError('Sign-in failed. Try again.');
      }
    };

    handleRedirectResult();

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    console.log("Starting Google Sign In process");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      await initializeUserCredits(result.user.uid);
      router.push('/dashboard');
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError('Failed to start Google sign-in. Try again.');
    }
  };

  const handleGithubSignIn = async () => {
    console.log("Starting GitHub Sign In process");
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub sign-in successful:", result.user);
      await initializeUserCredits(result.user.uid);
      router.push('/dashboard');
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setError('Failed to start GitHub sign-in. Try again.');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("Attempting email sign in...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in with email:", userCredential.user);
      await initializeUserCredits(userCredential.user.uid);
      router.push('/dashboard');
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Card className="sm:mx-auto sm:w-full sm:max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <LogoWrapper />
          </div>
          <CardTitle className="text-xl font-regular text-center pt-8 text-foreground">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-destructive text-sm mb-4">{error}</div>}

          <button
            onClick={handleGoogleSignIn}
            className="flex w-full justify-center items-center rounded-md bg-background px-3 py-1.5 text-sm font-semibold leading-6 text-foreground shadow-sm ring-1 ring-inset ring-input hover:bg-accent mb-2"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={handleGithubSignIn}
            className="flex w-full justify-center items-center rounded-md bg-background px-3 py-1.5 text-sm font-semibold leading-6 text-foreground shadow-sm ring-1 ring-inset ring-input hover:bg-accent"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor"/>
            </svg>
            Sign in with GitHub
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted-foreground" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleEmailSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Sign in with Email
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}