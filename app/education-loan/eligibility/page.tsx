'use client'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function EligibilityPage() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    has_college_letter: false,
    courseType: '',
    courseDuration: '',
    loanAmount: '',
    loanTenure: ''
  })
  const router = useRouter()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/education-loan?eligible=yes')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Education Loan</h1>
              <p className="text-lg md:text-xl text-white/90 mb-4 text-center">
                Check your eligibility for an education loan
              </p>
            </div>
          </div>
        </section>
        <div className="max-w-md w-full mx-auto mt-4 mb-2 flex justify-center md:justify-start">
          <Link href="/education-loan">
            <Button variant="secondary" className="rounded-lg">
              ← Back to Education Loan
            </Button>
          </Link>
        </div>
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-4 mt-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">Check Your Eligibility</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={value => handleInputChange('gender', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Do you have a college offer letter?</Label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="has_college_letter"
                    value="yes"
                    checked={formData.has_college_letter === true}
                    onChange={() => handleInputChange('has_college_letter', true)}
                    required
                    className="accent-purple-700"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="has_college_letter"
                    value="no"
                    checked={formData.has_college_letter === false}
                    onChange={() => handleInputChange('has_college_letter', false)}
                    required
                    className="accent-purple-700"
                  />
                  No
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="courseType">Course Type</Label>
              <Select
                value={formData.courseType}
                onValueChange={value => handleInputChange('courseType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="courseDuration">Course Duration (months)</Label>
              <Input
                id="courseDuration"
                type="number"
                placeholder="Enter course duration in months"
                value={formData.courseDuration}
                onChange={e => handleInputChange('courseDuration', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="loanAmount">Desired Loan Amount</Label>
              <Input
                id="loanAmount"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter desired loan amount"
                value={formData.loanAmount}
                onChange={e => handleInputChange('loanAmount', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="loanTenure">Desired Loan Tenure (months)</Label>
              <Input
                id="loanTenure"
                type="number"
                placeholder="Enter desired tenure in months"
                value={formData.loanTenure}
                onChange={e => handleInputChange('loanTenure', e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-4">Check Eligibility</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
} 