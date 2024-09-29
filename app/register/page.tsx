"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, getRedirectResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { initializeUserCredits } from '@/lib/credits';
import { Button } from "@/components/ui/button";
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
      className="w-24 h-6 object-contain"
    />
  );
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          await initializeUserCredits(user.uid);

          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
        setError('Error signing in. Please try again.');
      }
    };

    handleRedirectResult();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully:", userCredential.user);
      await initializeUserCredits(userCredential.user.uid);
      router.push('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      setError(`Registration failed: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Initiating Google sign-in with popup...");
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      await initializeUserCredits(result.user.uid);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error initiating Google sign-in:", error);
      setError(`Google sign-in failed: ${error.message}`);
    }
  };

  const handleGithubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      console.log("Initiating GitHub sign-in with popup...");
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub sign-in successful:", result.user);
      await initializeUserCredits(result.user.uid);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error initiating GitHub sign-in:", error);
      setError(`GitHub sign-in failed: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <LogoWrapper />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-destructive text-sm mb-4">{error}</div>}

            <Button onClick={handleGoogleSignIn} className="w-full mb-4 flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>

            <Button onClick={handleGithubSignIn} className="w-full mb-4 flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor"/>
              </svg>
              Sign up with GitHub
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-foreground">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full">Sign up</Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Promotional Content */}
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center">
        <div className="max-w-md text-left text-primary-foreground">
          <h2 className="text-2xl font-bold">Meet Your Sidekick</h2>
          <p className="text-md text-muted-foreground mb-4">The Ultimate Hub of Tools, Add-ons & Assets for Every Creator</p>
          <Image
            src="/images/marketing/product-preview.svg"
            alt="Product Preview"
            width={300}
            height={225}
            className="rounded-lg mb-4"
          />
          <ul className="text-md text-left list-disc list-inside text-muted-foreground">
            <li>Smart Apps for High Efficiency</li>
            <li>Time-saving Tools for Entrepreneurs</li>
            <li>Cost-effective Content Creation</li>
            <li>AI-powered Personalized Solutions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}