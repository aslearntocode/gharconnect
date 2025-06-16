'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import LoginModal from '@/components/LoginModal';

interface Availability {
  date: Date;
  startTime: string;
  endTime: string;
}

const TIME_SLOTS = [
  { start: '09:00', end: '10:00', label: '9-10am' },
  { start: '10:00', end: '11:00', label: '10-11am' },
  { start: '11:00', end: '12:00', label: '11-12pm' },
  { start: '12:00', end: '13:00', label: '12-1pm' },
  { start: '13:00', end: '14:00', label: '1-2pm' },
  { start: '14:00', end: '15:00', label: '2-3pm' },
  { start: '15:00', end: '16:00', label: '3-4pm' },
  { start: '16:00', end: '17:00', label: '4-5pm' },
  { start: '17:00', end: '18:00', label: '5-6pm' },
  { start: '18:00', end: '19:00', label: '6-7pm' },
  { start: '19:00', end: '20:00', label: '7-8pm' },
];

const societies = [
  { name: 'L&T Crescent Bay', area: 'parel', image: '/cb.png' },
  { name: 'Ashok Gardens', area: 'parel', image: '/ag.png' },
  { name: 'Island City Centre', area: 'parel', image: '/icc.png' },
  { name: 'Ashok Towers', area: 'parel', image: '/at.png' },
  { name: 'Dosti Flamingo', area: 'parel', image: '/df.png' },
  { name: 'Ruparel Ariana', area: 'parel', image: '/ra.png' },
  { name: 'Kalpataru Avana', area: 'parel', image: '/ka.png' },
  { name: 'Lodha Venezia', area: 'parel', image: '/lv.png' },
  { name: 'Lodha Park', area: 'worli', image: '/Lodha_Park.png' },
  { name: 'Lodha World One', area: 'worli', image: '/Lodha_World_One.png' },
  { name: 'Indiabulls Blu', area: 'worli', image: '/Indiabulls.png' },
  { name: 'Raheja Imperia', area: 'worli', image: '/Raheja_Imperia.png' },
];

const areas = [
  { name: 'Parel, Mumbai (Parel, Sewri, Bhoiwada)', value: 'parel' },
  { name: 'Worli, Mumbai (Worli, Lower Parel)', value: 'worli' },
  { name: 'Bandra, Mumbai (Bandra, Khar, Santacruz)', value: 'bandra' },
  { name: 'Andheri, Mumbai (Andheri, Marol, Ghatkopar)', value: 'andheri' },
];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function VendorDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedSocieties, setSelectedSocieties] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setIsLoggedIn(true);
        fetchAvailability();
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const slotMap: Record<string, Record<string, boolean>> = {};
    for (const slot of availability) {
      const dateKey = slot.date.toISOString().slice(0, 10);
      if (!slotMap[dateKey]) slotMap[dateKey] = {};
      slotMap[dateKey][slot.startTime] = true;
    }
    setSelectedSlots(slotMap);
  }, [availability]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_availability')
        .select('*')
        .eq('vendor_id', auth.currentUser?.uid)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          console.log('Table does not exist yet. This is expected on first run.');
          setAvailability([]);
          return;
        }
        throw error;
      }

      if (!data) {
        setAvailability([]);
        return;
      }

      setAvailability(data.map(item => ({
        date: new Date(item.date),
        startTime: item.start_time,
        endTime: item.end_time
      })));
    } catch (error: any) {
      console.error('Error fetching availability:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch availability',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setAvailability([]);
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const handleSlotToggle = (date: Date, slot: typeof TIME_SLOTS[0]) => {
    const dateKey = date.toISOString().slice(0, 10);
    setSelectedSlots(prev => {
      const daySlots = { ...(prev[dateKey] || {}) };
      daySlots[slot.start] = !daySlots[slot.start];
      return { ...prev, [dateKey]: daySlots };
    });
  };

  const handleSocietyToggle = (name: string) => {
    setSelectedSocieties(prev => {
      let updated;
      if (prev.includes(name)) {
        updated = prev.filter(s => s !== name);
      } else if (prev.length < 2) {
        updated = [...prev, name];
      } else {
        updated = prev;
      }
      setSelectedSlots({}); // Reset slots when societies change
      return updated;
    });
  };

  const handleSaveAvailability = async () => {
    if (!auth.currentUser) return;
    if (!mobileNo) {
      toast({ title: 'Error', description: 'Please enter your mobile number', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const vendorName = auth.currentUser?.displayName || auth.currentUser?.email || '';
      const societiesString = selectedSocieties.length
        ? `{${selectedSocieties.map(s => `"${s}"`).join(',')}}`
        : '{}';
      const days = getNext7Days();
      const rows = days.map(date => {
        const dateKey = date.toISOString().slice(0, 10);
        const slotBooleans: { [key: string]: boolean } = {};
        TIME_SLOTS.forEach(slot => {
          const col = `slot_${parseInt(slot.start)}_${parseInt(slot.end)}`;
          slotBooleans[col] = !!selectedSlots[dateKey]?.[slot.start];
        });
        return {
          vendor_id: auth.currentUser!.uid,
          Name: vendorName,
          Mobile_No: mobileNo,
          area: selectedArea,
          societies: societiesString,
          date: dateKey,
          ...slotBooleans,
        };
      });
      const { error } = await supabase
        .from('vendor_weekly_availability')
        .upsert(rows, { onConflict: ['vendor_id', 'date'] });
      if (error) throw error;
      toast({ title: 'Success', description: 'Availability saved!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save availability',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSocieties = selectedArea ? societies.filter(s => s.area === selectedArea) : [];

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setSelectedSocieties([]); // Reset societies when area changes
    setSelectedSlots({}); // Reset slots when area changes
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto mt-10 p-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Vendor Dashboard</h2>
            <p className="text-center text-gray-600 mb-6">
              Please login to manage your availability
            </p>
            <Button 
              onClick={() => setShowLoginModal(true)} 
              className="w-full"
            >
              Login
            </Button>
          </Card>
        </main>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            setIsLoggedIn(true);
            fetchAvailability();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <Card className="p-6 mb-8 w-full">
          <h2 className="text-lg font-semibold mb-4">Select Area</h2>
          <div className="max-w-xs mb-4">
            <select
              value={selectedArea}
              onChange={handleAreaChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none text-base"
            >
              <option value="">Select an area</option>
              {areas.map(area => (
                <option key={area.value} value={area.value}>{area.name}</option>
              ))}
            </select>
          </div>
          {selectedArea && (
            <>
              <h2 className="text-lg font-semibold mb-4">Select up to 2 Societies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                {filteredSocieties.map(society => {
                  const isSelected = selectedSocieties.includes(society.name);
                  const isDisabled = !isSelected && selectedSocieties.length >= 2;
                  return (
                    <button
                      key={society.name}
                      type="button"
                      onClick={() => handleSocietyToggle(society.name)}
                      disabled={isDisabled}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm bg-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
                        ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50' : 'border-gray-200'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <img src={society.image} alt={society.name} className="w-12 h-12 object-cover rounded-lg mb-2 border border-gray-100 bg-gray-50" />
                      <span className="text-xs font-semibold text-center">{society.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mb-4">You can select up to 2 societies.</p>
              <div className="mb-4 max-w-xs">
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNo}
                  onChange={e => setMobileNo(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </>
          )}
        </Card>
        <Card className="p-6 mb-8 w-full">
          <h2 className="text-xl font-semibold mb-4">Set Your Availability (Next 7 Days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border text-center table-auto">
              <thead>
                <tr>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold whitespace-nowrap min-w-[160px]">Date</th>
                  {TIME_SLOTS.map(slot => (
                    <th key={slot.start} className="border px-3 py-2 bg-gray-100 text-base font-semibold">{slot.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getNext7Days().map(date => {
                  const dateKey = date.toISOString().slice(0, 10);
                  return (
                    <tr key={dateKey}>
                      <td className="border px-3 py-2 font-medium whitespace-nowrap min-w-[160px] bg-white">
                        {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      {TIME_SLOTS.map(slot => (
                        <td key={slot.start} className="border px-3 py-2 bg-white">
                          <input
                            type="checkbox"
                            checked={!!selectedSlots[dateKey]?.[slot.start]}
                            onChange={() => handleSlotToggle(date, slot)}
                            className="w-5 h-5 accent-indigo-600"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Button className="mt-6 w-full" onClick={handleSaveAvailability} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Availability'}
          </Button>
        </Card>
      </main>
    </div>
  );
}
