import RentalHeader from '@/components/RentalHeader';

export default function RentApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <RentalHeader />
      <main className="flex-grow pt-16">{children}</main>
    </div>
  );
} 