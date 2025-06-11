import Link from 'next/link';

const societies = [
  {
    name: 'Crescent Bay, Parel',
    slug: 'crescent-bay-parel',
    description: 'A premium residential complex in Parel, Mumbai.'
  },
  {
    name: 'Ashok Gardens, Sewri',
    slug: 'green-acres-andheri',
    description: 'A vibrant community in the heart of Andheri.'
  },
  {
    name: 'Sunshine Towers, Thane',
    slug: 'sunshine-towers-thane',
    description: 'Modern living with all amenities in Thane.'
  }
];

export default function SocietiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Society</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {societies.map((society) => (
            <Link key={society.slug} href={`/societies/${society.slug}`} className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center cursor-pointer border border-gray-200 group-hover:border-indigo-500">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors text-center">{society.name}</h2>
                <p className="text-gray-600 text-center text-sm">{society.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 