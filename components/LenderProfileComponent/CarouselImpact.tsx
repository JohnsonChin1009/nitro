"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface ImpactStory {
  id: number
  image: string
  title: string
  description: string
  location: string
  impact: string
}

export default function MicroloanImpactCarousel() {
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const impactStories: ImpactStory[] = [
    {
      id: 1,
      image: "/grocery.png?height=600&width=800",
      title: "Local Grocery Store Success",
      description:
        "Maria used a RM5000 microloan to open a small grocery store in her neighborhood, now employing 3 people from her community.",
      location: "Kuala Lumpuer, Malaysia",
      impact: "Created 3 jobs and provides essential goods to 200+ families",
    },
    {
      id: 2,
      image: "/artisan.png?height=600&width=800",
      title: "Artisan Workshop Growth",
      description:
        "After receiving a microloan, Carlos expanded his handcraft business, increasing his income by 70% and supporting his children's education.",
      location: "Selangor, Malaysia",
      impact: "Increased family income by 70% and funded education for 3 children",
    },
    {
      id: 3,
      image: "/paddy.png?height=600&width=800",
      title: "Agricultural Innovation",
      description:
        "A group of farmers used microloans to invest in efficient irrigation systems, doubling their crop yield and improving food security.",
      location: "Kelantan, Malaysia",
      impact: "Doubled crop yield for 15 farming families, improving regional food security",
    },
  ]

  useEffect(() => {
    if (!api || isPaused) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api, isPaused])

  useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="w-full max-w-6xl mx-auto p-6 ng-white">
      <Carousel
        setApi={setApi}
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <CarouselContent>
          {impactStories.map((story) => (
            <CarouselItem key={story.id}>
              <div className="bg-gray-50/10 rounded-lg overflow-hidden shadow-md px-3 ">
                <div className="flex flex-col md:flex-row">
                  {/* Image section */}
                  <div className="md:w-1/2">
                    <div className="relative h-[300px] w-full">
                      <Image
                        src={story.image || "/placeholder.svg"}
                        alt={story.title}
                        fill
                        className="object-cover rounded-xl"
                        priority
                      />
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="mb-2 inline-block  py-1 bg-white text-gray-600 text-sm rounded-full">
                      {story.location}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>

                    <div className="mt-auto">
                      <h4 className="font-semibold text-gray-700 mb-1">Impact:</h4>
                      <p className="text-gray-600">{story.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-center mt-6 gap-2">
          {impactStories.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn("w-3 h-3 rounded-full transition-all", current === index ? "bg-gray-800" : "bg-gray-300")}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
