// components/EmploymentApplication.jsx
"use client"
import React, { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';

// Add styles for signature pad
const styles = {
  signaturePad: {
    width: '100%',
    height: '200px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
  },
  signatureCanvas: {
    width: '100%',
    height: '100%',
  }
};

// Define the form data type
type FormData = {
  lastName: string;
  firstName: string;
  middleInitial: string;
  date: string;
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  driversLicense: string;
  licenseState: string;
  licenseExp: string;
  dateAvailable: string;
  socialSecurity: string;
  positionApplied: string;
  isCitizen: '' | 'YES' | 'NO';
  isAuthorized: '' | 'YES' | 'NO';
  previousEmployment: '' | 'YES' | 'NO';
  previousEmploymentDate: string;
  felonyConviction: '' | 'YES' | 'NO';
  felonyExplanation: string;
  canMeetAttendance: '' | 'YES' | 'NO';
  highSchoolAddress: string;
  highSchoolFrom: string;
  highSchoolTo: string;
  highSchoolGraduate: '' | 'YES' | 'NO';
  highSchoolDiploma: string;
  collegeAddress: string;
  collegeFrom: string;
  collegeTo: string;
  collegeGraduate: '' | 'YES' | 'NO';
  collegeDegree: string;
  signature: string;
  signatureDate: string;
};

const EmploymentApplication = () => {
  const signaturePadRef = useRef<SignaturePad>(null);
  const [formData, setFormData] = useState<FormData>({
    lastName: '',
    firstName: '',
    middleInitial: '',
    date: '',
    streetAddress: '',
    apartmentUnit: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    driversLicense: '',
    licenseState: '',
    licenseExp: '',
    dateAvailable: '',
    socialSecurity: '',
    positionApplied: '',
    isCitizen: '',
    isAuthorized: '',
    previousEmployment: '',
    previousEmploymentDate: '',
    felonyConviction: '',
    felonyExplanation: '',
    canMeetAttendance: '',
    highSchoolAddress: '',
    highSchoolFrom: '',
    highSchoolTo: '',
    highSchoolGraduate: '',
    highSchoolDiploma: '',
    collegeAddress: '',
    collegeFrom: '',
    collegeTo: '',
    collegeGraduate: '',
    collegeDegree: '',
    signature: '',
    signatureDate: '',
  });

  type FormDataKey = keyof FormData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 'YES' : 'NO'
    }));
  };

  const handleSignatureChange = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setFormData(prev => ({
        ...prev,
        signature: signatureData
      }));
    }
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setFormData(prev => ({
        ...prev,
        signature: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields: FormDataKey[] = [
      'lastName', 'firstName', 'date', 'streetAddress', 'city', 'state', 
      'zipCode', 'phone', 'email', 'driversLicense', 'licenseState', 
      'licenseExp', 'dateAvailable', 'socialSecurity', 'positionApplied'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/form7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        alert('Application submitted successfully!');
        // Reset form after successful submission
        setFormData({
          lastName: '',
          firstName: '',
          middleInitial: '',
          date: '',
          streetAddress: '',
          apartmentUnit: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
          email: '',
          driversLicense: '',
          licenseState: '',
          licenseExp: '',
          dateAvailable: '',
          socialSecurity: '',
          positionApplied: '',
          isCitizen: '',
          isAuthorized: '',
          previousEmployment: '',
          previousEmploymentDate: '',
          felonyConviction: '',
          felonyExplanation: '',
          canMeetAttendance: '',
          highSchoolAddress: '',
          highSchoolFrom: '',
          highSchoolTo: '',
          highSchoolGraduate: '',
          highSchoolDiploma: '',
          collegeAddress: '',
          collegeFrom: '',
          collegeTo: '',
          collegeGraduate: '',
          collegeDegree: '',
          signature: '',
          signatureDate: '',
        });
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        alert(`Failed to submit application: ${error.message}`);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 font-sans">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-md p-4 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
            Behavior Analysis & Therapy Partners
          </h1>
          <p className="text-xs sm:text-sm mt-1">139 Montgomery Ave., Suite 110</p>
          <p className="text-xs sm:text-sm">Bala Cynwyd, PA 19004</p>
          <p className="text-xs sm:text-sm mt-1">Phone: 610-664-6200, -6201</p>
          <p className="text-xs sm:text-sm">Fax: 610-664-6202</p>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold border-b-2 border-black pb-2">
            Employment Application
          </h2>
          <p className="text-xs italic mt-1">Please print</p>
        </div>

        {/* Equal Access Statement */}
        <div className="text-xs mb-6 sm:mb-8 border-b border-gray-300 pb-4">
          <p>
            Equal access to programs, services, and employment is available to all persons. 
            Those applicants requiring reasonable access to accommodations for the application 
            and/or interview process should notify a representative of the Human Resources Department.
          </p>
        </div>

        {/* Applicant Information */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-3 sm:p-4 mb-4">Applicant Information</h3>
          
          {/* Full Name and Date */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:flex-1">
              <span className="w-24 shrink-0 mb-2 sm:mb-0">Full Name:</span>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last" 
                  required
                  className="w-full sm:flex-1 border-b border-black py-1 px-2 focus:outline-none" 
                />
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First" 
                  required
                  className="w-full sm:flex-1 border-b border-black py-1 px-2 focus:outline-none" 
                />
                <input 
                  type="text" 
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleInputChange}
                  placeholder="M.I." 
                  className="w-full sm:w-16 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <span className="w-16 sm:w-auto shrink-0">Date:</span>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full sm:w-36 ml-2 border-b border-black py-1 px-1 focus:outline-none" 
              />
            </div>
          </div>
          
          {/* Address */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 space-y-2 sm:space-y-0">
              <span className="w-24 shrink-0">Address:</span>
              <input 
                type="text" 
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="Street Address" 
                required
                className="w-full sm:flex-1 border-b border-black py-1 px-2 focus:outline-none sm:mr-4" 
              />
              <span className="w-24 shrink-0 mt-2 sm:mt-0">Apartment/Unit #:</span>
              <input 
                type="text" 
                name="apartmentUnit"
                value={formData.apartmentUnit}
                onChange={handleInputChange}
                className="w-full sm:flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4 ml-0 sm:ml-24">
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City" 
                required
                className="w-full sm:flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
              <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State" 
                required
                className="w-full sm:w-20 border-b border-black py-1 px-2 focus:outline-none" 
              />
              <input 
                type="text" 
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="ZIP Code" 
                required
                className="w-full sm:w-24 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
          </div>
          
          {/* Phone and Email */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-24 shrink-0 mb-2 sm:mb-0">Phone:</span>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-24 shrink-0 mb-2 sm:mb-0">Email:</span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
          </div>

          {/* Driver's License */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <span className="w-36 shrink-0 mb-2 sm:mb-0">Driver&#39;s License Number:</span>
            <input 
              type="text" 
              name="driversLicense"
              value={formData.driversLicense}
              onChange={handleInputChange}
              required
              className="w-full sm:flex-1 border-b border-black py-1 px-2 focus:outline-none sm:mr-4" 
            />
            <span className="w-16 shrink-0 mt-2 sm:mt-0">State:</span>
            <input 
              type="text" 
              name="licenseState"
              value={formData.licenseState}
              onChange={handleInputChange}
              required
              className="w-full sm:w-16 border-b border-black py-1 px-2 focus:outline-none sm:mr-4" 
            />
            <span className="w-16 shrink-0 mt-2 sm:mt-0">Exp.:</span>
            <input 
              type="date" 
              name="licenseExp"
              value={formData.licenseExp}
              onChange={handleInputChange}
              required
              className="w-full sm:w-20 border-b border-black py-1 px-2 focus:outline-none" 
            />
          </div>
          
          <div className="font-bold uppercase text-sm sm:text-md mb-4">
            DRIVING IS AN ESSENTIAL JOB FUNCTION
          </div>
          
          {/* Date Available and Social Security No. */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-36 shrink-0 mb-2 sm:mb-0">Date Available:</span>
              <input 
                type="date" 
                name="dateAvailable"
                value={formData.dateAvailable}
                onChange={handleInputChange}
                required
                className="w-full border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-36 shrink-0 mb-2 sm:mb-0">Social Security No.:</span>
              <input 
                type="text" 
                name="socialSecurity"
                value={formData.socialSecurity}
                onChange={handleInputChange}
                required
                className="w-full border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
          </div>
          
          {/* Position Applied for */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
            <span className="w-36 shrink-0 mb-2 sm:mb-0">Position Applied for:</span>
            <input 
              type="text" 
              name="positionApplied"
              value={formData.positionApplied}
              onChange={handleInputChange}
              required
              className="w-full border-b border-black py-1 px-2 focus:outline-none" 
            />
          </div>
          
          {/* Citizenship Section */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
              <span className="w-64 shrink-0">Are you a citizen of the United States?</span>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="isCitizen"
                    checked={formData.isCitizen === 'YES'}
                    onChange={handleCheckboxChange}
                    className="mr-1" 
                  /> YES
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="isCitizen"
                    checked={formData.isCitizen === 'NO'}
                    onChange={handleCheckboxChange}
                    className="mr-1" 
                  /> NO
                </label>
              </div>
              <span className="mt-2 sm:mt-0 sm:ml-8 shrink-0">If no, are you authorized to work in the U.S.?</span>
              <div className="flex space-x-4 sm:ml-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="isAuthorized"
                    checked={formData.isAuthorized === 'YES'}
                    onChange={handleCheckboxChange}
                    className="mr-1" 
                  /> YES
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="isAuthorized"
                    checked={formData.isAuthorized === 'NO'}
                    onChange={handleCheckboxChange}
                    className="mr-1" 
                  /> NO
                </label>
              </div>
            </div>
            
            {/* Previous Employment */}
            <div className="mt-8">
              <h3 className="text-lg sm:text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-3 sm:p-4 mb-4">Previous Employment</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                <span className="w-64 shrink-0">Have you ever been employed by this company?</span>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="previousEmployment"
                      checked={formData.previousEmployment === 'YES'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> YES
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="previousEmployment"
                      checked={formData.previousEmployment === 'NO'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> NO
                  </label>
                </div>
                {formData.previousEmployment === 'YES' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                    <span className="w-36 shrink-0 mb-2 sm:mb-0">If yes, when?</span>
                    <input 
                      type="date" 
                      name="previousEmploymentDate"
                      value={formData.previousEmploymentDate}
                      onChange={handleInputChange}
                      className="w-full sm:w-36 border-b border-black py-1 px-2 focus:outline-none" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Felony Conviction */}
            <div className="mt-8">
              <h3 className="text-lg sm:text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-3 sm:p-4 mb-4">Felony Conviction</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                <span className="w-64 shrink-0">Have you ever been convicted of a felony?</span>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="felonyConviction"
                      checked={formData.felonyConviction === 'YES'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> YES
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="felonyConviction"
                      checked={formData.felonyConviction === 'NO'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> NO
                  </label>
                </div>
                {formData.felonyConviction === 'YES' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full mt-2 sm:mt-0 sm:ml-4">
                    <span className="w-36 shrink-0 mb-2 sm:mb-0">If yes, explain:</span>
                    <textarea 
                      name="felonyExplanation"
                      value={formData.felonyExplanation}
                      onChange={handleInputChange}
                      className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Attendance */}
            <div className="mt-8">
              <h3 className="text-lg sm:text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-3 sm:p-4 mb-4">Attendance</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                <span className="w-64 shrink-0">Can you meet the attendance requirements?</span>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="canMeetAttendance"
                      checked={formData.canMeetAttendance === 'YES'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> YES
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="canMeetAttendance"
                      checked={formData.canMeetAttendance === 'NO'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> NO
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-3 sm:p-4 mb-4">Education</h3>
          
          {/* High School */}
          <div className="mb-6">
            <h4 className="text-md font-bold mb-4">High School</h4>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <span className="w-36 shrink-0 mb-2 sm:mb-0">Address:</span>
                <input 
                  type="text" 
                  name="highSchoolAddress"
                  value={formData.highSchoolAddress}
                  onChange={handleInputChange}
                  className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
                  <span className="w-24 shrink-0 mb-2 sm:mb-0">From:</span>
                  <input 
                    type="date" 
                    name="highSchoolFrom"
                    value={formData.highSchoolFrom}
                    onChange={handleInputChange}
                    className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
                  <span className="w-24 shrink-0 mb-2 sm:mb-0">To:</span>
                  <input 
                    type="date" 
                    name="highSchoolTo"
                    value={formData.highSchoolTo}
                    onChange={handleInputChange}
                    className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                <span className="w-36 shrink-0">Did you graduate?</span>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="highSchoolGraduate"
                      checked={formData.highSchoolGraduate === 'YES'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> YES
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="highSchoolGraduate"
                      checked={formData.highSchoolGraduate === 'NO'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> NO
                  </label>
                </div>
                {formData.highSchoolGraduate === 'YES' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                    <span className="w-24 shrink-0 mb-2 sm:mb-0">Diploma:</span>
                    <input 
                      type="text" 
                      name="highSchoolDiploma"
                      value={formData.highSchoolDiploma}
                      onChange={handleInputChange}
                      className="w-full sm:w-48 border-b border-black py-1 px-2 focus:outline-none" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* College */}
          <div className="mb-6">
            <h4 className="text-md font-bold mb-4">College</h4>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <span className="w-36 shrink-0 mb-2 sm:mb-0">Address:</span>
                <input 
                  type="text" 
                  name="collegeAddress"
                  value={formData.collegeAddress}
                  onChange={handleInputChange}
                  className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
                  <span className="w-24 shrink-0 mb-2 sm:mb-0">From:</span>
                  <input 
                    type="date" 
                    name="collegeFrom"
                    value={formData.collegeFrom}
                    onChange={handleInputChange}
                    className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center">
                  <span className="w-24 shrink-0 mb-2 sm:mb-0">To:</span>
                  <input 
                    type="date" 
                    name="collegeTo"
                    value={formData.collegeTo}
                    onChange={handleInputChange}
                    className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
                <span className="w-36 shrink-0">Did you graduate?</span>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="collegeGraduate"
                      checked={formData.collegeGraduate === 'YES'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> YES
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="collegeGraduate"
                      checked={formData.collegeGraduate === 'NO'}
                      onChange={handleCheckboxChange}
                      className="mr-1" 
                    /> NO
                  </label>
                </div>
                {formData.collegeGraduate === 'YES' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                    <span className="w-24 shrink-0 mb-2 sm:mb-0">Degree:</span>
                    <input 
                      type="text" 
                      name="collegeDegree"
                      value={formData.collegeDegree}
                      onChange={handleInputChange}
                      className="w-full sm:w-48 border-b border-black py-1 px-2 focus:outline-none" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* References Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold bg-gray-600 text-white text-center px-4 py-1">References</h2>
          <p className="text-sm text-gray-800 mt-2">Please list three professional references.</p>

          {[1, 2, 3].map(i => (
            <div key={i} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="border-b border-black w-full p-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input type="text" className="border-b border-black w-full p-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" className="border-b border-black w-full p-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" className="border-b border-black w-full p-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" className="border-b border-black w-full p-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Military Service */}
        <div className="mt-8">
          <h2 className="text-lg font-bold bg-gray-600 text-center text-white px-4 py-1">Military Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input type="text" className="border-b border-black w-full p-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Period</label>
              <div className="flex gap-2">
                <input type="text" placeholder="From" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="To" className="border-b border-black w-full p-1" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rank at Discharge</label>
              <input type="text" className="border-b border-black w-full p-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type of Discharge</label>
              <input type="text" className="border-b border-black w-full p-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">If other than honorable, explain</label>
            <textarea className="border-b mt-4 border-black w-full p-1" rows={2}></textarea>
          </div>
        </div>

        {/* Disclaimer and Signature */}
        <div>
          <h2 className="text-lg font-bold bg-gra-600  text-center text-white px-4 py-1">Disclaimer and Signature</h2>
          <div className="text-[15px] text-gray-900 leading-relaxed mt-4 space-y-3">
            <p>
              I UNDERSTAND THAT, IF I AM EMPLOYED, ANY MISREPRESENTATION OR MATERIAL OMISSION MADE BY ME ON THIS APPLICATION WILL BE SUFFICIENT CAUSE FOR CANCELLATION OF THIS APPLICATION OR IMMEDIATE DISCHARGE FROM THE EMPLOYER&#39;S SERVICE, WHENEVER IT IS DISCOVERED.
            </p>
            <p>
              I GIVE THE EMPLOYER THE RIGHT TO CONTACT AND OBTAIN INFORMATION FROM ALL REFERENCES, EMPLOYERS, AND EDUCATIONAL INSTITUTIONS AND TO OTHERWISE VERIFY THE ACCURACY OF THE INFORMATION CONTAINED IN THIS APPLICATION. I HEREBY RELEASE FROM LIABILITY THE EMPLOYER AND ITS REPRESENTATIVES FOR SEEKING, GATHERING, AND USING SUCH INFORMATION AND ALL OTHER PERSONS, CORPORATIONS, OR ORGANIZATIONS FOR FURNISHING SUCH INFORMATION.
            </p>
            <p>
              THE EMPLOYER DOES NOT UNLAWFULLY DISCRIMINATE IN EMPLOYMENT AND NO QUESTION ON THE APPLICATION IS USED FOR THE PURPOSE OF LIMITING OR EXCLUDING ANY APPLICANT FROM CONSIDERATION FOR EMPLOYMENT ON A BASIS PROHIBITED BY LOCAL, STATE, OR FEDERAL LAW.
            </p>
            <p>
              THIS APPLICATION IS CURRENT FOR ONLY 60 DAYS. AT THE CONCLUSION OF THIS TIME, IF I HAVE NOT HEARD FROM THE EMPLOYER AND STILL WISH TO BE CONSIDERED FOR EMPLOYMENT, IT WILL BE NECESSARY TO FILL OUT A NEW APPLICATION.
            </p>
            <p>
              IF I AM HIRED, I UNDERSTAND THAT I AM FREE TO RESIGN AT ANY TIME, WITH OR WITHOUT CAUSE AND WITHOUT PRIOR NOTICE, AND THE EMPLOYER RESERVES THE SAME RIGHT TO TERMINATE MY EMPLOYMENT AT ANY TIME, WITH OR WITHOUT CAUSE AND WITHOUT PRIOR NOTICE, EXCEPT AS MAY BE REQUIRED BY LAW. THIS APPLICATION DOES NOT CONSTITUTE AN AGREEMENT OR CONTRACT FOR EMPLOYMENT FOR ANY SPECIFIED PERIOD OR DEFINITE DURATION. I UNDERSTAND THAT NO REPRESENTATIVE OF THE EMPLOYER, OTHER THAN AN AUTHORIZED OFFICER, HAS THE AUTHORITY TO MAKE ANY ASSURANCES TO THE CONTRARY. I FURTHER UNDERSTAND THAT ANY SUCH ASSURANCES MUST BE IN WRITING AND SIGNED BY AN AUTHORIZED OFFICER.
            </p>
            <p>
              I UNDERSTAND IT IS THE COMPANY&#39;S POLICY NOT TO REFUSE TO HIRE A QUALIFIED INDIVIDUAL WITH A DISABILITY BECAUSE OF THAT PERSON&#39;S NEED FOR REASONABLE ACCOMMODATION AS REQUIRED BY THE ADA.
            </p>
            <p>
              I ALSO UNDERSTAND THAT, IF I AM HIRED, I WILL BE REQUIRED TO PROVIDE PROOF OF IDENTITY AND LEGAL WORK AUTHORIZATION.
            </p>
            <p>
              I represent and warrant that I have read and fully understand the foregoing and seek employment under these conditions.
            </p>
          </div>
        </div>

        {/* Signature and Date Section */}
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-3 mb-4">Signature and Date</h3>
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Signature */}
            <div className="flex-1">
              <div className="mb-4">
                <div style={{...styles.signaturePad, height: '150px'}}>
                  <SignaturePad
                    ref={signaturePadRef}
                    canvasProps={{
                      className: 'signature-canvas',
                      style: styles.signatureCanvas
                    }}
                    onEnd={handleSignatureChange}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear Signature
                  </button>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex-1">
              <div className="flex flex-col space-y-2">
                <span className="font-medium">Date:</span>
                <input 
                  type="date" 
                  name="signatureDate"
                  value={formData.signatureDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmploymentApplication;