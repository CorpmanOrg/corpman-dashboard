import Image from "next/image";
import BkgImage from "../../components/assets/img/auth-bkdImg.png";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <Image src={BkgImage} alt="Background" fill className="object-cover -z-10" priority />
      <div className="absolute inset-0 backdrop-blur-[3px] bg-white/30 -z-0" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-lg rounded-lg px-6 py-6">
          <h1 className="text-center text-2xl font-bold mb-10">CorpMan Portal</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
