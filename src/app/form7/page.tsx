// components/EmploymentApplication.jsx
"use client"
import React, { useState } from 'react';

const EmploymentApplication = () => {
  const [formData, setFormData] = useState({
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
    isCitizen: '' as '' | 'YES' | 'NO',
    isAuthorized: '' as '' | 'YES' | 'NO',
    previousEmployment: '' as '' | 'YES' | 'NO',
    previousEmploymentDate: '',
    felonyConviction: '' as '' | 'YES' | 'NO',
    felonyExplanation: '',
    canMeetAttendance: '' as '' | 'YES' | 'NO',
    highSchoolAddress: '',
    highSchoolFrom: '',
    highSchoolTo: '',
    highSchoolGraduate: '' as '' | 'YES' | 'NO',
    highSchoolDiploma: '',
    collegeAddress: '',
    collegeFrom: '',
    collegeTo: '',
    collegeGraduate: '' as '' | 'YES' | 'NO',
    collegeDegree: ''
  } as const);

  type FormDataKey = keyof typeof formData;

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
          collegeDegree: ''
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Behavior Analysis & Therapy Partners
          </h1>
          <p className="text-sm mt-1">139 Montgomery Ave., Suite 110</p>
          <p className="text-sm">Bala Cynwyd, PA 19004</p>
          <p className="text-sm mt-1">Phone: 610-664-6200, -6201</p>
          <p className="text-sm">Fax: 610-664-6202</p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold border-b-2 border-black pb-2">
            Employment Application
          </h2>
          <p className="text-xs italic mt-1">Please print</p>
        </div>

        {/* Equal Access Statement */}
        <div className="text-xs mb-8 border-b border-gray-300 pb-4">
          <p>
            Equal access to programs, services, and employment is available to all persons. 
            Those applicants requiring reasonable access to accommodations for the application 
            and/or interview process should notify a representative of the Human Resources Department.
          </p>
        </div>

        {/* Applicant Information */}
        <div className="mb-8">
          <h3 className="text-xl bg-gray-600 text-white font-bold border-b border-black text-center pb-1 p-4 mb-4">Applicant Information</h3>
          
          {/* Full Name and Date */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center flex-1">
              <span className="w-24 shrink-0">Full Name:</span>
              <div className="flex space-x-2 flex-grow">
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last" 
                  required
                  className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
                />
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First" 
                  required
                  className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
                />
                <input 
                  type="text" 
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleInputChange}
                  placeholder="M.I." 
                  className="w-16 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
            </div>
            <div className="flex items-center ml-4">
              <span className="shrink-0">Date:</span>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-36 ml-2 border-b border-black py-1 px-1 focus:outline-none" 
              />
            </div>
          </div>
          
          {/* Address */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="w-24 shrink-0">Address:</span>
              <input 
                type="text" 
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="Street Address" 
                required
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none mr-4" 
              />
              <span className="w-24 shrink-0">Apartment/Unit #:</span>
              <input 
                type="text" 
                name="apartmentUnit"
                value={formData.apartmentUnit}
                onChange={handleInputChange}
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            <div className="flex space-x-2 mb-4 ml-24"> {/* Align with Address label */}
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City" 
                required
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
              <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State" 
                required
                className="w-20 border-b border-black py-1 px-2 focus:outline-none" 
              />
              <input 
                type="text" 
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="ZIP Code" 
                required
                className="w-24 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
          </div>
          
          {/* Phone and Email */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 flex items-center">
              <span className="w-24 shrink-0">Phone:</span>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            <div className="flex-1 flex items-center">
              <span className="w-24 shrink-0">Email:</span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
          </div>

          {/* Driver's License */}
          <div className="flex items-center mb-4">
            <span className="w-36 shrink-0">Driver&#39;s License Number:</span>
            <input 
              type="text" 
              name="driversLicense"
              value={formData.driversLicense}
              onChange={handleInputChange}
              required
              className="flex-1 border-b border-black py-1 px-2 focus:outline-none mr-4" 
            />
            <span className="w-16 shrink-0">State:</span>
            <input 
              type="text" 
              name="licenseState"
              value={formData.licenseState}
              onChange={handleInputChange}
              required
              className="w-16 border-b border-black py-1 px-2 focus:outline-none mr-4" 
            />
            <span className="w-16 shrink-0">Exp.:</span>
            <input 
              type="date" 
              name="licenseExp"
              value={formData.licenseExp}
              onChange={handleInputChange}
              required
              className="w-20 border-b border-black py-1 px-2 focus:outline-none" 
            />
          </div>
          
          <div className=" font-bold uppercase text-md mb-4">
            DRIVING IS AN ESSENTIAL JOB FUNCTION
          </div>
          
          {/* Date Available and Social Security No. */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 flex items-center">
              <span className="w-36 shrink-0">Date Available:</span>
              <input 
                type="date" 
                name="dateAvailable"
                value={formData.dateAvailable}
                onChange={handleInputChange}
                required
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            <div className="flex-1 flex items-center">
              <span className="w-36 shrink-0">Social Security No.:</span>
              <input 
                type="text" 
                name="socialSecurity"
                value={formData.socialSecurity}
                onChange={handleInputChange}
                required
                className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
          </div>
          
          {/* Position Applied for */}
          <div className="flex items-center mb-4">
            <span className="w-36 shrink-0">Position Applied for:</span>
            <input 
              type="text" 
              name="positionApplied"
              value={formData.positionApplied}
              onChange={handleInputChange}
              required
              className="flex-1 border-b border-black py-1 px-2 focus:outline-none" 
            />
          </div>
          
          {/* Citizenship Section */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="flex items-center">
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
              <span className="ml-8 shrink-0">If no, are you authorized to work in the U.S.?</span>
              <div className="flex space-x-4 ml-4">
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
            <div className="flex items-center">
              <span className="w-64 shrink-0">Have you ever worked for this company?</span>
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
              <span className="ml-8 shrink-0">If yes, when?</span>
              <input 
                type="text" 
                name="previousEmploymentDate"
                value={formData.previousEmploymentDate}
                onChange={handleInputChange}
                className="w-40 ml-4 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>

            {/* Conviction Section */}
            <div className="flex items-start">
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
            </div>
          </div>

          {/* Explanation Section */}
          <div className="mt-2">
            <p className="text-md font-semibold text-black">
              If yes, explain: Conviction will NOT necessarily be a bar to employment. 
              Each instance and explanation will be considered in relation to the position 
              for which you are applying.
            </p>
            <textarea
              name="felonyExplanation"
              value={formData.felonyExplanation}
              onChange={handleInputChange}
              className="w-full mt-2 border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
              rows={3}
              placeholder="Please provide details if applicable..."
            />
          </div>

          {/* Attendance Section */}
          <div className="mt-6">
            <div className="flex items-center">
              <span className="w-64 shrink-0">Are you able to meet the attendance requirements of the position?</span>
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

        {/* Education Section */}
        <div>
          <h3 className="text-xl font-bold bg-gray-600 text-center text-white border-black pb-1 mb-4">Education</h3>
          
          {/* High School */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="w-24 shrink-0">High School:</span>
              <span className="ml-4 shrink-0">Address:</span>
              <input 
                type="text" 
                name="highSchoolAddress"
                value={formData.highSchoolAddress}
                onChange={handleInputChange}
                className="flex-1 ml-4 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            
            <div className="flex items-center space-x-4 ml-24"> {/* Align with High School label */}
              <div className="flex items-center">
                <span>From:</span>
                <input 
                  type="date" 
                  name="highSchoolFrom"
                  value={formData.highSchoolFrom}
                  onChange={handleInputChange}
                  className="w-20 ml-2 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
              
              <div className="flex items-center">
                <span>To:</span>
                <input 
                  type="date" 
                  name="highSchoolTo"
                  value={formData.highSchoolTo}
                  onChange={handleInputChange}
                  className="w-20 ml-2 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
              
              <div className="flex items-center">
                <span>Did you graduate?</span>
                <div className="flex space-x-2 ml-2">
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
              </div>
              
              <div className="flex items-center">
                <span>Diploma:</span>
                <input 
                  type="text" 
                  name="highSchoolDiploma"
                  value={formData.highSchoolDiploma}
                  onChange={handleInputChange}
                  className="w-32 ml-2 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
            </div>
          </div>
          
          {/* College */}
          <div>
            <div className="flex items-center mb-2">
              <span className="w-24 shrink-0">College:</span>
              <span className="ml-4 shrink-0">Address:</span>
              <input 
                type="text" 
                name="collegeAddress"
                value={formData.collegeAddress}
                onChange={handleInputChange}
                className="flex-1 ml-4 border-b border-black py-1 px-2 focus:outline-none" 
              />
            </div>
            
            <div className="flex items-center space-x-4 ml-24"> {/* Align with College label */}
              <div className="flex items-center">
                <span>From:</span>
                <input 
                  type="date" 
                  name="collegeFrom"
                  value={formData.collegeFrom}
                  onChange={handleInputChange}
                  className="w-20 ml-2 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
              
              <div className="flex items-center">
                <span>To:</span>
                <input 
                  type="date" 
                  name="collegeTo"
                  value={formData.collegeTo}
                  onChange={handleInputChange}
                  className="w-20 ml-2 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
              
              <div className="flex items-center">
                <span>Did you graduate?</span>
                <div className="flex space-x-2 ml-2">
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
              </div>
              
              <div className="flex items-center">
                <span>Degree:</span>
                <input 
                  type="text" 
                  name="collegeDegree"
                  value={formData.collegeDegree}
                  onChange={handleInputChange}
                  className="w-32 ml-2 border-b border-black py-1 px-2 focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
         {/* References Section */}
         <div>
          <h2 className="text-lg font-bold bg-gray-600 text-white text-center px-4 py-1">References</h2>
          <p className="text-sm text-gray-800 mt-2">Please list three professional references.</p>

          {[1, 2, 3].map(i => (
            <div key={i} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="Relationship" className="border-b border-black w-full p-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="Phone" className="border-b border-black w-full p-1" />
              </div>
              <input type="text" placeholder="Address" className="border-b border-black w-full p-1" />
            </div>
          ))}
        </div>

        {/* Previous Employment Section */}
        <div>
          <h2 className="text-lg font-bold bg-gray-600 text-center text-white px-4 py-1">Previous Employment</h2>

          {[1, 2].map(i => (
            <div key={i} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="Phone" className="border-b border-black w-full p-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Address" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="Supervisor" className="border-b border-black w-full p-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Job Title" className="border-b border-black w-full p-1" />
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Starting Salary $" className="border-b border-black w-full p-1" />
                  <span>-</span>
                  <input type="text" placeholder="Ending Salary $" className="border-b border-black w-full p-1" />
                </div>
              </div>
              <textarea placeholder="Responsibilities" className="border-b border-black w-full p-1" rows={2}></textarea>
              <div className="grid grid-cols-3 gap-4 items-center">
                <input type="text" placeholder="From" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="To" className="border-b border-black w-full p-1" />
                <input type="text" placeholder="Reason for Leaving" className="border-b border-black w-full p-1" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <label className="text-sm">May we contact your previous supervisor for a reference?</label>
                <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> Yes</label>
                <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> No</label>
              </div>
              <hr className="border-gray-600" />
            </div>
          ))}
        </div>

        {/* Optional: Add more fields if needed */}
        <div className="flex gap-4 mt-10">
          <input type="text" placeholder="Company" className="border-b border-black w-full p-1" />
          <input type="text" placeholder="Phone" className="border-b border-black w-full p-1" />
        </div>

        {/* Final Employment Entry */}
        <div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <input type="text" placeholder="Company" className="border-b border-black w-full p-1" />
            <input type="text" placeholder="Phone" className="border-b border-black w-full p-1" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <input type="text" placeholder="Address" className="border-b border-black w-full p-1" />
            <input type="text" placeholder="Supervisor" className="border-b border-black w-full p-1" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <input type="text" placeholder="Job Title" className="border-b border-black w-full p-1" />
            <div className="flex gap-2 items-center">
              <input type="text" placeholder="Starting Salary $" className="border-b border-black w-full p-1" />
              <span>-</span>
              <input type="text" placeholder="Ending Salary $" className="border-b border-black w-full p-1" />
            </div>
          </div>
          <textarea placeholder="Responsibilities" className="border-b border-black w-full p-1" rows={2}></textarea>
          <div className="grid grid-cols-3 gap-4 items-center mt-2">
            <input type="text" placeholder="From" className="border-b border-black w-full p-1" />
            <input type="text" placeholder="To" className="border-b border-black w-full p-1" />
            <input type="text" placeholder="Reason for Leaving" className="border-b border-black w-full p-1" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label className="text-sm mb-4">May we contact your previous supervisor for a reference?</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> Yes</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> No</label>
          </div>
        </div>

        {/* Military Service */}
        <div>
          <h2 className="text-lg font-bold bg-gray-600 text-center text-white px-4 py-1">Military Service</h2>
          <div className="grid grid-cols-2 gap-4 mt-4 mb-2">
            <input type="text" placeholder="Branch" className="border-b border-black w-full p-1" />
            <div className="flex gap-2">
              <input type="text" placeholder="From" className="border-b border-black w-full p-1" />
              <input type="text" placeholder="To" className="border-b border-black w-full p-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <input type="text" placeholder="Rank at Discharge" className="border-b border-black w-full p-1" />
            <input type="text" placeholder="Type of Discharge" className="border-b border-black w-full p-1" />
          </div>
          <textarea placeholder="If other than honorable, explain" className="border-b mt-4 border-black w-full p-1" rows={2}></textarea>
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

        {/* Signature and Date */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="border-b border-black text-sm text-gray-700">
            <label>Signature:</label>
            <input
              type="text"
              className="w-full bg-transparent outline-none p-1 text-black"
              placeholder="Sign here"
            />
          </div>
          <div className="border-b border-black text-sm text-gray-700">
            <label>Date:</label>
            <input
              type="text"
              className="w-full bg-transparent outline-none p-1 text-black"
              placeholder="MM/DD/YYYY"
            />
          </div>
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-black ml-68 text-nowrap text-white px-8 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Submit Application
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default EmploymentApplication;