import Image from "next/image";

export default function DashboardHero({ mobile = false }: { mobile?: boolean }) {

  // MOBILE VERSION
  if (mobile) {
    return (
      <div className="flex justify-center">
        <div className="relative w-40">

          {/* Glow */}
          <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />

          <Image
            src="/girl.png"
            alt="asistente"
            width={160}
            height={240}
            className="relative object-contain"
          />
        </div>
      </div>
    );
  }

  // DESKTOP VERSION
  return (
    <div className="relative flex justify-center items-start h-full pt-10">

      <div className="relative w-[240px]">

        {/* Glow elegante */}
        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />

        <Image
          src="/girl.png"
          alt="asistente"
          width={240}
          height={400}
          className="relative object-contain"
        />
      </div>
    </div>
  );
}