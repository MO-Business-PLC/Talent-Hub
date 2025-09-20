import React from "react"
import type { JobStep } from "./JobSteps"
import { cn } from "~/lib/utils"

function JobFlowCard({ card, className }: { card: JobStep; className?: any }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 max-w-[14rem] sm:max-w-[16rem] md:max-w-[18rem] bg-white shadow-xl absolute rounded-xl",
        className
      )}
    >
      <img
        alt={card.title}
        width={40}
        height={40}
        className="sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]"
        src={`${card.icon}.jpg`}
      />
      <h1 className="text-black text-lg sm:text-xl">{card.title}</h1>
      <p className="text-text-secondary text-sm ">{card.description}</p>
    </div>
  )
}

export default JobFlowCard
