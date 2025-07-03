'use client';

import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ConfidentialityAgreement() {
    const [formData, setFormData] = React.useState({
      jobAppFullName: '',
      jobRole: '',
      location: '',
      name: '',
      signature: '',
      date: '',
      print: ''
    });

    const signaturePadRef = useRef<SignatureCanvas>(null);

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
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
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

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const signatureDataUrl = signaturePadRef.current?.toDataURL() || '';
        // Ensure all required fields are filled
        if (!formData.name || !formData.date || !formData.print || !signaturePadRef.current || signaturePadRef.current.isEmpty() || !formData.jobAppFullName || !formData.jobRole || !formData.location) {
          showNotification('error', 'Please fill in all required fields');
          return;
        }
        // Prepare the data
        const formDataToSend = {
          jobAppFullName: formData.jobAppFullName.trim(),
          jobRole: formData.jobRole.trim(),
          location: formData.location.trim(),
          name: formData.name.trim(),
          signature: signatureDataUrl,
          date: formData.date,
          print: formData.print.trim()
        };
        const response = await fetch('/api/form1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSend)
        });
        const result = await response.json();
        if (response.ok && result.success) {
          showNotification('success', 'Form submitted successfully!');
          setFormData({
            jobAppFullName: '',
            jobRole: '',
            location: '',
            name: '',
            signature: '',
            date: '',
            print: ''
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
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-16 py-8 sm:py-16 font-serif text-[14px] sm:text-[15px] text-black leading-relaxed tracking-wide shadow-lg rounded-lg">
        <div className="mb-6">
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
                placeholder="Enter your full name"
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
        </div>
        <h1 className="text-center text-base sm:text-lg font-bold mb-4 sm:mb-6 uppercase">
          Behavior Analysis & Therapy Partners
        </h1>
        <h2 className="text-center font-semibold mb-6 sm:mb-10 uppercase">Confidentiality Agreement</h2>
  
        <p className="mb-6 sm:mb-8">
          I, <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-b border-black w-48 sm:w-64 focus:outline-none focus:border-blue-500 px-1 sm:px-2"
              required
            />, agree with the following statements:
        </p>
  
        <p className="mb-6 sm:mb-8 font-semibold">I have read and understood BATP&#39;s Privacy Policy.</p>
  
        <p className="mb-6 sm:mb-8">
          I understand that I may encounter confidential information during my time at BATP. As part of the condition of my work with BATP I will keep in strict confidence any information regarding any client, employee, consultant, or business of BATP or any other organization that comes to my attention while at BATP. I will do this in accordance with the BATP privacy policy and applicable laws, including those that require mandatory reporting. If I am unsure of whether or not to disclose, I will bring it up in supervision.
        </p>
  
        <p className="mb-8 sm:mb-10">
          I also agree to never remove any confidential material of any kind from the premises of BATP unless authorized as part of my duties, or with the express permission or direction to do so from BATP.
        </p>
  
        <div className="space-y-8 sm:space-y-12 mt-24 sm:mt-32">
          <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
            <div className="flex flex-col">
              <div className="border-b border-black w-full sm:w-60">
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    className: 'signature-canvas',
                    width: 240,
                    height: 100
                  }}
                />
                <button
                  type="button"
                  onClick={() => signaturePadRef.current?.clear()}
                  className="mt-2 px-3 sm:px-4 py-1 sm:py-2 text-sm text-red-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Clear Signature
                </button>
              </div>
              <span className="text-xs sm:text-sm mt-4 sm:mt-6">Signature</span>
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border-b border-black w-32 sm:w-40 focus:outline-none focus:border-blue-500"
                required
              />
              <span className="text-xs sm:text-sm mt-4 sm:mt-6">Date</span>
            </div>
          </div>
  
          <div className="flex flex-col">
            <input
              type="text"
              name="print"
              value={formData.print}
              onChange={handleChange}
              className="border-b border-black w-48 sm:w-60 focus:outline-none focus:border-blue-500"
              required
            />
            <span className="text-xs sm:text-sm mt-4 sm:mt-6">Print</span>
          </div>

          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              type="submit"
              className="bg-black w-full text-white px-6 sm:px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Agreement
            </button>
          </div>
        </div>
      </form>
    );
  }
  