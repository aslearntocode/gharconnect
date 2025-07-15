import RentalHeader from '@/components/RentalHeader';

export default function RentApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RentalHeader />
      <main className="flex-grow">{children}</main>
    </>
  );
} 