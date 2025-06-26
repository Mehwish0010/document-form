'use client';

import React, { useEffect, useState } from 'react';

export interface JobApplicationData {
  fullName: string;
  jobRole: string;
  location: string;
}

interface JobApplicationFieldsProps {
  onDataLoad?: (data: JobApplicationData) => void;
  showInForm?: boolean;
}

export default function JobApplicationFields({ onDataLoad, showInForm = true }: JobApplicationFieldsProps) {
  const [jobData, setJobData] = useState<JobApplicationData>({
    fullName: '',
    jobRole: '',
    location: ''
  });

  useEffect(() => {
    const storedData = localStorage.getItem('jobApplicationData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setJobData(parsedData);
      if (onDataLoad) {
        onDataLoad(parsedData);
      }
    }
  }, [onDataLoad]);

  if (!showInForm) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-3 text-sm uppercase">Job Application Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
          <input 
            type="text" 
            name="fullName"
            value={jobData.fullName}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Job Role</label>
          <input 
            type="text" 
            name="jobRole"
            value={jobData.jobRole}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
          <input 
            type="text" 
            name="location"
            value={jobData.location}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export function getJobApplicationData(): JobApplicationData | null {
  if (typeof window === 'undefined') return null;
  
  const storedData = localStorage.getItem('jobApplicationData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
} 