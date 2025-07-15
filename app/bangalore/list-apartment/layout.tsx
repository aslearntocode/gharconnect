import RentalHeader from '@/components/RentalHeader';
import Footer from '@/components/Footer';

export default function RentApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RentalHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
} 