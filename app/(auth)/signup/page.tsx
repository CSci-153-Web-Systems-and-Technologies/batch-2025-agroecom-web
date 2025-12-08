import SignupLoginHero from '@/components/SignupLoginHero'
import SignupForm from "./components/SignupForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-5 bg-background font-poppins">
        <SignupLoginHero />
      <div className="lg:col-span-2 flex items-center justify-center bg-white p-6 sm:p-12">
        <SignupForm />   
      </div>
    </div>
  );
}