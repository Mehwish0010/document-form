"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const forms = [
  {
    id: "form1",
    title: "Employment Application Form",
    description: "Collects essential candidate details, work history, and qualifications for initial screening.",
    category: "employment form 01",
    status: "Active",
    route: "/form7",
    color: "from-blue-500 to-blue-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: "form2",
    title: "Arrest Conviction and Certification Form",
    description: "Documents an individual's criminal history or certifies a clear record, ensuring compliance with legal and employment requirements.",
    category: "employment form 02",
    status: "Active",
    route: "/forms",
    color: "from-emerald-500 to-emerald-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "form3",
    title: "Behavior Analysis and Therapy Partners (BATP)",
    description: "Outlines professional standards, ethical guidelines, and compliance policies for staff to ensure responsible and lawful conduct.",
    category: "employment form 03",
    status: "Active",
    route: "/form4",
    color: "from-purple-500 to-purple-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
  },
  {
    id: "form4",
    title: "Behavior Analysis & Therapy Partners (Confidentiality Agreement)",
    description: "A dedicated organization providing evidence-based behavioral therapy services to support individual growth and well-being.",
    category: "employment form 04",
    status: "Active",
    route: "/form1",
    color: "from-orange-500 to-orange-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  
  {
    id: "form5",
    title: "Employment Eligibility Verification Form",
    description: "A mandatory form used to verify an employee's identity and authorization to work in the United States.",
    category: "employment form 05",
    status: "Active",
    route: "/form8",
    color: "from-indigo-500 to-indigo-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    id: "form6",
    title: "Residence Certification Form",
    description: "Certifies an employee's residence information for proper local earned income tax withholding.",
    category: "employment form 06",
    status: "Active",
    route: "/form9",
    color: "from-pink-500 to-pink-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: "form7",
    title: "Employment Application /Provisional Employment",
    description: "Discloses the applicant's criminal history as required for positions involving contact with children under Pennsylvania law.",
    category: "employment form 07",
    status: "Active",
    route: "/form6",
    color: "from-teal-500 to-teal-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    id: "form8",
    title: "Employee's Withholding Certificate",
    description: "Determines the amount of federal income tax to withhold from an employee's paycheck.",
    category: "employment form 08",
    status: "Active",
    route: "/formlast",
    color: "from-cyan-500 to-cyan-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 009.5 18h5a2 2 0 002-1.5L16 8m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v1"
        />
      </svg>
    ),
  },
  {
    id: "form9",
    title: "Commonwealth of Pennsylvania (Sexual Misconduct/Abuse Disclosure Release)",
    description: "A dedicated organization providing evidence-based behavioral therapy services to support individual growth and well-being.",
    category: "employment form 09",
    status: "Active",
    route: "/formnew",
    color: "from-orange-500 to-orange-600",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

const categories = [
  { name: "Employment Application Form", link: "/form7" },
  { name: "Arrest Conviction Form", link: "/forms" },
  { name: "Behavior Analysis and Therapy Partner", link: "/form1" },
  { name: "(BATP)Confidentiality Agreement", link: "/form4" },
  { name: "Employment Eligibility Form", link: "/form8" },
  { name: "Residence Certification Form", link: "/form9" },
  { name: "Employment/Provicional Application", link: "/form6" },
  { name: "Employee's Withholding Certification", link: "/formlast" },
  { name: "Employee's Commonwealth of Pennsylvania", link: "/formnew" },
];


export default function FormsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredForms = forms.filter((form) => {
    const matchesCategory = selectedCategory === "All" || form.category === selectedCategory
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
          <div className="py-8">
   
          

<div className="text-center">
  <div className="inline-flex items-center justify-center w-28 h-24  rounded-2xl mb-4 shadow-lg">
    <Image
      src="/clientform.webp" // ✅ Your custom image path
      alt="Form Icon"
      width={60}
      height={48}
      className="w-24 h-20 object-contain"
    />
  </div>

  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight sm:leading-tight">
    Employee Onboarding Forms
  </h1>

  

  <p className="text-xl font-medium text-gray-600 max-w-4xl mx-auto leading-relaxed">
  
  

By submitting these forms, I confirm that all information provided is accurate, complete, and submitted by me personally, and I understand that any false, misleading, or incomplete information may impact my eligibility for employment.
  </p>


</div>
</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
       

<div className="flex flex-wrap justify-center gap-2">
  {categories.map((category) => (
    <Link href={category.link} key={category.name}>
      <button
        onClick={() => setSelectedCategory(category.name)}
        className={`px-6 py-2 rounded-full  border-gray-400-2 text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
          selectedCategory === category.name
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
        }`}
      >
        {category.name}
      </button>
    </Link>
  ))}
</div>

        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredForms.map((form, index) => (
            <Link key={form.id} href={form.route} className="group">
              <div
                className={`relative h-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Header */}
                <div className={`h-24 bg-gradient-to-r ${form.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                </div>

                {/* Icon */}
                <div className="absolute top-16 left-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform duration-300">
                    {form.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 p-6">
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${form.color} text-white`}
                    >
                      {form.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {form.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{form.description}</p>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      <span>Access Form</span>
                      <svg
                        className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Final Submit Button before Footer */}
        

        {/* Footer */}
        <footer className="relative mt-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-transparent rounded-xl mb-4">
              <Image src="/clientform.webp" alt="logo" height={52} width={58}/>
              </div>
              <h3 className="text-2xl font-bold mb-2">Behaviour Analysis & Therapy Partners</h3>
              <p className="text-white-400 mb-6">Secure • Compliant • Professional</p>
              <div className="flex justify-center space-x-6 text-sm text-gray-white">
                <span>© 2025 All rights reserved</span>
                <span>•</span>
                <Link href="/privacy-policy">
  <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>
</Link>
                <span>•</span>
                <Link href="/terms-of-services">
  <span className="text-white hover:underline cursor-pointer">Terms of Services</span>
</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
