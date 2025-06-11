import Link from 'next/link';
import SocietyImage from '@/components/SocietyImage';

const societies = [
  {
    name: 'L&T Crescent Bay, Bhoiwada',
    href: '/cb-parel',
    description: 'A premium residential complex in Parel.',
    image: '/cb.png',
  },
  {
    name: 'Ashok Gardens, Sewri',
    href: '/ashok-gardens-sewri',
    description: 'A vibrant community in the heart of Sewri.',
    image: '/ag.png',
  },
  {
    name: 'Island City Centre (ICC), Bhoiwada',
    href: '/icc-bhoiwada',
    description: 'Modern living with all amenities in Bhoiwada.',
    image: '/icc.png',
  },
  {
    name: 'Ashok Towers, Sewri',
    href: '/ashok-towers-sewri',
    description: 'A peaceful society in Sewri.',
    image: '/at.png',
  },
  {
    name: 'Dosti Flamingo, Sewri',
    href: '/dosti-flamingo-sewri',
    description: 'A peaceful society in Sewri.',
    image: '/df.png',
  },
  // Add more societies as needed, with or without image
];

export default function SocietiesPage() {
  return (
    <>
      {/* Simple, distinct header for societies selection */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-indigo-700 tracking-tight">GharConnect</span>
          <span className="ml-2 text-sm text-gray-400 font-medium hidden sm:inline">Society Platform</span>
        </div>
      </header>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-16 px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight drop-shadow-sm">Select Your Society</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {societies.map((society) => (
              <Link key={society.name} href={society.href} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                <div className="bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center cursor-pointer border border-gray-200 group-hover:border-indigo-500 group-hover:scale-[1.04] group-hover:ring-2 group-hover:ring-indigo-200 h-72 min-h-[18rem] max-h-80 justify-between">
                  {society.image ? (
                    <SocietyImage
                      src={society.image}
                      alt={society.name}
                      className="w-32 h-32 object-cover rounded-2xl mb-4 border border-gray-100 shadow-lg group-hover:ring-4 group-hover:ring-indigo-300 transition-all duration-300 bg-gray-100"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-2xl mb-4 bg-gray-100 text-gray-400 text-4xl font-bold border border-gray-100 shadow-lg">
                      ?
                    </div>
                  )}
                  <h2 className="text-2xl font-extrabold font-sans text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors text-center drop-shadow-sm flex-1 flex items-center justify-center">{society.name}</h2>
                  <p className="text-gray-600 text-center text-base flex-1 flex items-center justify-center font-medium">{society.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 