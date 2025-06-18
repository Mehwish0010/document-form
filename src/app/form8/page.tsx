"use client"
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';

export default function EmploymentForm() {
  const employeeSignaturePadRef = useRef<SignaturePad>(null);
  const employerSignaturePadRef = useRef<SignaturePad>(null);
  const finalSignaturePadRef = useRef<SignaturePad>(null);

  // State for Section 1
  const [section1, setSection1] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    otherLastNames: '',
    address: '',
    aptNumber: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    telephone: '',
    citizenshipStatus: '',
    uscisNumber: '',
    i94Number: '',
    passportNumber: '',
    employeeSignature: '',
    employeeDate: ''
  });

  // State for Section 2
  const [section2, setSection2] = useState({
    document1: {
      title: '',
      authority: '',
      number: '',
      expiration: ''
    },
    document2: {
      title: '',
      authority: '',
      number: '',
      expiration: ''
    },
    document3: {
      title: '',
      authority: '',
      number: '',
      expiration: ''
    },
    certificationDate: '',
    employerName: '',
    employerSignature: '',
    employerBusiness: '',
    employerAddress: ''
  });

  // State for Supplement B
  const [supplementB, setSupplementB] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    rehireDate: '',
    documentTitle: '',
    documentNumber: '',
    expirationDate: '',
    employerName: '',
    employerSignature: '',
    todayDate: '',
    additionalInfo: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    finalSignature: ''
  });

  const handleSection1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSection1(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSection2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setSection2(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, string>),
        [field]: value
      }
    }));
  };

  const handleEmployeeSignatureChange = () => {
    if (employeeSignaturePadRef.current) {
      const signatureData = employeeSignaturePadRef.current.toDataURL();
      setSection1(prev => ({
        ...prev,
        employeeSignature: signatureData
      }));
    }
  };

  const clearEmployeeSignature = () => {
    if (employeeSignaturePadRef.current) {
      employeeSignaturePadRef.current.clear();
      setSection1(prev => ({
        ...prev,
        employeeSignature: ''
      }));
    }
  };

  const handleEmployerSignatureChange = () => {
    if (employerSignaturePadRef.current) {
      const signatureData = employerSignaturePadRef.current.toDataURL();
      setSection2(prev => ({
        ...prev,
        employerSignature: signatureData
      }));
    }
  };

  const clearEmployerSignature = () => {
    if (employerSignaturePadRef.current) {
      employerSignaturePadRef.current.clear();
      setSection2(prev => ({
        ...prev,
        employerSignature: ''
      }));
    }
  };

  const handleFinalSignatureChange = () => {
    if (finalSignaturePadRef.current) {
      const signatureData = finalSignaturePadRef.current.toDataURL();
      setSupplementB(prev => ({
        ...prev,
        finalSignature: signatureData
      }));
    }
  };

  const clearFinalSignature = () => {
    if (finalSignaturePadRef.current) {
      finalSignaturePadRef.current.clear();
      setSupplementB(prev => ({
        ...prev,
        finalSignature: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Collect all form data
      const formData = {
        section1: {
          lastName: section1.lastName || '',
          firstName: section1.firstName || '',
          middleInitial: section1.middleInitial || '',
          otherLastNames: section1.otherLastNames || '',
          address: section1.address || '',
          aptNumber: section1.aptNumber || '',
          city: section1.city || '',
          state: section1.state || '',
          zipCode: section1.zipCode || '',
          dateOfBirth: section1.dateOfBirth || '',
          ssn: section1.ssn || '',
          email: section1.email || '',
          telephone: section1.telephone || '',
          citizenshipStatus: section1.citizenshipStatus || '',
          uscisNumber: section1.uscisNumber || '',
          i94Number: section1.i94Number || '',
          passportNumber: section1.passportNumber || '',
          employeeSignature: section1.employeeSignature || '',
          employeeDate: section1.employeeDate || ''
        },
        section2: {
          document1: {
            title: section2.document1?.title || '',
            authority: section2.document1?.authority || '',
            number: section2.document1?.number || '',
            expiration: section2.document1?.expiration || ''
          },
          document2: {
            title: section2.document2?.title || '',
            authority: section2.document2?.authority || '',
            number: section2.document2?.number || '',
            expiration: section2.document2?.expiration || ''
          },
          document3: {
            title: section2.document3?.title || '',
            authority: section2.document3?.authority || '',
            number: section2.document3?.number || '',
            expiration: section2.document3?.expiration || ''
          },
          certificationDate: section2.certificationDate || '',
          employerName: section2.employerName || '',
          employerSignature: section2.employerSignature || '',
          employerBusiness: section2.employerBusiness || '',
          employerAddress: section2.employerAddress || ''
        },
        supplementB: {
          lastName: supplementB.lastName || '',
          firstName: supplementB.firstName || '',
          middleInitial: supplementB.middleInitial || '',
          rehireDate: supplementB.rehireDate || '',
          documentTitle: supplementB.documentTitle || '',
          documentNumber: supplementB.documentNumber || '',
          expirationDate: supplementB.expirationDate || '',
          employerName: supplementB.employerName || '',
          employerSignature: supplementB.employerSignature || '',
          todayDate: supplementB.todayDate || '',
          additionalInfo: supplementB.additionalInfo || '',
          address: supplementB.address || '',
          city: supplementB.city || '',
          state: supplementB.state || '',
          zipCode: supplementB.zipCode || '',
          finalSignature: supplementB.finalSignature || ''
        }
      };

      console.log('Submitting form data:', JSON.stringify(formData, null, 2));

      const response = await fetch('/api/form8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      alert('Form submitted successfully! Check your email for the PDF.');
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[1100px] mx-auto border border-black p-4 text-[16px] leading-tight font-serif">
      <div className="flex items-center justify-between mb-2">
        {/* Logo Section */}
        <div className="w-30 h-30">
          <Image 
            src="/logouss.png" 
            alt="USCIS Logo" 
            width={120}
            height={120}
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Heading Section */}
        <div className="text-center flex-1 px-4">
          <h1 className="text-xl font-bold whitespace-nowrap">Employment Eligibility Verification</h1>
          <p className="text-xl font-bold whitespace-nowrap">
            Department of Homeland Security<br />
            <span className="text-gray-600 text-md font-medium">U.S. Citizenship and Immigration Services</span>
          </p>
        </div>

        {/* Form Number Section */}
        <div className="text-right text-[16px] font-semibold">
          <span className="text-xl font-semibold">USCIS<br />Form I-9</span><br />
          <span className="text-md font-medium whitespace-nowrap">OMB No. 1615-0047</span><br />
          <span className="text-md font-medium whitespace-nowrap">Expires 07/31/2026</span>
        </div>
      </div>

      <hr className='border-5 ' />
      <hr className='border mt-2 ' />

      <div className="mt-2 text-sm text-black font-bold">
        <strong>START HERE:</strong> Employers must ensure the form instructions are available to employees when completing this form...
        <p className='font-medium'>
          ANTI-DISCRIMINATION NOTICE: All employees can choose which acceptable documentation...
        </p>
      </div>

      <div className="border border-black mt-2">
        <h1 className="font-medium text-md bg-gray-300 p-2">
          <span className='font-bold '>Section 1. Employee Information and Attestation: </span>
          <span>Employees must complete and sign Section 1 of Form I-9 no later than the <span className='font-semibold'>first day of employment</span>, but not before accepting a job offer.</span>
        </h1>

        <div className="grid grid-cols-4 gap-2 mt-2 ">
          <div><label className="text-sm font-medium ml-2">Last Name (Family Name)</label><input 
            name="lastName"
            value={section1.lastName}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-sm font-medium">First Name (Given Name)</label><input 
            name="firstName"
            value={section1.firstName}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-sm font-medium">Middle Initial</label><input 
            name="middleInitial"
            value={section1.middleInitial}
            onChange={handleSection1Change}
            className="border border-black p-1 w-full  bg-blue-100" placeholder="" /></div>
          <div><label className="text-sm font-medium">Other Last Names Used (if any)</label><input 
            name="otherLastNames"
            value={section1.otherLastNames}
            onChange={handleSection1Change}
            className="border border-black  p-1 w-full bg-blue-100" placeholder="" /></div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
  {/* Address */}
  <div className="flex flex-col w-[250px]">
    <label className="text-sm font-medium ml-2">Address (Street Number and Name)</label>
    <input 
      name="address"
      value={section1.address}
      onChange={handleSection1Change}
      className="border border-black p-1 w-full  bg-blue-100" />
  </div>

  {/* Apt Number */}
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium">Apt. Number (if any)</label>
    <input 
      name="aptNumber"
      value={section1.aptNumber}
      onChange={handleSection1Change}
      className="border border-black   bg-blue-100 p-1 w-full" />
  </div>

  {/* City */}
  <div className="flex flex-col w-[200px]">
    <label className="text-sm font-medium ml-2">City or Town</label>
    <input 
      name="city"
      value={section1.city}
      onChange={handleSection1Change}
      className="border border-black  bg-blue-100 p-1 w-full" />
  </div>

  {/* State */}
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium">State</label>
    <input 
      name="state"
      value={section1.state}
      onChange={handleSection1Change}
      className="border border-black   bg-blue-100 p-1 w-full" />
  </div>

  {/* ZIP Code */}
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium">ZIP Code</label>
    <input 
      name="zipCode"
      value={section1.zipCode}
      onChange={handleSection1Change}
      className="border border-black bg-blue-100 p-1 w-full" />
  </div>
</div>

        <div className="grid grid-cols-4 gap-2 mt-2">
          <div><label className="text-sm font-medium ml-2">Date of Birth (mm/dd/yyyy)</label><input 
            name="dateOfBirth"
            value={section1.dateOfBirth}
            onChange={handleSection1Change}
            className="border  bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-sm font-medium">U.S. Social Security Number</label><input 
            name="ssn"
            value={section1.ssn}
            onChange={handleSection1Change}
            className="border  bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-sm font-medium">Employee&apos;s Email Address</label><input 
            name="email"
            value={section1.email}
            onChange={handleSection1Change}
            className="border  bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-sm font-medium">Employee&apos;s Telephone Number</label><input 
            name="telephone"
            value={section1.telephone}
            onChange={handleSection1Change}
            className="border border-black p-1   bg-blue-100 w-full" placeholder="" /></div>
        </div>



        
      </div>

      {/* Section 2 */}
      <div className="border-t border-b border-black my-4 py-2">
      
        <div className="  p-2 mt-4 text-xs flex flex-col gap-4">

{/* Paragraph + Checkbox in Horizontal Layout */}
<div className="flex ">
  {/* Paragraph block (left side) */}
  <div className="w-1/4">
    <p className='font-bold text-[13px]   p-5 border'>
    I am aware that federal law 
provides for imprisonment and/or
fines for false statements, or the 
use of false documents, in 
connection with the completion of
this form. I attest, under penalty
of perjury, that this information,
including my selection of the box
attesting to my citizenship or
immigration status, is true and
     
    </p>
  </div>
  <div className=" border  text-xs flex flex-col gap-4">
  
  {/* Checkbox Section with Paragraph */}
  <div className="flex gap-4 w-full max-h-min">
    <div className="w-full  p-2 ">
      <p className='text-[16px]'>
        Check one of the following boxes to attest to your citizenship or immigration status 
        <span className="block text-[16px] italic">(See page 2 and 3 of the instructions.)</span>
      </p>

      <div className="flex items-start border-b border-black text-[16px]">
        <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
        <span className="p-1">1. A citizen of the United States</span>
      </div>
      <div className="flex items-start border-btext-[16px]  border-black">
        <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
        <span className="p-1 text-[16px]">
          2. A noncitizen national of the United States
          <span className="italic text-[16px]"> (See instructions.)</span>
        </span>
      </div>
      <div className="flex items-start border-b text-[16px] border-black">
        <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
        <span className="p-1 text-[16px]">
          3. A lawful permanent resident
          <span className="italic text-[16px]"> (Enter USCIS or A-Number)</span>
        </span>
      </div>
      <div className="flex items-start text-[16px] ">
        <input type="checkbox" className="m-2 mt-2 bg-blue-100" />
        <span className="p-1 text-[16px]">
          4. An alien authorized to work (other than Numbers 2 and 3 above) until
          <span className="ml-1 italic text-[16px]">(exp. date, if any)</span>
        </span>
      </div>
    </div>
  </div>

  {/* Additional Note Paragraph */}
  <p className="text-[16px]  ml-2 bg-blue-100">
  If you check Item Number 4., enter one of these:
  </p>

  {/* Additional Fields */}
  <div className="grid grid-cols-3 gap-2 text-[11px]">
    <div className='border ml-2 p-1'>
      <label className="block text-[14px] ">USCIS A-Number</label>
      <input type="text" className="border-t border-black w-full  h-[52px] text-xs bg-blue-100" />
    </div>
    <div className='border ml-2 p-1'>
      <label className="block font-medium text-[14px]">Form I-94 Admission Number</label>
      <input type="text" className="border-t border-black w-full p-1 text-xs h-[52px] bg-blue-100" />
    </div>
    <div className='border ml-2 p-2 '>
      <label className="block font-medium text-[14px]">Foreign Passport Number and Country of Issuance</label>
      <input type="text" className="border-t border-black w-full p-1 h-[32px] text-xs bg-blue-100" />
    </div>
  </div>
</div>

  {/* Checkbox container (right side) */}
  
  </div>

{/* Signature and Date */}
<div className="flex justify-between items-center text-[16px]">
  <div className="w-1/2">
    <label className="block font-medium">Signature of Employee</label>
    <div className="border border-gray-300 rounded">
      <SignaturePad
        ref={employeeSignaturePadRef}
        canvasProps={{
          className: 'signature-canvas w-full h-32 bg-white',
        }}
        onEnd={handleEmployeeSignatureChange}
      />
    </div>
    <button
      type="button"
      onClick={clearEmployeeSignature}
      className="mt-2 text-sm text-red-600 hover:text-red-800"
    >
      Clear Signature
    </button>
  </div>
  <div className="w-[48%]">
    <label className="block font-medium">Today&apos;s Date (mm/dd/yyyy)</label>
    <input type="text" className="w-full p-2 bg-blue-100 text-xs" />
  </div>
</div>
</div>
<div className="mb-4 bg-gray-200">
        <h2 className="font-bold bg-gray-200">Section 2. Employer Review and Verification:</h2>
        <p className=" bg-gray-200">
          Employee or their authorized representative must complete and sign Section 2 within three business days after the employment date, 
          as a result of any change in the company&apos;s performance. For example, the employee or employee who is not eligible for employment 
          at the time of termination may be entitled to an annual salary or compensation plan that will be paid annually.
        </p>
      </div>

      {/* Main Table */}
      <table className="w-full border-collapse   mb-4">
  <thead>
    <tr>
      <th className="w-[25%] border border-gray-800 p-1"></th>
      <th className="w-[25%] border border-gray-800 p-1">LIST A</th>
      <th className="w-[25%] border border-gray-800 p-1">LIST B</th>
      <th className="w-[25%] border border-gray-800 p-1">LIST C</th>
    </tr>
  </thead>
  <tbody>
    {/* Document 1 */}
    <tr>
      <td className="border border-gray-800 p-1 font-bold  bg-gray-200">Document Title 1</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.title"
          value={section2.document1.title}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.authority"
          value={section2.document1.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.number"
          value={section2.document1.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Issuing Authority</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.authority"
          value={section2.document1.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.authority"
          value={section2.document1.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.expiration"
          value={section2.document1.expiration}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200 ">Document Number (if any)</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.number"
          value={section2.document1.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.number"
          value={section2.document1.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document1.expiration"
          value={section2.document1.expiration}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    
    {/* Document 2 */}
    <tr>
      <td className="border border-gray-800 p-1 font-bold  bg-gray-200">Document Title 2 (if any)</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.title"
          value={section2.document2.title}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.authority"
          value={section2.document2.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.number"
          value={section2.document2.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Issuing Authority</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.authority"
          value={section2.document2.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.authority"
          value={section2.document2.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Document Number (if any)</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.number"
          value={section2.document2.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.number"
          value={section2.document2.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Expiration Date (if any)</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.expiration"
          value={section2.document2.expiration}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document2.expiration"
          value={section2.document2.expiration}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    
    {/* Document 3 */}
    <tr>
      <td className="border border-gray-800 p-1 font-bold  bg-gray-200">Document Title 3 (if any)</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document3.title"
          value={section2.document3.title}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Issuing Authority</td>
      <td className="border border-gray-800 p-1 h-8">
        <input 
          name="document3.authority"
          value={section2.document3.authority}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Document Number (if any)</td>
      
      <td className="border border-gray-800 p-1" rowSpan={2}>
        <input 
          name="document3.number"
          value={section2.document3.number}
          onChange={handleSection2Change}
          className="w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Expiration Date (if any)</td>
      <input 
        name="document3.expiration"
        value={section2.document3.expiration}
        onChange={handleSection2Change}
        className="w-full bg-blue-100 p-1" 
        type="text" 
      />
    </tr>
    
    {/* Certification Section */}
    <tr>
    <td className="border border-gray-800 p-1" colSpan={4}>
  <div className="flex items-end">
    <div className="flex-1 pr-2">
      <p>
        <span className="font-bold">Certification:</span> I attest, under penalty of perjury, that (1) I have examined the 
        documentation presented by the above-named employee, (2) the above-listed documentation appears to be genuine and 
        to relate to the employee named, and (3) to the best of my knowledge, the employee is authorized to work in the United States.
      </p>
    </div>
    <div className="w-1/3">
      <div className="text-xs mb-1">Today&apos;s Date (mm/dd/yyyy)</div>
      <input 
        name="certificationDate"
        value={section2.certificationDate}
        onChange={handleSection2Change}
        className="border border-gray-800 h-8 w-full bg-blue-100 p-1" 
        type="text" 
      />
    </div>
  </div>
</td>
    </tr>
    
    {/* Signature Section */}
    <tr>
      <td className="border border-gray-800 p-1 text-nowrap" colSpan={2}>
        <div>Last Name: First Name and Title of Employer or Authorized Representative</div>
        <input 
          name="employerName"
          value={section2.employerName}
          onChange={handleSection2Change}
          className="border border-gray-800 h-8 mt-1 w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1" colSpan={2}>
        <div>Signature of Employer or Authorized Representative</div>
        <div className="border-r p-2">
          <div className="border border-gray-300 rounded">
            <SignaturePad
              ref={employerSignaturePadRef}
              canvasProps={{
                className: 'signature-canvas w-full h-32 bg-white',
              }}
              onEnd={handleEmployerSignatureChange}
            />
          </div>
          <button
            type="button"
            onClick={clearEmployerSignature}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Clear Signature
          </button>
        </div>
      </td>
    </tr>
    
    {/* Employer Information */}
    <tr>
      <td className="border border-gray-800 p-1" colSpan={2}>
        <div>Employer&apos;s Business or Organization Name</div>
        <input 
          name="employerBusiness"
          value={section2.employerBusiness}
          onChange={handleSection2Change}
          className="border border-gray-800 h-8 mt-1 w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
      <td className="border border-gray-800 p-1" colSpan={2}>
        <div>Employer&apos;s Business or Organization Address (Street Address, City, State, ZIP Code)</div>
        <input 
          name="employerAddress"
          value={section2.employerAddress}
          onChange={handleSection2Change}
          className="border border-gray-800 h-8 mt-1 w-full bg-blue-100 p-1" 
          type="text" 
        />
      </td>
    </tr>
  </tbody>
</table>

      {/* Footer */}
      <div className=" mt-2 text-nowrap text-center font-semibold">
        <p>For reverification or rehire, complete <span className='text-blue-400 '>Supplement B, Reverification and Rehire </span> on Page 4. </p>
        
        
      </div>
    


       </div>

      <p className="text-[16px] text-center text-gray-600 mb-20 ">Form I-9 Edition 08/01/23 • Page 1 of 4</p>

      <hr className='border-5 ' />
      <hr className='border mt-2 ' />

      <div className="bg-white p-8 w-[1050px] mt-8 ">
        {/* Page Number */}
      
        
       

        {/* Content */}
        <div className="mb-8 font-poppins">
          <h3 className="text-2xl font-bold text-center  mb-6 font-sans">
            LISTS OF ACCEPTABLE DOCUMENTS
          </h3>

          <p className="mb-1 text-center">
            All documents containing an expiration date must be unexpired.
          </p>

          <div className=" pl-4 py-2 mb-1 text-center">
            <span className="font-bold text-center">.</span> Documents extended by the issuing authority are considered unexpired.
          </div>

          <p className="mb-1 text-center">
            Employees may present one selection from List A{" "}
            <span className="font-bold text-center">or a combination</span> of one selection from List B and one selection from List C.
          </p>

          <p className="font-bold text-center">
            Examples of many of these documents appear in the Handbook for Employers (M-274).
          </p>
        </div>

        {/* Lists */}
        <div className="flex justify-between mt-8 gap-4 border-1 border-black">
        {/* List A */}
<div className="border border-black w-1/3 p-4">
  <h4 className="font-bold text-center mb-1 pb-1  border-black">LIST A</h4>
  <p className='border-b text-sm font-semibold mb-1'>Documents Establish Both Identityand employment Authorization</p>
  <ol className="text-sm list-decimal pl-5 divide-y divide-black">
    <li className="py-2">U.S. Passport or U.S. Passport Card</li>
    <li className="py-2">Permanent Resident Card or Alien Registration Receipt Card (Form I-551)</li>
    <li className="py-2">Foreign passport that contains a temporary I-551 stamp or printed notation on a machine-readable immigrant visa</li>
    <li className="py-2">Employment Authorization Document that contains a photograph (Form I-766)</li>
    <li className="py-2">For an indiviual temporaily organized to work for a specific employer because of his/her status or parole:
      <p className=''>
        a. Foriegn passport and 
      </p>
      <p>
        b. Form I-94 or FormI-94 that has the following :

      </p>
      <p>
        (1) The same name as the passport and 
      </p>
      <span>
        (2) An endorsement of the indiviuals status or parole as long as that period of endorsement has not expired and the proposed employment is not in conflict with any restrictions or limitations identified in the form.
      </span>
    </li>
    <li className="py-2 ">Passports from the Federated States of Micronesia (FSM) or the Republic of the Marshal Islands (RMI) with Form I-94 or Form I-94-A indicating nonimmigrant admission under the Compact of Free Association Between the United States and the FSM or RMI.</li>
  </ol>
</div>


          {/* List B */}
          <div className="border border-black w-1/3 p-4">
  <h4 className="font-bold text-center mb-4 pb-1 ">LIST B</h4>
  <p className="text-sm font-semibold mb-2 border-b">Documents that Establish Identity</p>
  <ol className="text-sm list-decimal pl-5 divide-y divide-black">
    <li className="py-2 ">Driver&apos;s license or ID issued by a State  or outlying possession of the United States provided.It contains a photoraph or information such as name , date of birth, gender, height, eye color, and address.</li>
    <li className="py-2 ">ID card issued by federal, state, or local government agencies or entities, provided it conmtains a photograph or information such as name, date of birth, gender, height, eye color and address</li>
    <li className="py-2 ">School ID card with a photograph</li>
    <li className="py-2 ">Voter&apos;s registration card</li>
    <li className="py-2 ">U.S. Military card or draft record</li>
    <li className="py-2" >Military dependent&apos;s ID card</li>
    <li className="py-2">U.S. Coast Guard Merchant Mariner Card</li>
    <li className="py-2 ">Native American tribal document</li>
    <li className="py-2">Canadian driver&apos;s license</li>
    <p className='font-bold py-2 '>For persons under age 18 who are unable to present a document listed above:</p>
  <li className="py-2 ">School record or report card</li>
  <li className=" py-2 ">Clinic, doctor, or hospital record</li>
  <li className="py-2  ">Day-care or nursery school record</li>
  </ol>
</div>


          {/* List C */}
          <div className="border border-black w-1/3 p-4">
  <h4 className="font-bold text-center mb-4 pb-1 ">LIST C</h4>
  <p className="text-sm font-semibold mb-2 border-b border-black">Documents that Establish Employment Authorization</p>
  <ol className="text-sm list-decimal pl-5 divide-y divide-black">
    <li className="py-2"> A Social Security Account Number card, unless the cardincludes one of the following restrictions:
      <p>
      <span className='font-bold'>
        (1)</span>  NOT VALID EMPLOYMENT
      </p>
      <p>
      <span className='font-bold'>(2)</span> VALID FOR WORK ONLY WITHIN AUTHORIZATION
      </p>
      <p><span className='font-bold'>(3)</span> VALID FOR WORK WITH DHS AUTHORIZATION</p>
    </li>
    <li className="py-2">Certification of report of birth issued by the Department of State (Forms DS-1350, FS-545 ,FS-240)</li>
    
    <li className="py-2">Original or certified copy of birth certificate issued by the State ,county, muncipal authority, or teritory of United States bearing an official seal</li>
    <li className="py-2">Native American tribal document</li>
    <li className="py-2">U.S. Citizen ID Card (Form I-197)</li>
    <li className="py-2">Identification Card for use of Resident Citizen in the United States(Form I-179)</li>
    <li className="py-2">Employment authorization document by the Department of Homeland 
      <p>
        For example see <span>Section 7</span> and <span className='font-semibold text-blue-600 underline'>Section 13</span> of the M-247 on <span className='font-semibold text-blue-600 underline'>uscis.gov/i-9-central</span>
      </p>
      <p>
        The Form I-766 Emplyment Authorization Document, is a List A, <span className='font-semibold'>Item Number 4 </span>.document, not a List C document. 
        </p></li>
  </ol>
</div>


        </div>


        <div className="max-w-6xl mx-auto p-4 font-sans">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider">
          Acceptable Receipts
        </h1>
        <p className="text-sm mt-1 font-semibold">
          May be presented in lieu of a document listed above for a temporary period.
        </p>
        <p className="text-sm font-semibold">
          For receipt validity dates, see the M-274.
        </p>
      </div>

      {/* Receipts Table */}
      <div className="border border-gray-800">
        {/* Table Header Row */}
        <div className="grid grid-cols-4 ">
          <div className="col-span-1 border-r border-b border-gray-800 p-6">
            <p className="text-sm ">
              <span className="font-bold ">. </span>Receipt for a replacement of a lost, stolen, or damaged List A document.
            </p>
          </div>
          <div className=" border-r border-b border-gray-800  items-center justify-center p-1">
            <p className="text-sm  font-bold">OR</p>
          </div>
          <div className="col-span-1 border-r border-b border-gray-800 p-1 ">
            <p className="text-sm p-2 ">
              Receipt for a replacement of a lost, stolen, or damaged List B document.
            </p>
          </div>
          <div className="col-span-1 p-2 border-b">
            <p className="text-sm">
              Receipt for a replacement of a lost, stolen, or damaged List C document.
            </p>
          </div>
        </div>

        {/* Form Rows */}
        <div className="grid grid-cols-4 border-b border-gray-800">
          <div className="col-span-1 border-r border-gray-800 p-1">
            <p className="text-sm">
              <span className="font-bold">. </span>Form I-bst issued to a lawful permanent resident that contains an I-S3 I stamp and a photograph of the individual.
            </p>
          </div>
          <div className="col-span-1 border-r border-gray-800"></div>
          <div className="col-span-1 border-r border-gray-800"></div>
          <div className="col-span-1"></div>
        </div>
        
        <div className="grid grid-cols-4">
          <div className="col-span-1 border-r border-gray-800 p-4">
            <p className="text-sm">
              <span className="font-bold">. </span>Form I-bst with &quot;RE&quot; notation or refugee stamp issued to a refugee.
            </p>
          </div>
          <div className="col-span-1 border-r border-gray-800"></div>
          <div className="col-span-1 border-r border-gray-800"></div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Reference Note */}
      <div className="mt-4">
        <p className="text-sm">
          <span className="font-bold">. </span>Refer to the Employment Authorization Extensions page on <span className="font-bold text-blue-600 underline">L8 Central</span> for more information.
        </p>
      </div>

      {/* Page Footer */}
      <div className="mt-6 border-t border-gray-800 pt-2 text-center">
        <p className="text-md mt-6">
          Form I-9  Edition: (IN/01/23) <span className='ml-114'> Page 2 of 4</span>Page 2 of 4
        </p>
      </div>
    </div>


    <div className="min-h-[1500px] w-[1030px]  mt-10 mx-auto p-4 bg-white text-black border border-gray-400">
    <div className="flex items-center justify-between mb-2">
        {/* Logo Section */}
        <div className="w-30 h-30">
          <Image 
            src="/logouss.png" 
            alt="USCIS Logo" 
            width={120}
            height={120}
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Heading Section */}
        <div className="text-center flex-1 ">
          <h1 className="text-xl font-bold whitespace-nowrap">Supplement B, </h1>
          <p className="text-xl font-bold whitespace-nowrap">Reverification and Rehire (formerly Section 3)
            </p><br />
          <p className="text-lg font-semibold whitespace-nowrap">
            Department of Homeland Security<br />
            <span className="text-gray-600 text-md font-medium">U.S. Citizenship and Immigration Services</span>
          </p>
        </div>

        {/* Form Number Section */}
        <div className="text-right text-[16px] font-semibold">
          <span className="text-xl font-semibold">USCIS<br />Form I-9</span><br />
          <span className="text-md font-medium whitespace-nowrap">OMB No. 1615-0047</span><br />
          <span className="text-md font-medium whitespace-nowrap">Expires 07/31/2026</span>
        </div>
      </div>

      <hr className='border-5 ' />
      <hr className='border mt-2 ' />

      {/* Top Input Row */}
      <div className="grid grid-cols-3 gap-1 border text-sm border-black mt-4">
        <div className="border-r border-black p-1">
          <label className="block text-[14px] mb-1">Last Name (Family Name) from Section 1.</label>
          <input type="text" className="w-full bg-blue-100 h-6" />
        </div>
        <div className="border-r border-black p-1">
          <label className="block text-sm mb-1">First Name (Given Name) from Section 1.</label>
          <input type="text" className="w-full  bg-blue-100 h-6" />
        </div>
        <div className="p-1">
          <label className="block text-sm mb-1">Middle Initial (if any) from Section 1.</label>
          <input type="text" className="w-full bg-blue-100 h-6" />
        </div>
      </div>

      {/* Instructions */}
      <div className="border border-t-0 border-black p-2 text-sm leading-tight">
        <p><strong>Instructions:</strong> This supplement replaces Section 3 on the previous version of Form I-9... </p>
        <p className="mt-1">
          <a href="#" className="text-blue-600 underline">Handbook for Employers: Guidance for Completing Form I-9 (M-274)</a>
        </p>
      </div>

      {/* Repeatable Section – Create 3x like in the form */}
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="border border-t-0 border-black mt-3 p-2 space-y-2">
          <div className="grid grid-cols-3 gap-1">
            <div>
              <label className="block text-sm">Date of Rehire (if applicable)</label>
              <input type="text" className="w-full bg-blue-100 h-6" />
            </div>
            <div className=''>
              <label className="block text-sm">Last Name (Family Name)</label>
              <input type="text" className="w-full bg-blue-100  h-6" />
            </div>
            <div>
              <label className="block text-sm">First Name (Given Name)</label>
              <input type="text" className="w-full bg-blue-100  h-6" />
            </div>
          </div>

          <div className='bg-gray-200 text-sm font-semibold'>
            <label className="block text-sm font-semibold">
              Reverification:
            </label>
            <p className="text-sm font-semibold bg-gray-200">
              If the employee requires reverification, your employee can choose to present...
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <div>
              <label className="block text-sm">Document Title</label>
              <input type="text" className="w-full bg-blue-100 h-6" />
            </div>
            <div>
              <label className="block text-sm">Document Number</label>
              <input type="text" className="w-full bg-blue-100 h-6" />
            </div>
            <div>
              <label className="block text-sm">Expiration Date (if any)</label>
              <input type="text" className="w-full bg-blue-100 h-6" />
            </div>
          </div>

          <div className="border border-gray-400 font-semibold p-2 text-sm">
            I attest, under penalty of perjury, that to the best of my knowledge, this employee is authorized...
          </div>

          <div className="grid grid-cols-3 gap-1">
            <div>
              <label className="block text-sm">Name of Employer or Authorized Representative</label>
              <input type="text" className="w-full bg-blue-100 h-12" />
            </div>
            <div>
              <label className="block text-sm text-nowrap">Signature of Employer or Authorized Representative</label>
              <div className="border border-gray-300 rounded">
                <SignaturePad
                  ref={finalSignaturePadRef}
                  canvasProps={{
                    className: 'signature-canvas w-full h-32 bg-white',
                  }}
                  onEnd={handleFinalSignatureChange}
                />
              </div>
              <button
                type="button"
                onClick={clearFinalSignature}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Clear Signature
              </button>
            </div>
            <div className='ml-6'>
              <label className="block text-sm ml-6">Today&apos;s Date</label>
              <input type="text" className="w-full bg-blue-100 h-12" />
            </div>
          </div>

          <div>
            <label className="block text-sm">Additional Information (initial and date each notation.)</label>
            <input type="text" className="w-full bg-blue-100 h-6" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" className="w-4 h-4" />
            <label className="text-sm">Check here if you used an alternative procedure authorized by DHS to examine documents.</label>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-6 border-t border-gray-800 pt-2 text-center">
        <p className="text-md mt-6">
          Form I-9  Edition: (IN/01/23) <span className='ml-114'> Page 4 of 4</span>
        </p>
      </div>
</div>



        {/* Footer */}
        <div className="text-center mt-8 pt-4  text-lg border-t-2 border-black">
        <p className="text-[16px] text-center text-gray-600 mb-20 ">Form I-9 Edition 08/01/23 • Page 1 of 4</p>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
        
         
          <button 
            type="submit"
            className={`bg-black text-white px-26 py-4 rounded transition-colors`}
          >
            Submit Form
          </button>
        </div>
      </div>
    
    </form>
  );
}
