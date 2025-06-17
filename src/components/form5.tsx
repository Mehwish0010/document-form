'use client';

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ConfidentialityAgreement() {
    const [formData, setFormData] = React.useState({
      name: '',
      signature: '',
      date: '',
      print: ''
    });

    const signaturePadRef = useRef<SignatureCanvas>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        // Ensure all required fields are filled
        if (!formData.name || !formData.signature || !formData.date || !formData.print) {
          alert('Please fill in all required fields');
          return;
        }

        const signatureDataUrl = signaturePadRef.current?.toDataURL() || '';
        
        // Prepare the data
        const formDataToSend = {
          name: formData.name.trim(),
          signature: signatureDataUrl,
          date: formData.date,
          print: formData.print.trim()
        };

        // Log the data being sent
        console.log('Sending data:', JSON.stringify(formDataToSend, null, 2));

        const response = await fetch('/api/confidentiality-agreement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSend)
        });

        // Log the response status
        console.log('Response status:', response.status);

        // Get the response text first
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        // Try to parse the response
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Invalid response from server');
        }

        if (response.ok && result.success) {
          alert('Form submitted successfully!');
          // Reset form
          setFormData({
            name: '',
            signature: '',
            date: '',
            print: ''
          });
        } else {
          throw new Error(result.error || 'Failed to submit form');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert(error instanceof Error ? error.message : 'Error submitting form. Please try again.');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-16 py-16 font-serif text-[15px] text-black leading-relaxed tracking-wide shadow-lg rounded-lg">
        <h1 className="text-center text-lg font-bold mb-6 uppercase">
          Behavior Analysis & Therapy Partners
        </h1>
        <h2 className="text-center font-semibold mb-10 uppercase">Confidentiality Agreement</h2>
  
        <p className="mb-8">
          I, <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-b border-black w-64 focus:outline-none focus:border-blue-500 px-2"
              required
            />, agree with the following statements:
        </p>
  
        <p className="mb-8 font-semibold">I have read and understood BATP&#39;s Privacy Policy.</p>
  
        <p className="mb-8">
          I understand that I may encounter confidential information during my time at BATP. As part of the condition of my work with BATP I will keep in strict confidence any information regarding any client, employee, consultant, or business of BATP or any other organization that comes to my attention while at BATP. I will do this in accordance with the BATP privacy policy and applicable laws, including those that require mandatory reporting. If I am unsure of whether or not to disclose, I will bring it up in supervision.
        </p>
  
        <p className="mb-10">
          I also agree to never remove any confidential material of any kind from the premises of BATP unless authorized as part of my duties, or with the express permission or direction to do so from BATP.
        </p>
  
        <div className="space-y-12 mt-32">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="border-b border-black w-60">
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
                  className="mt-2 px-4 py-2 text-sm text-red-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Clear Signature
                </button>
              </div>
              <span className="text-sm mt-6">Signature</span>
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border-b border-black w-40 focus:outline-none focus:border-blue-500"
                required
              />
              <span className="text-sm mt-6">Date</span>
            </div>
          </div>
  
          <div className="flex flex-col">
            <input
              type="text"
              name="print"
              value={formData.print}
              onChange={handleChange}
              className="border-b border-black w-60 focus:outline-none focus:border-blue-500"
              required
            />
            <span className="text-sm mt-6">Print</span>
          </div>

          <div className="flex justify-center mt-12">
            <button
              type="submit"
              className="bg-black l w-full text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Agreement
            </button>
          </div>
        </div>
      </form>
    );
  }
  