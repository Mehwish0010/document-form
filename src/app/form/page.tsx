'use client';

import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ArrestConvictionForm() {
  const [formData, setFormData] = React.useState({
    // Job application fields
    fullName: '',
    jobRole: '',
    location: '',
    // Form fields
    fullNameForm: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    otherNames: '',
    hasNotBeenArrestedOrConvicted: false,
    hasBeenArrestedOrConvicted: false,
    arrestDetail1: '',
    arrestDetail2: '',
    hasNotBeenPerpetratorChildAbuse: false,
    hasBeenPerpetratorChildAbuse: false,
    date: '',
    signature: '',
  });

  const signaturePadRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jobApplicationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          fullName: parsed.fullName || '',
          jobRole: parsed.jobRole || '',
          location: parsed.location || '',
        }));
      } catch {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    const div = document.createElement('div');
    div.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signatureDataUrl = signaturePadRef.current?.toDataURL() || '';
      
      // Ensure all required fields are filled
      if (!formData.fullNameForm || !formData.dobDay || !formData.dobMonth || !formData.dobYear || 
          !formData.date || !signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        showNotification('error', 'Please fill in all required fields');
        return;
      }

      // Prepare the data
      const formDataToSend = {
        fullName: formData.fullName,
        jobRole: formData.jobRole,
        location: formData.location,
        fullNameForm: formData.fullNameForm.trim(),
        dobDay: formData.dobDay,
        dobMonth: formData.dobMonth,
        dobYear: formData.dobYear,
        otherNames: formData.otherNames.trim(),
        hasNotBeenArrestedOrConvicted: formData.hasNotBeenArrestedOrConvicted,
        hasBeenArrestedOrConvicted: formData.hasBeenArrestedOrConvicted,
        arrestDetail1: formData.arrestDetail1.trim(),
        arrestDetail2: formData.arrestDetail2.trim(),
        hasNotBeenPerpetratorChildAbuse: formData.hasNotBeenPerpetratorChildAbuse,
        hasBeenPerpetratorChildAbuse: formData.hasBeenPerpetratorChildAbuse,
        date: formData.date,
        signature: signatureDataUrl
      };

      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend)
      });

      const result = await response.json();
      if (response.ok && result.success) {
        // Save job application fields to localStorage
        localStorage.setItem('jobApplicationData', JSON.stringify({
          fullName: formData.fullName,
          jobRole: formData.jobRole,
          location: formData.location
        }));
        showNotification('success', 'Form submitted successfully!');
        setFormData({
          fullName: '',
          jobRole: '',
          location: '',
          fullNameForm: '',
          dobDay: '',
          dobMonth: '',
          dobYear: '',
          otherNames: '',
          hasNotBeenArrestedOrConvicted: false,
          hasBeenArrestedOrConvicted: false,
          arrestDetail1: '',
          arrestDetail2: '',
          hasNotBeenPerpetratorChildAbuse: false,
          hasBeenPerpetratorChildAbuse: false,
          date: '',
          signature: '',
        });
        signaturePadRef.current?.clear();
      } else {
        showNotification('error', result.error || 'Failed to submit form');
      }
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Error submitting form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 relative">
      {/* Abstract yellow/orange background shape */}
      <div className="absolute right-0 top-0 w-2/5 h-full z-0">
        <div className="w-full h-full bg-gradient-to-br from-yellow-300 via-orange-200 to-yellow-400 rounded-bl-[120px] rounded-tl-[80px]" style={{ filter: 'blur(2px)' }}></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-white/80">
        {/* Left: Main Form */}
        <div className="flex-1 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 uppercase text-gray-800">ARREST/CONVICTION REPORT</h1>
          <h2 className="text-base sm:text-lg mb-8 text-gray-600">(under Act 24 of 2011 and Act 82 of 2012)</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal Information */}
            <div>
              <h3 className="font-bold text-lg mb-4">Section 1. Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Legal Name *</label>
                  <input type="text" name="fullNameForm" value={formData.fullNameForm} onChange={handleChange} className="w-full border-b border-black focus:outline-none focus:border-yellow-500 px-2 py-1" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Day *</label>
                    <select name="dobDay" value={formData.dobDay} onChange={handleChange} className="w-full border-b border-black focus:outline-none focus:border-yellow-500 px-2 py-1" required>
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day.toString().padStart(2, '0')}>{day.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Month *</label>
                    <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} className="w-full border-b border-black focus:outline-none focus:border-yellow-500 px-2 py-1" required>
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>{month.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year *</label>
                    <select name="dobYear" value={formData.dobYear} onChange={handleChange} className="w-full border-b border-black focus:outline-none focus:border-yellow-500 px-2 py-1" required>
                      <option value="">Year</option>
                      {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Other names by which you have been identified</label>
                  <input type="text" name="otherNames" value={formData.otherNames} onChange={handleChange} className="w-full border-b border-black focus:outline-none focus:border-yellow-500 px-2 py-1" />
                </div>
              </div>
            </div>
            {/* Section 2: Arrest or Conviction */}
            <div>
              <h3 className="font-bold text-lg mb-4">Section 2. Arrest or Conviction</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input type="checkbox" name="hasNotBeenArrestedOrConvicted" checked={formData.hasNotBeenArrestedOrConvicted} onChange={handleChange} className="w-4 h-4" />
                  <label>Has NOT been arrested or convicted</label>
                </div>
                <div className="flex items-center space-x-4">
                  <input type="checkbox" name="hasBeenArrestedOrConvicted" checked={formData.hasBeenArrestedOrConvicted} onChange={handleChange} className="w-4 h-4" />
                  <label>Has been arrested or convicted</label>
                </div>
                {formData.hasBeenArrestedOrConvicted && (
                  <div className="space-y-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Details of Arrest or Conviction 1</label>
                      <textarea name="arrestDetail1" value={formData.arrestDetail1} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-yellow-500" rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Details of Arrest or Conviction 2</label>
                      <textarea name="arrestDetail2" value={formData.arrestDetail2} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-yellow-500" rows={3} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Section 3: Child Abuse */}
            <div>
              <h3 className="font-bold text-lg mb-4">Section 3. Child Abuse</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input type="checkbox" name="hasNotBeenPerpetratorChildAbuse" checked={formData.hasNotBeenPerpetratorChildAbuse} onChange={handleChange} className="w-4 h-4" />
                  <label>Has NOT been perpetrator of child abuse</label>
                </div>
                <div className="flex items-center space-x-4">
                  <input type="checkbox" name="hasBeenPerpetratorChildAbuse" checked={formData.hasBeenPerpetratorChildAbuse} onChange={handleChange} className="w-4 h-4" />
                  <label>Has been perpetrator of child abuse</label>
                </div>
              </div>
            </div>
            {/* Section 4: Certification */}
            <div>
              <h3 className="font-bold text-lg mb-4">Section 4. Certification</h3>
              <p className="mb-4">By signing this form, I certify under penalty of law that the statements made in this form are true, correct and complete.</p>
              <p className="mb-4">I understand that false statements herein shall subject me to criminal prosecution under 18 Pa.C.S. §4904.</p>
            </div>
            {/* Signature and Date */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Signature *</label>
                <div className="border border-gray-300 rounded">
                  <SignatureCanvas ref={signaturePadRef} canvasProps={{ className: 'signature-canvas w-full', width: 400, height: 100 }} />
                  <button type="button" onClick={() => signaturePadRef.current?.clear()} className="mt-2 px-4 py-2 text-sm text-red-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors">Clear Signature</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="border-b border-black focus:outline-none focus:border-yellow-500 px-2 py-1" required />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-md font-semibold shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">Submit Form</button>
            </div>
          </form>
        </div>
        {/* Right: Job Application Card */}
        <div className="flex-1 flex items-center justify-center bg-transparent relative p-8">
          {/* Card with shadow and white background */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
            {/* Optional illustration/icon */}
            <div className="mb-4">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="60" height="15" rx="7" fill="#FFD600" />
                <rect x="20" y="10" width="40" height="20" rx="10" fill="#FFB300" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Job Application Info</h3>
            <div className="w-full space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Job Role</label>
                <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50" required />
              </div>
            </div>
          </div>
          {/* Abstract background shape behind card */}
          <div className="absolute -z-10 right-0 top-1/4 w-80 h-80 bg-gradient-to-br from-yellow-400 via-orange-300 to-yellow-200 rounded-full blur-2xl opacity-70"></div>
        </div>
      </div>
    </div>
  );
} 