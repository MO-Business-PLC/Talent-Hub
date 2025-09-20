import JobFlowCard from "./JobFlowCard"

export interface JobStep {
  id: number
  title: string
  description: string
  icon: string
}



function JobSteps({steps, title, span, description}: {title?: string, span?: string, description?: string ,steps:JobStep[]}) {
  return (
    <div className={"w-full max-w-4xl mx-auto py-8 sm:py-10 md:py-12"}>
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-background-dark mb-2">
          {title} <span className="sm:text-base">{span}</span>
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="relative w-full h-[500px] sm:h-[500px] md:h-[600px]">
        <JobFlowCard card={steps[0]} className="top-0 left-4 sm:left-8 md:left-10" />

        <img
          src="icons/home/lineup.svg"
          className="absolute top-12 sm:top-14 md:top-15 left-58 sm:left-70 md:left-85 w-30 h-40 sm:w-32 sm:h-28 md:w-45 md:h-40"
        />

        <JobFlowCard card={steps[1]} className="top-28 sm:top-30 right-8 sm:right-16 md:right-20" />

        <img
          src="/icons/home/linemiddle.svg"
          className="absolute top-50 sm:top-52 md:top-60 right-62 sm:right-72 md:right-95 w-30 h-40 sm:w-32 sm:h-28 md:w-45 md:h-40"
        />

        <JobFlowCard card={steps[2]} className="top-60 sm:top-72 md:top-80 left-4 sm:left-8 md:left-10" />

        <img
          src="/icons/home/linebottom.svg"
          className="absolute top-85 sm:top-92 md:top-105 left-60 sm:left-64 md:left-85 w-30 h-40 sm:w-32 sm:h-28 md:w-45 md:h-40"
        />

        <JobFlowCard card={steps[3]} className="top-92 sm:top-96 md:top-100 right-8 sm:right-16 md:right-20" />
      </div>
    </div>
  )
}

export default JobSteps
