import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowDown, Search } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="">
      {/* Hero section with search */}
      <section className="px-4 pt-16 h-screen snap-start flex flex-col justify-start">
        <div className="w-full max-w-none">
          <div className="text-4xl tracking-tighter text-center text-black">
            what would you like to cook?
          </div>
          <div className="flex w-full max-w-md mx-auto mt-8 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="text" placeholder="Search" className="pl-10 w-full" />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center pb-4 absolute bottom-4 left-0 right-0 z-10">
        <Link
          href="#about"
          className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="text-sm">About</div>
          <ArrowDown className="h-4 w-4 mt-1 animate-bounce" />
        </Link>
      </div>

      <section id="about" className="pb-16 snap-start scroll-mt-24">
        <div className="px-4 md:px-6 w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center text-black mb-6 pb-8">
            Find ingredients and support farmers.
          </h2>

          {/* Centered 3-column grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl w-full">

              {/* Column 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="text-xl font-semibold">Search for a food</div>
                <img
                  src="/download.jpeg"
                  alt="Search Dish"
                  className="w-64 h-64 object-contain mb-2"
                />
                <div >
                  Search for a dish you want to make, and our AI-powered engine will automatically extract the ingredients that you'll need.
                </div>
              </div>

              {/* Separator as a full-height vertical line */}
              <div className="hidden md:flex justify-center">
                <Separator orientation="vertical" className="h-full" />
              </div>

              {/* Column 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="text-xl font-semibold">Cook with Confidence</div>
                <img
                  src="/download.jpeg"
                  alt="Local Farmers"
                  className="w-64 h-64 object-contain mb-2"
                />
                <div>
                  After identifying your ingredients, we provide details of farmers and local markets that offer them so you can shop fresh, seasonal, and sustainable.
                </div>
              </div>

            </div>
          </div>

          {/* Mission Statement */}
        <div className="mt-24 max-w-3xl mx-auto text-center text-2xl">
            Our mission is to empower home cooks with smart, ingredient-driven tools while supporting local farmers through transparent, seasonal sourcing.
        </div>


        </div>
      </section>

    </div>
  )
}
