'use client';

import React from 'react';

export interface JobApplicationFieldsValue {
  jobAppFullName: string;
  jobRole: string;
  location: string;
}

interface JobApplicationFieldsProps {
  value: JobApplicationFieldsValue;
  onChange: (value: JobApplicationFieldsValue) => void;
}

export default function JobApplicationFields({ value, onChange }: JobApplicationFieldsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({
      ...value,
      [name]: inputValue,
    });
  };

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl text-center font-semibold text-white bg-black">Job Application Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mt-4 sm:mt-6 items-center">
        <div className="flex flex-col gap-2">
          <label htmlFor="jobAppFullName" className="text-sm sm:text-base font-semibold text-gray-700">Full Name:</label>
          <input
            type="text"
            id="jobAppFullName"
            name="jobAppFullName"
            value={value.jobAppFullName}
            onChange={handleInputChange}
            className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 border-b border-black p-0"
            placeholder="Enter your full name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="jobRole" className="text-sm sm:text-base font-semibold text-gray-700">Job Role:</label>
          <input
            type="text"
            id="jobRole"
            name="jobRole"
            value={value.jobRole}
            onChange={handleInputChange}
            className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 border-b border-black p-0"
            placeholder="Enter job role"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-sm sm:text-base font-semibold text-gray-700">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={value.location}
            onChange={handleInputChange}
            className="w-full outline-none placeholder:text-gray-400 text-black bg-transparent focus:ring-0 border-b border-black p-0"
            placeholder="Enter location"
          />
        </div>
      </div>
    </div>
  );
}

export function getJobApplicationData(): JobApplicationFieldsValue | null {
  if (typeof window === 'undefined') return null;
  
  const storedData = localStorage.getItem('jobApplicationData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
} 