import Link from "next/link";

export default function Banner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-800 min-h-screen w-full flex items-center">
      <div className="absolute inset-0">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,255,255,0.1)"
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,112C672,128,768,192,864,186.7C960,181,1056,107,1152,80C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Naria Holidays Task Management
          </h1>
          <p className="mx-auto max-w-md sm:max-w-xl lg:max-w-3xl text-lg sm:text-xl lg:text-1xl text-indigo-100 mb-10 sm:mb-12">
            Streamline your holiday planning with our intuitive task management
            system. Stay organized, collaborate effortlessly, and make your
            dream vacation a reality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/task"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
            <Link
              href="/task"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-100 bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
