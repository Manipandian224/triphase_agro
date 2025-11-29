'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase/client-provider';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Lock, Mail, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication service not available.',
      });
      return;
    }
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!agreed) {
          toast({
            variant: 'destructive',
            title: 'Please agree to the terms and privacy policy.',
          });
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          toast({
            variant: 'destructive',
            title: 'Password is too weak.',
            description: 'Password should be at least 6 characters long.',
          });
          setIsLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Account created successfully!' });
        router.push('/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Logged in successfully!' });
        router.push('/dashboard');
      }
    } catch (error: any) {
        let title = 'Authentication Failed';
        let description = 'An unexpected error occurred. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
            title = 'Email Already in Use';
            description = 'This email is already registered. Please log in instead.';
        } else if (error.code === 'auth/wrong-password') {
            title = 'Incorrect Password';
            description = 'The password you entered is incorrect. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
            title = 'User Not Found';
            description = 'No account found with this email. Please sign up first.';
        } else if (error.message) {
            description = error.message;
        }
        
        toast({
            variant: 'destructive',
            title: title,
            description: description,
        });
    } finally {
      setIsLoading(false);
    }
  };
  
  const heroImage = PlaceHolderImages.find(img => img.id === 'crop-leaf');

  if (isUserLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-white/5 shadow-2xl backdrop-blur-2xl border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel: Image */}
          <div className="relative hidden h-full min-h-[600px] rounded-l-3xl md:block">
            <Image
              src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1593011033489-38501174693a?w=800"}
              alt="Artistic representation of agriculture technology"
              layout="fill"
              objectFit="cover"
              className="rounded-l-3xl"
              data-ai-hint={heroImage?.imageHint || 'futuristic agriculture'}
            />
            <div className="absolute inset-0 rounded-l-3xl bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12 text-slate-100">
            <div className="mb-8 text-center">
              <Leaf className="mx-auto mb-3 h-10 w-10 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">
                Welcome to Triphase Agro
              </h1>
              <p className="text-slate-300">
                {isSignUp ? 'Create an account to get started.' : 'Log in to your account.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                 <AuthInput icon={User} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} type="text" />
              )}
               <AuthInput icon={Mail} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
              {isSignUp && (
                <AuthInput icon={User} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} type="text" />
              )}
               <AuthInput icon={Lock} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />

              {isSignUp && isClient && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(!!checked)}
                    className="border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-400">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-green-400 text-primary-foreground rounded-full hover:shadow-glow-primary transition-shadow"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
              </Button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="mx-4 text-sm text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            <div className="flex justify-center gap-4">
              <SocialButton provider="Google" />
              <SocialButton provider="Facebook" />
            </div>

            <p className="mt-8 text-center text-sm text-slate-400">
              {isClient && (
                <>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {isSignUp ? 'Log In' : 'Sign Up'}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const AuthInput = ({ icon: Icon, ...props }: { icon: React.ElementType } & React.ComponentProps<typeof Input>) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
            {...props} 
            className="h-12 pl-12 bg-black/20 border-white/20 focus:border-primary focus:ring-primary/50 text-base text-slate-100"
        />
    </div>
);

const SocialButton = ({ provider }: { provider: 'Google' | 'Facebook' }) => {
  const Icon = provider === 'Google' ? 
    () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.48 2.64-4.55 2.64-3.55 0-6.45-2.93-6.45-6.55s2.9-6.55 6.45-6.55c2.03 0 3.38.79 4.3 1.7l2.4-2.4C18.62 3.44 16.12 2 12.48 2 7.03 2 3 6.03 3 11.5s4.03 9.5 9.48 9.5c5.33 0 9.17-3.55 9.17-9.33 0-.64-.07-1.25-.16-1.84H12.48z" fill="currentColor"/></svg>
    : () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><title>Facebook</title><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z" fill="currentColor"/></svg>;

  return (
    <Button variant="outline" className="h-12 flex-1 bg-black/20 border-white/20 hover:bg-black/30 text-slate-200">
      <Icon />
      <span className="ml-2">{provider}</span>
    </Button>
  );
};
    