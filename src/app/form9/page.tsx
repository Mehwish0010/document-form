'use client';

import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const ResidencyCertificationForm = () => {
  const [formData, setFormData] = useState({
    jobAppFullName: '',
    jobRole: '',
    location: '',
    name: '',
    ssn1: '',
    ssn2: '',
    ssn3: '',
    ssn4: '',
    ssn5: '',
    ssn6: '',
    ssn7: '',
    ssn8: '',
    ssn9: '',
    streetAddress: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    municipality: '',
    county: '',
    residentPsd: '',
    residentRate: '',
    employerName: '',
    ein1: '',
    ein2: '',
    ein3: '',
    ein4: '',
    ein5: '',
    ein6: '',
    ein7: '',
    ein8: '',
    ein9: '',
    employerStreet: '',
    employerAddress2: '',
    employerCity: '',
    employerState: '',
    employerZip: '',
    employerPhone: '',
    employerMunicipality: '',
    employerCounty: '',
    workPsd: '',
    nonResRate: '',
    employeeSignature: '',
    date: '',
    employeePhone: '',
    email: '',
  });
  const signatureRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jobApplicationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          jobAppFullName: parsed.fullName || '',
          jobRole: parsed.jobRole || '',
          location: parsed.location || '',
        }));
      } catch {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name}:`, value); // Debug log
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      console.log('New form data:', newData); // Debug log
      // Clear message on change
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Current form data:', formData);
    
    // Check required fields
    const requiredFields = {
      name: 'Name',
      streetAddress: 'Street Address',
      city: 'City',
      state: 'State',
      zip: 'Zip Code',
      phone: 'Phone Number',
      municipality: 'Municipality',
      county: 'County',
      residentPsd: 'Resident PSD Code',
      residentRate: 'Resident Rate',
      employerName: 'Employer Name',
      employerStreet: 'Employer Street Address',
      employerCity: 'Employer City',
      employerState: 'Employer State',
      employerZip: 'Employer Zip Code',
      employerPhone: 'Employer Phone',
      employerMunicipality: 'Employer Municipality',
      employerCounty: 'Employer County',
      workPsd: 'Work PSD Code',
      nonResRate: 'Non-Resident Rate',
      employeeSignature: 'Signature',
      date: 'Date',
      employeePhone: 'Employee Phone',
      email: 'Email'
    };

    // Debug each field
    Object.entries(requiredFields).forEach(([key, label]) => {
      const value = formData[key as keyof typeof formData];
      console.log(`${label}:`, value, typeof value);
    });

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => {
        const value = formData[key as keyof typeof formData];
        return !value || (typeof value === 'string' && value.trim() === '');
      })
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      console.log('Form data state:', formData);
      showNotification('error', `Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      console.log('Attempting to submit form data:', formData);

      const { ein1, ein2, ein3, ein4, ein5, ein6, ein7, ein8, ein9, ...rest } = formData;
      const submissionData = {
        ...rest,
        ein: [ein1, ein2, ein3, ein4, ein5, ein6, ein7, ein8, ein9].join(''),
        jobAppFullName: formData.jobAppFullName,
        jobRole: formData.jobRole,
        location: formData.location
      };
      
      const response = await fetch('/api/form9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        showNotification('success', 'Your form has been submitted successfully! Thank you.');
        setFormData({
          jobAppFullName: '',
          jobRole: '',
          location: '',
          name: '',
          ssn1: '',
          ssn2: '',
          ssn3: '',
          ssn4: '',
          ssn5: '',
          ssn6: '',
          ssn7: '',
          ssn8: '',
          ssn9: '',
          streetAddress: '',
          address2: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          municipality: '',
          county: '',
          residentPsd: '',
          residentRate: '',
          employerName: '',
          ein1: '',
          ein2: '',
          ein3: '',
          ein4: '',
          ein5: '',
          ein6: '',
          ein7: '',
          ein8: '',
          ein9: '',
          employerStreet: '',
          employerAddress2: '',
          employerCity: '',
          employerState: '',
          employerZip: '',
          employerPhone: '',
          employerMunicipality: '',
          employerCounty: '',
          workPsd: '',
          nonResRate: '',
          employeeSignature: '',
          date: '',
          employeePhone: '',
          email: '',
        });
        if (signatureRef.current) {
          signatureRef.current.clear();
        }
      } else {
        showNotification('error', data.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'Failed to submit form. Please try again.');
    }
  };

  const handleSignatureChange = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      setFormData(prev => ({ ...prev, employeeSignature: signatureData }));
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setFormData({ ...formData, employeeSignature: '' });
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    const div = document.createElement('div');
    div.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
      type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    } px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100`;
    div.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success'
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(div);
    setTimeout(() => {
      div.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => div.remove(), 300);
    }, 5000);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-6 font-serif text-[11px] sm:text-[13px] leading-tight text-black shadow-lg">
      <form onSubmit={handleSubmit} className=''>
      <h1 className="text-center text-xl sm:text-2xl font-bold uppercase mt-4 sm:mt-10 text-black">RESIDENCY CERTIFICATION FORM</h1>
      <p className="text-center font-bold mb-2 sm:mb-4 uppercase border-black pb-1 sm:pb-2 text-base sm:text-lg text-black">Local Earned Income Tax Withholding</p>
      <hr className="border-t-2 border-black full mx-auto" />
      <hr className="border-t-2 border-black w-full mx-auto my-0.5" />
      <h2 className='text-center text-[0.7rem] sm:text-[0.8rem] font-bold mt-4 sm:mt-8 uppercase text-black'>TO EMPLOYERS/TAXPAYERS</h2>
      <p className="text-xs sm:text-sm text-bold text-black">
        This form is to be used by employers and taxpayers to report essential information for the collection and distribution of Local Earned Income Taxes to the local EIT collector. This form must be used by employers when a new employee is hired or when a current employee notifies employer of a name or address change. Use the Address Search Application at dced.pa.gov/Act32 to determine PSD codes, EIT rates, and tax collector contact information.
      </p>

      {/* Job Application Information */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-center bg-black text-white py-2 rounded">Job Application Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="jobAppFullName"
              value={formData.jobAppFullName}
              onChange={handleChange}
              className="w-full border-b border-black px-2 py-1"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Job Role</label>
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              className="w-full border-b border-black px-2 py-1"
              placeholder="Enter job role"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border-b border-black px-2 py-1"
              placeholder="Enter location"
              required
            />
          </div>
        </div>
      </section>

      {/* RESIDENCE LOCATION */}
      <div className="mt-2 border-1 border-black">
        <h2 className="bg-black text-white px-2 sm:px-4 py-1 font-semibold text-center uppercase text-base sm:text-lg">EMPLOYEE INFORMATION – RESIDENCE LOCATION</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="col-span-1 sm:col-span-2 flex items-start border-r pr-2 relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Name (Last, First, Middle Initial)</div>
            <input 
              name="name" 
              value={formData.name}
              onChange={handleChange} 
              className="w-full p-2 sm:p-3 pt-5 sm:pt-6 uppercase text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="flex flex-col pl-0.5 mt-1 text-sm sm:text-base">
            <div className="text-[0.6rem] sm:text-[0.7rem] uppercase text-black">Social Security Number</div>
            <div className="flex items-center">
              <input
                name="ssn1"
                value={formData.ssn1}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn2"
                value={formData.ssn2}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn3"
                value={formData.ssn3}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn4"
                value={formData.ssn4}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn5"
                value={formData.ssn5}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn6"
                value={formData.ssn6}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn7"
                value={formData.ssn7}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn8"
                value={formData.ssn8}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ssn9"
                value={formData.ssn9}
                maxLength={1}
                onChange={handleChange}
                className="w-5 sm:w-6 border p-1 text-center uppercase border-r text-[11px] sm:text-[13px]"
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-2 top-1 uppercase mt-1 text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Street Address (No PO Box, RD or RR)</div>
          <input 
            name="streetAddress" 
            value={formData.streetAddress}
            onChange={handleChange} 
            className="w-full border p-2 sm:p-3 pt-5 sm:pt-6 mt-2 uppercase text-[11px] sm:text-[13px]" 
          />
        </div>
        <div className="relative">
          <div className="absolute left-2 top-1 uppercase mt-1 text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Address Line 2</div>
          <input 
            name="address2" 
            value={formData.address2}
            onChange={handleChange} 
            className="w-full border-t border p-2 sm:p-3 pt-5 sm:pt-6 mt-2 uppercase text-[11px] sm:text-[13px]" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-2 align-text-top border">
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">City</div>
            <input 
              name="city" 
              value={formData.city}
              onChange={handleChange} 
              className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">State</div>
            <input 
              name="state" 
              value={formData.state}
              onChange={handleChange} 
              className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Zip Code</div>
            <input 
              name="zip" 
              value={formData.zip}
              onChange={handleChange} 
              className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Daytime Phone Number</div>
            <input 
              name="phone" 
              value={formData.phone}
              onChange={handleChange} 
              className="p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="w-full border">
            <div className="text-[0.6rem] uppercase text-black">MUNICIPALITY (City, Borough or Township)</div>
            <input 
              name="municipality" 
              value={formData.municipality}
              onChange={handleChange} 
              className="w-full p-2 sm:p-3 uppercase text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-2 border">
            <div className="flex flex-col border-r">
              <div className="text-[0.6rem] uppercase text-black">COUNTY</div>
              <input 
                name="county" 
                value={formData.county}
                onChange={handleChange} 
                className="w-full p-2 sm:p-3 uppercase text-[11px] sm:text-[13px]" 
              />
            </div>
            <div className="grid grid-cols-2 bg-gray-200">
              <div className="flex flex-col bg-gray-200 border-r">
                <div className="text-[0.6rem] uppercase text-black">RESIDENT PSD CODE</div>
                <input 
                  name="residentPsd" 
                  value={formData.residentPsd}
                  onChange={handleChange} 
                  className="w-full p-2 sm:p-3 bg-gray-200 uppercase text-[11px] sm:text-[13px]" 
                />
              </div>
              <div className="flex flex-col bg-gray-200 border-r">
                <div className="text-[0.6rem] uppercase text-black">TOTAL RESIDENT EIT RATE</div>
                <input 
                  name="residentRate" 
                  value={formData.residentRate}
                  onChange={handleChange} 
                  className="w-full p-2 sm:p-3 uppercase text-[11px] sm:text-[13px]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMPLOYMENT LOCATION */}
      <div className="mt-2 border border-black">
        <h2 className="bg-black text-white px-2 py-1 font-semibold text-center uppercase text-base sm:text-lg">EMPLOYER INFORMATION – EMPLOYMENT LOCATION</h2>
        <div className="grid grid-cols-3 gap-2 mt-2 border">
          <div className="col-span-2 flex items-start border-r pr-2 relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Employer Business Name (Use Federal ID Name)</div>
            <input name="employerName" value={formData.employerName} onChange={handleChange} className="w-full p-2 sm:p-3 pt-5 sm:pt-6 uppercase text-[11px] sm:text-[13px]" />
          </div>
          <div className="flex flex-col pl-0.5 ">
            <div className="text-[0.6rem] uppercase text-black">EMPLOYER FEIN</div>
            <div className="flex items-center">
              <input
                name="ein1"
                value={formData.ein1}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein2"
                value={formData.ein2}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein3"
                value={formData.ein3}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein4"
                value={formData.ein4}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein5"
                value={formData.ein5}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein6"
                value={formData.ein6}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein7"
                value={formData.ein7}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein8"
                value={formData.ein8}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value.length === 1) {
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                  handleChange(e);
                }}
                className="w-5 sm:w-6 border border-r-0 border-l-0 border-t border-b p-1 text-center uppercase text-[11px] sm:text-[13px]"
              />
              <input
                name="ein9"
                value={formData.ein9}
                maxLength={1}
                onChange={handleChange}
                className="w-5 sm:w-6 border border-t border-b border-r p-1 text-[11px] sm:text-[13px]"
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-2 top-1 uppercase mt-1 text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Employer Street Address (No PO Box, RD or RR)</div>
          <input name="employerStreet" value={formData.employerStreet} onChange={handleChange} className="w-full border p-2 sm:p-3 pt-5 sm:pt-6 mt-2 uppercase text-[11px] sm:text-[13px]" />
        </div>
        <div className="relative">
          <div className="absolute left-2 top-1 mt-1 text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Address Line 2</div>
          <input name="employerAddress2" value={formData.employerAddress2} onChange={handleChange} className="w-full border p-2 sm:p-3 pt-5 sm:pt-6 mt-2 uppercase text-[11px] sm:text-[13px]" />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-2 align-text-top border">
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">City</div>
            <input 
              name="employerCity" 
              value={formData.employerCity}
              onChange={handleChange} 
              className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">State</div>
            <input 
              name="employerState" 
              value={formData.employerState}
              onChange={handleChange} 
              className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Zip Code</div>
            <input 
              name="employerZip" 
              value={formData.employerZip}
              onChange={handleChange} 
              className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Daytime Phone Number</div>
            <input 
              name="employerPhone" 
              value={formData.employerPhone}
              onChange={handleChange} 
              className="p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
        </div>
       

        <div className="flex flex-col gap-2 mt-2">
          <div className="w-full border-t border-black">
            <div className="text-[0.6rem] uppercase text-black">MUNICIPALITY (City, Borough or Township)</div>
            <input 
              name="employerMunicipality" 
              value={formData.employerMunicipality}
              onChange={handleChange} 
              className="w-full p-2 sm:p-3 uppercase text-[11px] sm:text-[13px]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-2 border">
            <div className="flex flex-col border-r">
              <div className="text-[0.6rem] uppercase text-black">COUNTY</div>
              <input name="employerCounty" value={formData.employerCounty} onChange={handleChange} className="w-full p-2 sm:p-3 uppercase text-[11px] sm:text-[13px]" />
            </div>
            <div className="grid grid-cols-2 bg-gray-200">
              <div className="flex flex-col bg-gray-200 border-r">
                <div className="text-[0.6rem] uppercase text-black">WORK LOCATION PSD CODE</div>
                <input name="workPsd" value={formData.workPsd} onChange={handleChange} className="w-full p-2 sm:p-3 bg-gray-200 uppercase text-[11px] sm:text-[13px]" />
              </div>
              <div className="flex flex-col bg-gray-200 border-r">
                <div className="text-[0.6rem] uppercase text-black">WORK LOCATION NON-RESIDENT EIT RATE</div>
                <input name="nonResRate" value={formData.nonResRate} onChange={handleChange} className="w-full p-2 sm:p-3 uppercase text-[11px] sm:text-[13px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CERTIFICATION */}
      <div className="mt-2 max-w-7xl border border-black">
        <h2 className="bg-black text-white px-2 py-1 font-semibold text-center uppercase text-base sm:text-lg">CERTIFICATION</h2>
        <p className="text-xs sm:text-sm mt-1 text-black">Under penalties of perjury, I (we) declare that I (we) have examined this information...</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 border">
          <div className="col-span-1 sm:col-span-2 relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Signature of Employee</div>
            <div className="flex items-center gap-x-2 mt-6">
              <div className="flex-grow border-b border-black pb-1" style={{ height: '80px' }}>
                <SignatureCanvas
                  ref={signatureRef}
                  penColor='black'
                  canvasProps={{ 
                    className: 'sigCanvas', 
                    width: 300, 
                    height: 80 
                  }}
                  clearOnResize={false}
                  backgroundColor='rgba(0,0,0,0)'
                  onEnd={handleSignatureChange}
                />
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[10px] sm:text-xs mt-16 sm:mt-20 text-red-600 hover:text-red-800 px-1 sm:px-2 py-1 border border-red-600 rounded hover:bg-red-50"
              >
                Clear Signature
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 mt-20 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Date (MM/DD/YYYY)</div>
            <input 
              name="date" 
              value={formData.date}
              onChange={handleChange} 
              className="p-2 sm:p-3 pt-5 sm:pt-6 mt-20 uppercase w-full text-[11px] sm:text-[13px]" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 border">
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Phone Number</div>
            <input name="employeePhone" value={formData.employeePhone} onChange={handleChange} className="border-r p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" />
          </div>
          <div className="relative">
            <div className="absolute left-2 top-1 uppercase text-black pointer-events-none text-[0.6rem] sm:text-[0.7rem]">Email Address</div>
            <input name="email" value={formData.email} onChange={handleChange} className="p-2 sm:p-3 pt-5 sm:pt-6 uppercase w-full text-[11px] sm:text-[13px]" />
          </div>
        </div>
      </div>

      <p className="mt-4 sm:mt-8 text-xs sm:text-sm text-center text-bold italic border-2 border-black p-3 sm:p-6 text-black">
        For information on obtaining the appropriate MUNICIPALITY, PSD CODES, and EIT RATES visit:<br />
        <a href="https://dced.pa.gov/Act32" target="_blank" className="text-blue-700 underline">dced.pa.gov/Act32</a>
      </p>
      <div className="mt-4 sm:mt-8 flex flex-col items-center">
        <button
          type="submit"
          className="bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 uppercase font-semibold text-xs sm:text-sm w-full sm:w-auto"
        >
          Submit Form
        </button>
      </div>
      </form>
    </div>
  );
};

export default ResidencyCertificationForm;
