export function LeftHero() {
  return (
    <div className="relative p-0 m-0 hidden md:block bg-gradient-to-b from-[#0F4C93] to-[#1E73BE]">
      <img
        src="/images/auth/stars.png"
        alt=""
        className="absolute top-0 left-[-40px] w-[300px] h-[300px] object-contain"
      />
      <img
        src="/images/auth/stars.png"
        alt=""
        className="absolute bottom-0 right-[-40px] w-[300px] h-[300px] object-contain"
      />
      <div className="relative h-full w-full flex items-center justify-center">
        <img
          src="/images/auth/lefthero.png"
          alt="Candidate Hero"
          className="w-[600px]"
        />
      </div>
    </div>
  );
}
