"use client";
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
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

          // Trigger Google Ads conversion event
          if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {'send_to': 'AW-11237044944/KXZ6CPrlpdcZENDlnu4p'});
          }

          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
        setError('Error signing in with Google. Please try again.');
      }
    };

    handleRedirectResult();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await initializeUserCredits(user.uid);

      // Trigger Google Ads conversion event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {'send_to': 'AW-11237044944/KXZ6CPrlpdcZENDlnu4p'});
      }

      router.push('/dashboard');
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setError('This email is already in use. Please try another one.');
            break;
          case 'auth/invalid-email':
            setError('The email address is not valid.');
            break;
          case 'auth/weak-password':
            setError('The password is too weak. Please use a stronger password.');
            break;
          default:
            setError('An error occurred during registration. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error("Registration error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Initiating Google sign-in with redirect...");
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error initiating Google sign-in:", error);
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        console.error("Error code:", firebaseError.code);
        console.error("Error message:", firebaseError.message);
      }
      setError('Error initiating sign-in with Google. Please try again.');
    }
  };

  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-11237044944" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-11237044944');
        `}
      </Script>
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
                  {/* Google icon SVG path */}
                </svg>
                Sign up with Google
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
                {/* Name input */}
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

                {/* Email input */}
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

                {/* Password input */}
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
                </Link>
                .
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
    </>
  );
}