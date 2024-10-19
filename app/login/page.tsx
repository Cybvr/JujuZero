"use client";

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider, 
  GithubAuthProvider,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Login component mounted");

    let auth;
    try {
      auth = getAuth();
      console.log("Auth instance retrieved:", auth);
    } catch (error) {
      console.error("Error getting auth instance:", error);
      setError("Failed to initialize authentication. Please refresh the page.");
      return;
    }

    console.log("Setting up auth listeners");

    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("Persistence set to browserLocalPersistence"))
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setError("Failed to set authentication persistence. Please try again.");
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User logged in: ${user.uid}` : "No user");
      setUser(user);
      if (user) {
        console.log("Redirecting to dashboard...");
        router.push('/dashboard');
      }
    }, (error) => {
      console.error("Error in auth state change:", error);
      setError("An error occurred while checking authentication status. Please refresh the page.");
    });

    console.log("Checking for redirect result");
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Redirect sign-in successful:", result.user);
          router.push('/dashboard');
        } else {
          console.log("No redirect result, user may need to sign in");
        }
      })
      .catch((error) => {
        console.error("Error handling redirect result:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        handleAuthError(error);
      });

    return () => {
      console.log("Cleaning up auth listeners");
      unsubscribe();
    };
  }, [router]);

  const handleAuthError = (error: any) => {
    console.error("Authentication error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    switch(error.code) {
      case 'auth/account-exists-with-different-credential':
        setError('An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.');
        break;
      case 'auth/popup-blocked':
        setError('The sign-in popup was blocked by the browser. Please allow popups for this site and try again.');
        break;
      case 'auth/popup-closed-by-user':
        setError('The sign-in process was interrupted. Please try again.');
        break;
      case 'auth/cancelled-popup-request':
        setError('The sign-in process was cancelled. Please try again.');
        break;
      case 'auth/user-disabled':
        setError('This account has been disabled. Please contact support for assistance.');
        break;
      case 'auth/user-not-found':
        setError('No account found with this email address. Please check your email or sign up.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      default:
        setError(`An error occurred during sign-in: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      console.log("Attempting email sign-in");
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email sign-in successful:", result.user);
      router.push('/dashboard');
    } catch (error) {
      console.error("Email sign-in error:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    setError(null);
    setIsLoading(true);
    try {
      const providerName = provider instanceof GoogleAuthProvider ? 'Google' : 'GitHub';
      console.log(`Initiating sign-in with ${providerName}`);
      await signInWithRedirect(auth, provider);
      console.log(`${providerName} sign-in redirect initiated`);
    } catch (error) {
      console.error(`Error initiating ${provider instanceof GoogleAuthProvider ? 'Google' : 'GitHub'} sign-in:`, error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleSocialSignIn(new GoogleAuthProvider());
  const handleGitHubSignIn = () => handleSocialSignIn(new GithubAuthProvider());

  const handleEmailLinkSignIn = async () => {
    setError(null);
    setIsLoading(true);
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    try {
      console.log("Sending sign-in link to email:", email);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      console.log("Sign-in link sent successfully");
      setError("An email with a sign-in link has been sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Card className="sm:mx-auto sm:w-full sm:max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Image
              src="/images/logox.png"
              alt="Your Company Logo"
              width={40}
              height={40}
              style={{ width: 'auto', height: '40px' }}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            {user ? 'Welcome Back' : 'Sign in to your account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-destructive text-sm mb-4">{error}</div>}

          {!user ? (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-md bg-background px-3 py-1.5 text-sm font-semibold leading-6 text-foreground shadow-sm ring-1 ring-inset ring-input hover:bg-accent mb-3 disabled:opacity-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

              <button
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-md bg-background px-3 py-1.5 text-sm font-semibold leading-6 text-foreground shadow-sm ring-1 ring-inset ring-input hover:bg-accent mb-3 disabled:opacity-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#24292e"/>
                </svg>
                Sign in with GitHub
              </button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </div>

              <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
                      Password
                    </label>
                    <div className="text-sm">
                      <Link href="/forgot-password" className="font-semibold text-primary hover:text-primary/80">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pr-10"
                                        />
                                        <button
                                          type="button"
                                          onClick={togglePasswordVisibility}
                                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                        >
                                          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                        </button>
                                      </div>
                                    </div>

                                    <div>
                                      <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-primary-foreground shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                                      >
                                        {isLoading ? 'Signing in...' : 'Sign in'}
                                      </button>
                                    </div>
                                  </form>

                                  <div className="mt-6">
                                    <button
                                      onClick={handleEmailLinkSignIn}
                                      disabled={isLoading}
                                      className="flex w-full justify-center rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50"
                                    >
                                      {isLoading ? 'Sending link...' : 'Sign in with Email Link'}
                                    </button>
                                  </div>

                                  <p className="mt-10 text-center text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="font-semibold leading-6 text-primary hover:text-primary/80">
                                      Sign up
                                    </Link>
                                  </p>
                                </>
                              ) : (
                                <div className="space-y-6">
                                  <p className="text-center text-foreground">You are signed in as {user.email}</p>
                                  <button
                                    onClick={handleSignOut}
                                    disabled={isLoading}
                                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-primary-foreground shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                                  >
                                    {isLoading ? 'Signing out...' : 'Sign out'}
                                  </button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      );
                    }