import React, { useEffect, useRef, useState } from "react";

export default function Testimonials() {
  const items = [
    {
      id: 1,
      quote:
        "Ut ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.",
      name: "Robert Fox",
      role: "UI/UX Designer",
      avatar: "/images/home/cardavatar.png",
    },
    {
      id: 2,
      quote:
        "Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia. Suspendisse ut dui vulputate augue condimentum ornare. Morbi vitae tristique ante",
      name: "Bessie Cooper",
      role: "Creative Director",
      avatar: "/images/home/cardavatar.png",
    },
    {
      id: 3,
      quote:
        "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse et magna quis nibh accumsan venenatis sit amet odio. Duis vestibulum bibendum dapibus. Curabitur ac lacus nec est congue congue in sed justo.",
      name: "Jane Cooper",
      role: "Photographer",
      avatar: "/images/home/cardavatar.png",
    },
    {
      id: 4,
      quote:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      name: "Jenny Wilson",
      role: "Product Manager",
      avatar: "/images/home/cardavatar.png",
    },
    {
      id: 5,
      quote:
        "Integer lacinia augue non mauris hendrerit, sed lacinia arcu elementum.",
      name: "Cody Fisher",
      role: "Developer",
      avatar: "/images/home/cardavatar.png",
    },
    {
      id: 6,
      quote:
        "Cras id mauris in ante commodo euismod. Praesent ut hendrerit turpis, sed mattis leo.",
      name: "Savannah Nguyen",
      role: "HR Specialist",
      avatar: "/images/home/cardavatar.png",
    },
  ];

  // responsive slides per view: mobile=1, sm=2, lg+=3
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // page-based index so the first view activates the first dot
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / perView));
  const maxPage = pageCount - 1;
  useEffect(() => {
    // clamp page when perView changes
    if (page > maxPage) setPage(maxPage);
  }, [perView, maxPage]);

  // autoplay
  useEffect(() => {
    const t = setInterval(() => {
      setPage((p) => (p >= maxPage ? 0 : p + 1));
    }, 4000);
    return () => clearInterval(t);
  }, [maxPage]);

  // compute pixel offset for smooth and accurate transform
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  useEffect(() => {
    const recalc = () => {
      const viewport = viewportRef.current;
      const w = viewport?.clientWidth || 0;
      let contentW = w;
      if (viewport) {
        const vs = getComputedStyle(viewport);
        const pl = parseFloat(vs.paddingLeft || "0");
        const pr = parseFloat(vs.paddingRight || "0");
        contentW = w - (isNaN(pl) ? 0 : pl) - (isNaN(pr) ? 0 : pr);
      }
      // Add mobile peek so neighbors are slightly visible like the mock
      const peek = window.innerWidth < 640 ? 24 : 0; // px on each side
      const slideW = perView === 1 ? Math.max(0, contentW - 2 * peek) : contentW / perView;
      let gapPx = 0;
      if (trackRef.current) {
        const cs = getComputedStyle(trackRef.current);
        const cg = (cs.gap || cs.columnGap || "0").toString();
        const parsed = parseFloat(cg);
        gapPx = isNaN(parsed) ? 0 : parsed;
      }
      setSlideWidth(slideW);
      const leftIndex = page * perView;
      setOffset(leftIndex * (slideW + gapPx));
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [page, perView]);

  return (
    <section className="relative w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="rounded-2xl  p-6 md:p-10">
          <h2 className="text-center text-[#0F172A] text-2xl md:text-3xl font-semibold mb-8">
            Clients Testimonial
          </h2>

          {/* Carousel */}
          <div className="relative">
            {/* edge blur overlays (same style as ActiveJobs bottom fade, mirrored) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 md:w-14 backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-10 md:w-14 backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)",
              }}
            />

            {/* add inner padding equal to overlay width so edge cards aren't visually clipped */}
            <div className="overflow-hidden px-6 sm:px-10 md:px-14" ref={viewportRef}>
              <div
                ref={trackRef}
                className="flex items-stretch gap-6 transition-transform duration-500"
                style={{ transform: `translateX(-${offset}px)` }}
              >
                {items.map((t) => (
                  <div
                    key={t.id}
                    className={"h-full " + (perView === 1 ? "flex-[0_0_auto]" : "flex-[0_0_calc(100%/var(--pv))]")}
                    style={
                      perView === 1
                        ? ({ width: slideWidth ? `${slideWidth}px` : undefined } as React.CSSProperties)
                        : ({ "--pv": String(perView) } as React.CSSProperties)
                    }
                  >
                    <Card {...t} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to page ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={`${i === page ? "w-6 bg-[#1E73BE]" : "w-2 bg-[#C8D4E2]"} h-1.5 rounded-full transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="relative h-[240px] md:h-[260px] rounded-2xl border border-[#E5EAF1] bg-white p-5 flex flex-col">
      {/* Stars */}
      <div className="flex items-center gap-1 text-[#F59E0B] mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4" />
        ))}
      </div>

      {/* Quote */}
      <p className="flex-1 text-[#6B7280] text-[13px] md:text-[14px] leading-relaxed mb-5 italic">
        “{quote}”
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded-full object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="text-[#0F172A] text-[14px] font-semibold truncate">
              {name}
            </div>
            <div className="text-[#9AA4B2] text-[12px] truncate">{role}</div>
          </div>
        </div>
        <Quotes className="w-8 h-8 text-[#E5EDF6]" />
      </div>
    </div>
  );
}

function Star({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function Quotes({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 7h4v4H9a2 2 0 00-2 2v4H3v-4a6 6 0 016-6zm10 0h4v4h-2a2 2 0 00-2 2v4h-4v-4a6 6 0 016-6z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
