
import Image from 'next/image';
import React from 'react';

export default function EmploymentForm() {
  return (
    <div className="max-w-[1100px] mx-auto  border border-black p-4 text-[16px] leading-tight font-serif">
      <div className="flex items-center justify-between mb-2">
        {/* Logo Section */}
        <div className="w-30 h-30">
          <Image src="/logouss.png" alt="USCIS Logo" className="w-full h-full object-contain" />
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
          <div><label className="text-sm font-medium ml-2">Last Name (Family Name)</label><input className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-sm font-medium">First Name (Given Name)</label><input className="border border-black p-1 w-full bg-blue-100" placeholder="" /></div>
          <div><label className="text-sm font-medium">Middle Initial</label><input className="border border-black p-1 w-full  bg-blue-100" placeholder="" /></div>
          <div><label className="text-sm font-medium">Other Last Names Used (if any)</label><input className="border border-black  p-1 w-full bg-blue-100" placeholder="" /></div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
  {/* Address */}
  <div className="flex flex-col w-[250px]">
    <label className="text-sm font-medium ml-2">Address (Street Number and Name)</label>
    <input className="border border-black p-1 w-full  bg-blue-100" />
  </div>

  {/* Apt Number */}
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium">Apt. Number (if any)</label>
    <input className="border border-black   bg-blue-100 p-1 w-full" />
  </div>

  {/* City */}
  <div className="flex flex-col w-[200px]">
    <label className="text-sm font-medium ml-2">City or Town</label>
    <input className="border border-black  bg-blue-100 p-1 w-full" />
  </div>

  {/* State */}
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium">State</label>
    <input className="border border-black   bg-blue-100 p-1 w-full" />
  </div>

  {/* ZIP Code */}
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium">ZIP Code</label>
    <input className="border border-black bg-blue-100 p-1 w-full" />
  </div>
</div>

        <div className="grid grid-cols-4 gap-2 mt-2">
          <div><label className="text-sm font-medium ml-2">Date of Birth (mm/dd/yyyy)</label><input className="border  bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-sm font-medium">U.S. Social Security Number</label><input className="border  bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-sm font-medium">Employee&#39;s Email Address</label><input className="border  bg-blue-100 border-black p-1 w-full" placeholder="" /></div>
          <div><label className="text-sm font-medium">Employee&#39;s Telephone Number</label><input className="border border-black p-1   bg-blue-100 w-full" placeholder="" /></div>
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
    <input type="text" className="w-full p-2 bg-blue-100 text-xs" />
  </div>
  <div className="w-[48%]">
    <label className="block font-medium">Today&#39;s Date (mm/dd/yyyy)</label>
    <input type="text" className=" w-full p-2  bg-blue-100 text-xs" />
  </div>
</div>
</div>
<div className="mb-4 bg-gray-200">
        <h2 className="font-bold bg-gray-200">Section 2. Employer Review and Verification:</h2>
        <p className=" bg-gray-200">
          Employee or their authorized representative must complete and sign Section 2 within three business days after the employment date, 
          as a result of any change in the company&#39;s performance. For example, the employee or employee who is not eligible for employment 
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
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Issuing Authority</td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200 ">Document Number (if any)</td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Expiration Date (if any)</td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
      
    </tr>
    
    {/* Document 2 */}
    <tr>
      <td className="border border-gray-800 p-1 font-bold  bg-gray-200">Document Title 2 (if any)</td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 h-8"></td>
      <td className="border border-gray-800 p-1 align-top  " rowSpan={8} >
  <span className='text-md font-semibold bg-gray-200 w-full'>  Additional Information</span> 
        <div className="flex items-start mt-40 h-full text-sm">
          <input 
            type="checkbox" 
            id="alternative-procedure" 
            className="mt-0.5 mr-1" 
          />
          <label htmlFor="alternative-procedure">
            Check here if you used an alternative procedure authorized by DHG to examine documents.
          </label>
        </div>
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Issuing Authority</td>
      <td className="border border-gray-800 p-1 h-8"></td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Document Number (if any)</td>
      <td className="border border-gray-800 p-1 h-8"></td>
    
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Expiration Date (if any)</td>
      <td className="border border-gray-800 p-1 h-8"></td>
    
    </tr>
    
    {/* Document 3 */}
    <tr>
      <td className="border border-gray-800 p-1 font-bold  bg-gray-200">Document Title 3 (if any)</td>
      <td className="border border-gray-800 p-1 h-8"></td>
     
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Issuing Authority</td>
      <td className="border border-gray-800 p-1 h-8"></td>
     
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Document Number (if any)</td>
      
      <td className="border border-gray-800 p-1" rowSpan={2}>
       
      </td>
    </tr>
    <tr>
      <td className="border border-gray-800 p-1  bg-gray-200">Expiration Date (if any)</td>
     
      
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
      <div className="text-xs mb-1">Today&#39s Date (mm/dd/yyyy)</div>
      <div className="border border-gray-800 h-8"></div>
    </div>
  </div>
</td>
    </tr>
    
    {/* Signature Section */}
    <tr>
      <td className="border border-gray-800 p-1 text-nowrap" colSpan={2}>
        <div>Last Name: First Name and Title of Employer or Authorized Representative</div>
        <div className="  h-8 mt-1"></div>
      </td>
      <td className="border border-gray-800 p-1" colSpan={2}>
        <div>Signature of Employer or Authorized Representative</div>
        <div className="h-8 mt-1"></div>
      </td>
    </tr>
    
    {/* Employer Information */}
    <tr>
      <td className="border border-gray-800 p-1" colSpan={2}>
        <div>Employer&#39s Business or Organization Name</div>
        <div className=" h-8 mt-1"></div>
      </td>
      <td className="border border-gray-800 p-1" colSpan={2}>
        <div>Employer&#39;s Business or Organization Address (Street Address, City, State, ZIP Code)</div>
        <div className=" h-8 mt-1"></div>
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
    <li className="py-2 ">Driver&#39;s license or ID issued by a State  or outlying possession of the United States provided.It contains a photoraph or information such as name , date of birth, gender, height, eye color, and address.</li>
    <li className="py-2 ">ID card issued by federal, state, or local government agencies or entities, provided it conmtains a photograph or information such as name, date of birth, gender, height, eye color and address</li>
    <li className="py-2 ">School ID card with a photograph</li>
    <li className="py-2 ">Voter&#39;s registration card</li>
    <li className="py-2 ">U.S. Military card or draft record</li>
    <li className="py-2" >Military dependent&#39;s ID card</li>
    <li className="py-2">U.S. Coast Guard Merchant Mariner Card</li>
    <li className="py-2 ">Native American tribal document</li>
    <li className="py-2">Canadian driver&#39;s license</li>
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
          <Image src="/logouss.png" alt="USCIS Logo" className="w-full h-full object-contain" />
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
    

      <div className="border border-black text-sm mb-4">
        <div className="grid grid-cols-3 border-b border-black">
          <div className="border-r border-black p-1 text-nowrap mt-4">
            Last Name (Family Name) from <strong>Section 1.</strong>
            <input type="text" placeholder="" className="block w-full mt-2  bg-blue-100 p-1 text-sm" />
          </div>
          <div className="border-r border-black p-1 text-nowrap mt-4">
            First Name (Given Name) from <strong>Section 1.</strong>
            <input type="text" placeholder="" className="block w-full mt-2   bg-blue-100 p-1 text-sm" />
          </div>
          <div className="p-4 text-nowrap">
            Middle Initial (if any) from <strong>Section 1.</strong>
            <input type="text" placeholder="" className="block bg-blue-100  w-full mt-2   p-1 text-sm" />
          </div>
        </div>
      </div>

      <p className="text-md  mb-6 font-serif ">
        <strong>Instructions:</strong> This supplement must be completed by any preparer and/or translator who assists an employee in completing Section 1
        of Form I-9. The preparer and/or translator must enter the employee&#39;s name in the spaces provided above. Each prepare or translator
        must complete, sign, and date a separate certification area. Employers must retain completed supplement sheets with the employee’s
        completed Form I-9.
      </p>

      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-base mb-2 p-1">
          <p className="mb-4 font-semibold bg-gray-200">
            I attest, under penalty of perjury, that I have assisted in the completion of Section 1 of this form and that to the best of my knowledge the information is true and correct.
          </p>
          <div className="grid grid-cols-2 border ">
            <div className="border-r p-2">
              Signature of Preparer or Translator
              <input type="text" placeholder="" className="block w-full   bg-blue-100 p-2 text-sm" />
            </div>
            <div className="p-2">
              Date (mm/dd/yyyy)
              <input type="date" className="block w-full mt-2 border   bg-blue-100 border-gray-300 p-1 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 border-t ">
            <div className="border-r border-l border-black p-2">
              Last Name (Family Name)
              <input type="text" placeholder="" className="block bg-blue-100 w-full mt-2 p-1 text-sm" />
            </div>
            <div className="border-r border-black p-2">
              First Name (Given Name)
              <input type="text" placeholder="" className="block  bg-blue-100 w-full mt-2  p-1 text-sm" />
            </div>
            <div className="p-2 border-r">
              Middle Initial (if any)
              <input type="text" placeholder="" className="block w-full  bg-blue-100 mt-2  p-1 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-5 border-t border-black">
            <div className="border-r border-black p-4 col-span-2 border-b border-l">
              Address (Street Number and Name)
              <input type="text" placeholder="" className="block w-full mt-2    bg-blue-100 p-1 text-sm" />
            </div>
            <div className="border-r border-black p-2 border-b">
              City or Town
              <input type="text" placeholder="" className="block w-full   bg-blue-100 mt-2 p-1 text-sm" />
            </div>
            <div className="border-r border-black p-2 border-b">
              State
              <input type="text" placeholder="" className="block w-full   bg-blue-100 mt-2  p-1 text-sm" />
            </div>
            <div className="p-2 border-b border-r">
              ZIP Code
              <input type="text" placeholder="" className="block w-full   bg-blue-100 mt-2  p-1 text-sm" />
            </div>
          </div>
        </div>
      ))}



    </div>
    
    <div className="mt-6 border-t border-gray-800 pt-2 text-center">
        <p className="text-md mt-6">
          Form I-9  Edition: (IN/01/23) <span className='ml-114'> Page 3 of 4</span>
        </p>
      </div>


      <div className="min-h-[1500px] w-[1030px]  mt-10 mx-auto p-4 bg-white text-black border border-gray-400">
    <div className="flex items-center justify-between mb-2">
        {/* Logo Section */}
        <div className="w-30 h-30">
          <Image src="/logouss.png" alt="USCIS Logo" className="w-full h-full object-contain" />
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
              <label className="block text-sm  text-nowrap">Signature of Employer or Authorized Representative</label>
              <input type="text" className="w-full bg-blue-100 h-12" />
            </div>
            <div className='ml-6'>
              <label className="block text-sm ml-6" >Today&#39s Date</label>
              <input type="text" className="w-full  bg-blue-100 h-12" />
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
      </div>
    </div>



  );
}
