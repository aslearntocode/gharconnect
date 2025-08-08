'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-auth';
import { User } from '@supabase/supabase-js'
// TODO: Replace Firebase auth functions: signOut, setPersistence, browserLocalPersistence;
import VendorHeader from '@/components/VendorHeader';
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

const PERMANENT_SLOTS = [
  { id: 'morning', label: 'Morning', start: '07:00', end: '12:00' },
  { id: 'afternoon', label: 'Afternoon', start: '12:00', end: '17:00' },
  { id: 'evening', label: 'Evening', start: '17:00', end: '20:00' },
  { id: '24hours', label: '24 Hours', start: '00:00', end: '23:59' },
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
  { name: 'Sheth Beau Pride', area: 'bandra', image: '' },
  { name: 'Excel Bellissima', area: 'bandra', image: '' },
  { name: 'Rustomjee Panorama', area: 'bandra', image: '' },
  { name: 'Hiranandani gardens', area: 'powai', image: '' },
  { name: 'Lodha Bellagio', area: 'powai', image: '' },
  { name: 'Godrej Urban park', area: 'powai', image: '' },
  { name: 'Hiranandani Regent Hill', area: 'powai', image: '' },
  { name: 'Shapoorji Pallonji Vicinia', area: 'powai', image: '' },
  { name: 'Nahar Amrit Shakti', area: 'powai', image: '' },
  { name: 'Hiranandani Estate', area: 'thane', image: '' },
  { name: 'Rustomjee Urbania', area: 'thane', image: '' },
  { name: 'Dosti Vihar', area: 'thane', image: '' },
  { name: 'Lodha Amara', area: 'thane', image: '' },
  { name: 'Sheth Avalon', area: 'thane', image: '' },
  { name: 'Rustomjee Elements', area: 'juhu', image: '' },
  { name: 'Prime Beach', area: 'juhu', image: '' },
  { name: 'DLH Mamta', area: 'juhu', image: '' },
  { name: 'Kalpataru Solitaire', area: 'juhu', image: '' },
  { name: 'Rustomjee Ashiana', area: 'juhu', image: '' },
  { name: 'Lodha One', area: 'juhu', image: '' },
  { name: 'Ruparel Stardom', area: 'malad', image: '' },
  { name: 'Gurukrupa Marina Enclave', area: 'malad', image: '' },
  { name: 'Chandak Treesourus', area: 'malad', image: '' },
  { name: 'Auris Serenity', area: 'malad', image: '' },
  { name: 'Lodha Raj Infinia', area: 'malad', image: '' },
  { name: 'Omkar Alta Monte', area: 'malad', image: '' },
  { name: 'Kalpatru Vienta', area: 'malad', image: '' },
  { name: 'Royal Pristo', area: 'malad', image: '' },
  { name: 'Adani Western Heights', area: 'andheri', image: '' },
  { name: 'Oberoi Springs', area: 'andheri', image: '' },
  { name: 'Transcon Triumph', area: 'andheri', image: '' },
  { name: 'Lodha Eternis', area: 'andheri', image: '' },
  { name: 'Oberoi Sky Gardens', area: 'andheri', image: '' },
  { name: 'Parthenon Raiskaran', area: 'andheri', image: '' },
  { name: 'Oberoi Sky Heights', area: 'andheri', image: '' },
  { name: 'Windsor Grande Residences', area: 'andheri', image: '' }
];

const areas = [
  { name: 'Parel, Mumbai (Parel, Sewri, Bhoiwada)', value: 'parel' },
  { name: 'Worli, Mumbai (Worli, Lower Parel)', value: 'worli' },
  { name: 'Bandra, Mumbai (Bandra, Bandra West, Bandra East,Khar)', value: 'bandra' },
  // { name: 'Andheri, Mumbai (Andheri, Marol, Ghatkopar, Santacruz)', value: 'andheri' },
  // { name: 'Powai, Mumbai (Powai, Hiranandani, Chandivali)', value: 'powai' },
  // { name: 'Malad, Mumbai (Malad, Malad West, Malad East)', value: 'malad' },
  // { name: 'Juhu, Mumbai (Juhu, Vile Parle, Santacruz West)', value: 'juhu' },
  // { name: 'Thane, Mumbai (Thane West, Thane East, Ghodbunder)', value: 'thane' },
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

function getNext10Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function VendorDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedSocieties, setSelectedSocieties] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string[]>([]);
  const [mobileNo, setMobileNo] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [activeTab, setActiveTab] = useState<'temporary' | 'permanent'>('permanent');
  const [permanentSlots, setPermanentSlots] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: false,
    evening: false,
    '24hours': false,
  });
  const router = useRouter();
  ;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      if (user) {
        setIsLoggedIn(true);
        fetchAvailability();
      } else {
        setIsLoggedIn(false);
        setAvailability([]);
      }
      setIsLoading(false);
    });
    
    return () => subscription.unsubscribe();
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
        .eq('vendor_id', (await supabase.auth.getUser()).data.user?.id)
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
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setAvailability([]);
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      window.location.href = '/vendor';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const handleSlotToggle = (date: Date, slot: { id: string }) => {
    const dateKey = date.toISOString().slice(0, 10);
    setSelectedSlots(prev => {
      const daySlots = { ...(prev[dateKey] || {}) };
      daySlots[slot.id] = !daySlots[slot.id];
      return { ...prev, [dateKey]: daySlots };
    });
  };

  const handlePermanentSlotToggle = (slotId: string) => {
    setPermanentSlots(prev => ({
      ...prev,
      [slotId]: !prev[slotId]
    }));
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Error', description: 'User not authenticated', variant: 'destructive' });
      return;
    }
    if (!mobileNo) {
      toast({ title: 'Error', description: 'Please enter your mobile number', variant: 'destructive' });
      return;
    }
    if (!selectedService) {
      toast({ title: 'Error', description: 'Please select a service', variant: 'destructive' });
      return;
    }
    if (selectedArea.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one area', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const vendorName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || '';
      const societiesString = selectedSocieties.length
        ? `{${selectedSocieties.map(s => `"${s}"`).join(',')}}`
        : '{}';
      const areasString = `{${selectedArea.map(area => `"${area}"`).join(',')}}`;

      if (activeTab === 'permanent') {
        // First, delete existing records for this vendor
        const { error: deleteError } = await supabase
          .from('vendor_permanent_availability')
          .delete()
          .eq('vendor_id', user.id);

        if (deleteError) {
          toast({
            title: 'Error',
            description: 'Failed to clear existing availability',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Save permanent availability - one record per slot type with all areas
        const rows = Object.entries(permanentSlots)
          .filter(([slotId, isAvailable]) => isAvailable)
          .map(([slotId]) => {
            const slot = PERMANENT_SLOTS.find(s => s.id === slotId);
            return {
              vendor_id: user.id,
              name: vendorName,
              mobile_no: mobileNo,
              services: selectedService,
              area: areasString, // Store all areas as JSON array
              societies: societiesString,
              slot_type: slotId,
              slot_start_time: slot?.start,
              slot_end_time: slot?.end,
              is_available: true,
            };
          });

        if (rows.length === 0) {
          toast({ title: 'Error', description: 'Please select at least one permanent slot', variant: 'destructive' });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase
          .from('vendor_permanent_availability')
          .insert(rows);

        if (error) {
          toast({
            title: 'Error',
            description: error.message || 'Failed to save permanent availability',
            variant: 'destructive',
          });
        } else {
          toast({ title: 'Success', description: 'Permanent availability saved!' });
        }
        setIsLoading(false);
        return;
      }

      // Temporary (weekly) availability logic
      const days = getNext10Days();
      
      // First, delete existing records for this vendor
      const { error: deleteError } = await supabase
        .from('vendor_weekly_availability')
        .delete()
        .eq('vendor_id', user.id);

      if (deleteError) {
        toast({
          title: 'Error',
          description: 'Failed to clear existing availability',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const rows = days.map(date => {
        const dateKey = date.toISOString().slice(0, 10);
        return {
          vendor_id: user.id,
          name: vendorName,
          mobile_no: mobileNo,
          services: selectedService,
          area: areasString, // Store all areas as JSON array
          societies: societiesString,
          date: dateKey,
          morning: !!selectedSlots[dateKey]?.morning,
          afternoon: !!selectedSlots[dateKey]?.afternoon,
          evening: !!selectedSlots[dateKey]?.evening,
        };
      });
      
      const { error } = await supabase
        .from('vendor_weekly_availability')
        .insert(rows);
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

  const filteredSocieties = selectedArea ? societies.filter(s => selectedArea.includes(s.area)) : [];

  const handleAreaToggle = (areaValue: string) => {
    setSelectedArea(prev => {
      if (prev.includes(areaValue)) {
        return prev.filter(area => area !== areaValue);
      } else {
        return [...prev, areaValue];
      }
    });
    setSelectedSocieties([]); // Reset societies when areas change
    setSelectedSlots({}); // Reset slots when areas change
  };

  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorHeader />
        <main className="max-w-lg mx-auto mt-10 p-6">
          <Card className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VendorHeader />
        {/* HERO SECTION START */}
        <section className="w-full bg-[#eaf3fa] py-8 rounded-b-3xl shadow-sm">
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center leading-tight drop-shadow-sm">Zyaada Kamaayein aur Apne Availability Ke Hisaab Se Kaam Karein.</h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-8 text-center">Work within your known society so you always feel safe.</p>
          </div>
        </section>
        {/* HERO SECTION END */}
        <main className="max-w-xl mx-auto mt-1 p-6">
          <Card className="p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="bg-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-center font-medium">
                Agar aap kuch extra income kamana chahte hain ya phir permanent kaam dhoondh rahe hain to yahan pe login karein aur apna free time use karein!
              </p>
            </div>
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
            <p className="text-center text-gray-600 mt-4 text-sm">
              Agar aapke pass email nahi hai to humme sampark karein +91 9321314553 pe aur hum aapki madad kar denge
            </p>
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
          suppressProfileUpdate={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <Card className="p-6 mb-8 w-full">
          <h2 className="text-lg font-semibold mb-4">Select Areas</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Select one or more areas where you want to work:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {areas.map(area => (
                <div key={area.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`area-${area.value}`}
                    checked={selectedArea.includes(area.value)}
                    onChange={() => handleAreaToggle(area.value)}
                    className="w-5 h-5 accent-indigo-600 mr-3"
                  />
                  <label htmlFor={`area-${area.value}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                    {area.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {selectedArea.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Select up to 2 Societies</h2>
              <ul className="mb-4 grid grid-cols-2 gap-2">
                {/* Any option */}
                <li key="Any" className="flex items-center">
                  <input
                    type="checkbox"
                    id="society-Any"
                    checked={selectedSocieties.includes('Any')}
                    disabled={!selectedSocieties.includes('Any') && selectedSocieties.length >= 2}
                    onChange={() => handleSocietyToggle('Any')}
                    className="w-5 h-5 accent-indigo-600 mr-2"
                  />
                  <label htmlFor="society-Any" className={`text-sm font-medium ${!selectedSocieties.includes('Any') && selectedSocieties.length >= 2 ? 'text-gray-400' : 'text-gray-900'}`}>Any</label>
                </li>
                {filteredSocieties.map(society => {
                  const isSelected = selectedSocieties.includes(society.name);
                  const isDisabled = !isSelected && selectedSocieties.length >= 2;
                  return (
                    <li key={society.name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`society-${society.name}`}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleSocietyToggle(society.name)}
                        className="w-5 h-5 accent-indigo-600 mr-2"
                      />
                      <label htmlFor={`society-${society.name}`} className={`text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>{society.name}</label>
                    </li>
                  );
                })}
                {/* Other option */}
                <li key="Other" className="flex items-center">
                  <input
                    type="checkbox"
                    id="society-Other"
                    checked={selectedSocieties.includes('Other')}
                    disabled={!selectedSocieties.includes('Other') && selectedSocieties.length >= 2}
                    onChange={() => handleSocietyToggle('Other')}
                    className="w-5 h-5 accent-indigo-600 mr-2"
                  />
                  <label htmlFor="society-Other" className={`text-sm font-medium ${!selectedSocieties.includes('Other') && selectedSocieties.length >= 2 ? 'text-gray-400' : 'text-gray-900'}`}>Other</label>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mb-4">You can select up to 2 societies.</p>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="service">Service</Label>
                  <select
                    id="service"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Cooking">Cook</option>
                    <option value="Cleaning">Cleaner</option>
                    <option value="Both">Both (Cook and Cleaner)</option>
                    <option value="Nanny">Nanny</option>
                    <option value="Driver">Driver</option>
                    <option value="Full Time Help">Full Time Help</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </Card>
        <Card className="p-6 mb-8 w-full">
          <h2 className="text-xl font-semibold mb-4">Set Your Availability</h2>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('permanent')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'permanent'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Permanent Availability
            </button>
            <button
              onClick={() => setActiveTab('temporary')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'temporary'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Temporary Availability
            </button>
          </div>

          {/* Permanent Availability Tab */}
          {activeTab === 'permanent' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Permanent Availability</h3>
              <p className="text-gray-600 mb-4">Select your regular availability slots:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PERMANENT_SLOTS.map(slot => (
                  <div key={slot.id} className="flex items-center p-4 border border-gray-200 rounded-lg bg-white">
                    <input
                      type="checkbox"
                      id={slot.id}
                      checked={permanentSlots[slot.id]}
                      onChange={() => handlePermanentSlotToggle(slot.id)}
                      className="w-5 h-5 accent-indigo-600 mr-3"
                    />
                    <label htmlFor={slot.id} className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">{slot.label}</div>
                      <div className="text-sm text-gray-500">{slot.start} - {slot.end}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Temporary Availability Tab */}
          {activeTab === 'temporary' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Next 10 Days Availability</h3>
              <div className="overflow-x-auto">
                <table className="w-full border text-center table-auto">
                  <thead>
                    <tr>
                      <th className="border px-3 py-2 bg-gray-100 text-base font-semibold whitespace-nowrap min-w-[160px]">Date</th>
                      {PERMANENT_SLOTS.map(slot => (
                        <th key={slot.id} className="border px-3 py-2 bg-gray-100 text-base font-semibold">{slot.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getNext10Days().map(date => {
                      const dateKey = date.toISOString().slice(0, 10);
                      return (
                        <tr key={dateKey}>
                          <td className="border px-3 py-2 font-medium whitespace-nowrap min-w-[160px] bg-white">
                            {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          {PERMANENT_SLOTS.map(slot => (
                            <td key={slot.id} className="border px-3 py-2 bg-white">
                              <input
                                type="checkbox"
                                checked={!!selectedSlots[dateKey]?.[slot.id]}
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
            </div>
          )}

          <Button className="mt-6 w-full" onClick={handleSaveAvailability} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Availability'}
          </Button>
        </Card>
      </main>
    </div>
  );
}
