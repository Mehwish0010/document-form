"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function JobApplicationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    jobRole: "",
    location: "",
  })
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('jobApplicationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          fullName: parsed.fullName || "",
          jobRole: parsed.jobRole || "",
          location: parsed.location || "",
        }));
      } catch {}
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store job application data in localStorage
    localStorage.setItem('jobApplicationData', JSON.stringify({
      fullName: formData.fullName,
      jobRole: formData.jobRole,
      location: formData.location,
      submittedAt: new Date().toISOString()
    }))
    // Redirect to all-forms page (client-side)
    router.push("/all-forms")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              {/* Logo and Company Name */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center shadow-lg">
                  <Image 
                    src="/clientform.webp" 
                    alt="Company Logo" 
                    width={42} 
                    height={52}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Behavior Analysis &
                  </h1>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Therapy Partners
                  </h2>
                </div>
              </div>

              {/* Navigation */}
            

              {/* Back to Forms Button */}
              <Link
                href="/"
                className="bg-blue-600  text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Forms</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-lg rounded-t-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-600  px-8 py-16 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Join Our Team</h1>
              <p className="text-blue-100 text-xl max-w-md mx-auto leading-relaxed">
                Start your journey with us. Complete the initial application and access all required forms.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            {/* Full Name */}
            <div className="space-y-3">
              <label htmlFor="fullName" className="block text-lg font-semibold text-gray-800">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-gray-300"
                placeholder="Enter your full name"
              />
            </div>

            {/* Job Role */}
            <div className="space-y-3">
              <label htmlFor="jobRole" className="block text-lg font-semibold text-gray-800">
                Job Role *
              </label>
              <select
                id="jobRole"
                name="jobRole"
                required
                value={formData.jobRole}
                onChange={handleInputChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-gray-300"
              >
                <option value="">Select a job role</option>
                <option value="behavior-analyst">Behavior Analyst</option>
                <option value="therapy-assistant">Therapy Assistant</option>
                <option value="clinical-supervisor">Clinical Supervisor</option>
                <option value="administrative">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 mb-4">Select Location *</label>
              <div className="space-y-4">
                <label className="flex items-center p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group">
                  <input
                    type="radio"
                    name="location"
                    value="bala-cynwyd"
                    checked={formData.location === "bala-cynwyd"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Bala Cynwyd Office</span>
                    <p className="text-gray-600 mt-1">Main headquarters location</p>
                  </div>
                </label>
                <label className="flex items-center p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group">
                  <input
                    type="radio"
                    name="location"
                    value="philadelphia"
                    checked={formData.location === "philadelphia"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Philadelphia Office</span>
                    <p className="text-gray-600 mt-1">Downtown Philadelphia location</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Forms Link Section */}
      

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-blue-600  text-white py-5 px-8 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-0 bg-blue-600  backdrop-blur-lg p-8 shadow-2xl border-t border-white/20 w-full">
          <div className="max-w-6xl mx-auto">
            {/* Company Description */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-white/20">
                  <Image 
                    src="/clientform.webp" 
                    alt="BATP Logo" 
                    width={32} 
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">
                    Behavior Analysis & Therapy Partners
                  </h3>
                </div>
              </div>
              <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto">
                Behavior Analysis & Therapy Partners (BATP) is devoted to providing behavioral health care to those under 21 years of age. Starting in 2006, we are now a large company with 3 offices serving families in Philadelphia and the 3 surrounding counties: Montgomery, Bucks and Delaware.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mb-8">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-medium shadow-lg">
                If you want help for your family Contact Us
              </button>
              <button className="px-6 py-3 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors font-medium">
                If you want to join our team Click Here
              </button>
            </div>

            {/* Explore Links */}
            <div className="border-t border-white/30 pt-8 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">Explore</h4>
              <div className="flex justify-center space-x-8">
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/services" className="text-white/80 hover:text-white transition-colors">
                  Services
                </Link>
                <Link href="/join-team" className="text-white/80 hover:text-white transition-colors">
                  Join Our Team
                </Link>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="flex justify-center space-x-6 mb-4">
              <Link href="/legal" className="text-white/80 hover:text-white transition-colors text-sm">
                Legal / Privacy
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center text-white/60 text-sm">
              <p>Copyright © 2025 BATP, All Rights Reserved</p>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}