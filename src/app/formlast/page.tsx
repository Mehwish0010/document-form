"use client"
import W4WithholdingTables from "../../components/ui/tables";
import { useState, useEffect } from "react";

// Define the interface for form data
interface W4FormData {
  // Personal Information
  firstName: string;
  middleInitial: string;
  lastName: string;
  socialSecurityNumber: string;
  address: string;
  cityStateZip: string;
  
  // Filing Status
  filingStatus: {
    single: boolean;
    marriedJointly: boolean;
    headOfHousehold: boolean;
  };

  // Step 2 - Multiple Jobs
  multipleJobs: {
    useEstimator: boolean;
    useWorksheet: boolean;
    twoJobsOnly: boolean;
  };

  // Step 3 - Dependents
  dependents: {
    qualifyingChildren: number;
    otherDependents: number;
    totalCredits: number;
  };

  // Step 4 - Other Adjustments
  otherAdjustments: {
    otherIncome: number;
    deductions: number;
    extraWithholding: number;
  };

  // Employer Information
  employerInfo: {
    name: string;
    address: string;
    firstDateOfEmployment: string;
    ein: string;
  };
}

// app/w4/page.tsx
export default function W4FormHeader() {
    // Initialize form state
    const [formData, setFormData] = useState<W4FormData>({
      firstName: '',
      middleInitial: '',
      lastName: '',
      socialSecurityNumber: '',
      address: '',
      cityStateZip: '',
      filingStatus: {
        single: false,
        marriedJointly: false,
        headOfHousehold: false
      },
      multipleJobs: {
        useEstimator: false,
        useWorksheet: false,
        twoJobsOnly: false
      },
      dependents: {
        qualifyingChildren: 0,
        otherDependents: 0,
        totalCredits: 0
      },
      otherAdjustments: {
        otherIncome: 0,
        deductions: 0,
        extraWithholding: 0
      },
      employerInfo: {
        name: '',
        address: '',
        firstDateOfEmployment: '',
        ein: ''
      }
    });

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
      if (notification) {
        const timer = setTimeout(() => setNotification(null), 5000);
        return () => clearTimeout(timer);
      }
    }, [notification]);

    // Handle text input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // Handle nested object changes
    const handleNestedChange = (section: keyof W4FormData, field: string, value: string | number | boolean) => {
      setFormData(prev => {
        const sectionData = prev[section] as Record<string, unknown>;
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      });
    };

    // Handle checkbox changes for filing status
    const handleFilingStatusChange = (status: string) => {
      setFormData(prev => ({
        ...prev,
        filingStatus: {
          single: status === 'single',
          marriedJointly: status === 'marriedJointly',
          headOfHousehold: status === 'headOfHousehold'
        }
      }));
    };

    // Update handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const data = new FormData();

      // Append all fields
      data.append('firstName', formData.firstName);
      data.append('middleInitial', formData.middleInitial);
      data.append('lastName', formData.lastName);
      data.append('socialSecurityNumber', formData.socialSecurityNumber);
      data.append('address', formData.address);
      data.append('cityStateZip', formData.cityStateZip);
      data.append('filingStatus', JSON.stringify(formData.filingStatus));
      data.append('multipleJobs', JSON.stringify(formData.multipleJobs));
      data.append('dependents', JSON.stringify(formData.dependents));
      data.append('otherAdjustments', JSON.stringify(formData.otherAdjustments));
      data.append('employerName', formData.employerInfo.name);
      data.append('employerAddress', formData.employerInfo.address);
      data.append('employerFirstDate', formData.employerInfo.firstDateOfEmployment);
      data.append('employerEIN', formData.employerInfo.ein);

      try {
        const response = await fetch('/api/formlast', {
          method: 'POST',
          body: data,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setNotification({ message: errorData.error || 'Failed to submit form', type: 'error' });
          return;
        }

        const result = await response.json();
        if (result.success) {
          setNotification({ message: '✅ Your W-4 form has been submitted successfully! Thank you for completing your Employee\'s Withholding Certificate. If you have any questions, please contact your HR department.', type: 'success' });
          // Reset form after successful submission
          setFormData({
            firstName: '',
            middleInitial: '',
            lastName: '',
            socialSecurityNumber: '',
            address: '',
            cityStateZip: '',
            filingStatus: {
              single: false,
              marriedJointly: false,
              headOfHousehold: false
            },
            multipleJobs: {
              useEstimator: false,
              useWorksheet: false,
              twoJobsOnly: false
            },
            dependents: {
              qualifyingChildren: 0,
              otherDependents: 0,
              totalCredits: 0
            },
            otherAdjustments: {
              otherIncome: 0,
              deductions: 0,
              extraWithholding: 0
            },
            employerInfo: {
              name: '',
              address: '',
              firstDateOfEmployment: '',
              ein: ''
            }
          });
        } else {
          setNotification({ message: result.error || 'Failed to submit form', type: 'error' });
        }
      } catch (err) {
        console.error('Form submission error:', err);
        setNotification({ message: err instanceof Error ? err.message : 'Failed to submit form. Please try again or contact support.', type: 'error' });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-[1100px] mx-auto p-2 sm:p-4 border-2 border-gray-300 text-black text-xs sm:text-sm leading-[1.4] font-sans">
        {/* Top Row */}
        <div className="flex justify-between items-start border-b-2">
          {/* Left Box */}
          <div className="flex justify-between items-start w-full">
            {/* Left Box */}
            <div className="text-left border-r-2 p-3 sm:p-6">
              <div className="text-[10px] sm:text-[12px] font-semibold">Form</div>
              <div className="text-3xl sm:text-5xl font-extrabold leading-none">W-4</div>
              <div className="text-[6px] sm:text-[8px]">Department of the Treasury</div>
              <div className="text-[6px] sm:text-[8px]">Internal Revenue Service</div>
            </div>

            {/* Center Title */}
            <div className="text-center px-2 sm:px-4">
              <div className="text-xl sm:text-3xl font-bold">Employee&#39;s Withholding Certificate</div>
              <div className="text-[11px] sm:text-[13px] font-bold mt-1">
                Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.
                <br />
                Give Form W-4 to your employer.
                <br />
                Your withholding is subject to review by the IRS.
              </div>
            </div>

            {/* Right Box */}
            <div className="text-right text-[6px] sm:text-[8px] border-l-2 p-6 sm:p-10">
              <div className="border-b-2">OMB No. 1545-0074</div>
              <div className="text-3xl sm:text-5xl font-bold">2025</div>
            </div>
          </div>
        </div>

        {/* Step 1 Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mt-3 w-full border-b-2">
          {/* Left: Step Title */}
          <div className="text-[13px] sm:text-[15px] font-bold whitespace-nowrap mb-2 sm:mb-0">
            Step 1: Enter Personal Information
          </div>

          {/* Middle: Form Fields */}
          <div className="flex flex-col gap-2 w-full border-l mr-2">
            {/* Top row: First, Last, SSN */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-b-2">
              <div className="w-full sm:w-1/3 mb-2">
                <label className="block text-[12px] sm:text-[14px] font-semibold ml-2">(a) First name and middle initial</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="h-8 sm:h-10 border ml-2 border-gray-300 bg-blue-100 w-full px-2 text-xs sm:text-sm"
                />
              </div>
              <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                <label className="block text-[12px] sm:text-[14px] font-semibold ml-1">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-8 sm:h-10 border border-gray-300 mr-3 bg-blue-100 w-full px-2 text-xs sm:text-sm"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-[12px] sm:text-[14px] font-semibold">(b) Social security number</label>
                <input
                  type="text"
                  name="socialSecurityNumber"
                  value={formData.socialSecurityNumber}
                  onChange={handleInputChange}
                  className="h-8 sm:h-10 border border-gray-300 bg-blue-100 w-full px-2 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Second row: Address + Filing Status */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
              {/* Address input */}
              <div className="w-full sm:w-2/3 border-b-2">
                <label className="block text-[12px] sm:text-[14px] font-semibold ml-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="h-8 sm:h-10 bg-blue-100 mt-4 border-gray-300 ml-2 w-full px-2 text-xs sm:text-sm"
                />
              </div>

              {/* Filing Status checkboxes */}
              <div className="w-full sm:w-1/3 p-2 sm:p-3 border-l-2 border-b">
                <p className="text-[10px] sm:text-[12px]"><span className="font-bold">Does your name match the 
                name on your social security 
                card?</span> If not, to ensure you get 
                credit for your earnings, 
                contact SSA at 800-772-1213 
                or go to www.ssa.gov.</p>
              </div>
            </div>

            {/* Last row: City/ZIP */}
            <div className="border-b-2 mb-2">
              <label className="block text-[14px] sm:text-[16px] font-semibold ml-2 mb-2">City or town, state, and ZIP code</label>
              <input
                type="text"
                name="cityStateZip"
                value={formData.cityStateZip}
                onChange={handleInputChange}
                className="h-8 sm:h-10 ml-2 mb-2 bg-blue-100 w-full px-2 text-xs sm:text-sm"
              />
            </div>

            {/* Filing Status */}
            <div className="font-semibold text-[14px] sm:text-[16px]">(c) Filing Status</div>
            <div className="text-[11px] sm:text-[13px] mt-1 space-y-1">
              <div className="flex items-start space-x-2 font-semibold">
                <input
                  type="checkbox"
                  checked={formData.filingStatus.single}
                  onChange={() => handleFilingStatusChange('single')}
                  className="mt-[2px] font-semibold"
                />
                <span>Single or Married filing separately</span>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.filingStatus.marriedJointly}
                  onChange={() => handleFilingStatusChange('marriedJointly')}
                  className="mt-[2px]"
                />
                <span>Married filing jointly or Qualifying surviving spouse</span>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.filingStatus.headOfHousehold}
                  onChange={() => handleFilingStatusChange('headOfHousehold')}
                  className="mt-[2px]"
                />
                <span>
                  Head of household{' '}
                  <span className="italic">
                    (Check only if you&apos;re unmarried and pay more than half the costs of keeping up a home for yourself and a qualifying individual.)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 - Multiple Jobs */}
        <div className="flex flex-col sm:flex-row">
          <div>
            <p className="font-bold text-base sm:text-lg mt-4">
              Step 2: <br/>
              Multiple Jobs <br/>
              or Spouse <br/>
              Works<br/>
            </p>
          </div>
          <div className="ml-0 sm:ml-30">
            <p className="text-[14px] sm:text-[16px] mt-5">
              Complete this step if you (1) hold more than one job at a time, or (2) are married filing jointly and your spouse 
              also works. The correct amount of withholding depends on income earned from all of these jobs.
              Do only one of the following.
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.multipleJobs.useEstimator}
                  onChange={(e) => handleNestedChange('multipleJobs', 'useEstimator', e.target.checked)}
                  className="mt-[2px]"
                />
                <span className="text-[12px] sm:text-[14px]">(a) Use the estimator at www.irs.gov/W4App for the most accurate withholding for this step (and Steps 3–4). If 
                you or your spouse have self-employment income, use this option;</span>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.multipleJobs.useWorksheet}
                  onChange={(e) => handleNestedChange('multipleJobs', 'useWorksheet', e.target.checked)}
                  className="mt-[2px]"
                />
                <span className="text-[12px] sm:text-[14px]">(b) Use the Multiple Jobs Worksheet on page 3 and enter the result in Step 4(c) below;</span>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.multipleJobs.twoJobsOnly}
                  onChange={(e) => handleNestedChange('multipleJobs', 'twoJobsOnly', e.target.checked)}
                  className="mt-[2px]"
                />
                <span className="text-[12px] sm:text-[14px]">(c) If there are only two jobs total, you may check this box. Do the same on Form W-4 for the other job.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Dependents */}
        <div className="flex flex-col sm:flex-row border-b-2">
          <div>
            <p className="font-bold text-base sm:text-lg mt-4">
              Step 3: <br/>
              Claim <br/>
              Dependent <br/>
              and other<br/>
              Credits 
            </p>
          </div>
          <div className="ml-0 sm:ml-30">
            <div className="p-2 sm:p-3 text-[14px] sm:text-[16px]">
              <div className="text-[14px] sm:text-[16px] mb-3">
                If your total income will be $200,000 or less ($400,000 or less if married filing jointly):
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] sm:text-[16px] flex-1">Multiply the number of qualifying children under age 17 by $2,000</div>
                  <div className="text-[12px] sm:text-[16px] mr-2">$</div>
                  <div className="w-16 sm:w-20">
                    <input
                      type="number"
                      value={formData.dependents.qualifyingChildren}
                      onChange={(e) => handleNestedChange('dependents', 'qualifyingChildren', parseInt(e.target.value) || 0)}
                      className="w-full border-0 border-b border-black bg-transparent focus:outline-none h-6 text-xs sm:text-sm text-right"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[12px] sm:text-[16px] flex-1">Multiply the number of other dependents by $500</div>
                  <div className="text-[12px] sm:text-[16px] mr-2">$</div>
                  <div className="w-16 sm:w-20">
                    <input
                      type="number"
                      value={formData.dependents.otherDependents}
                      onChange={(e) => handleNestedChange('dependents', 'otherDependents', parseInt(e.target.value) || 0)}
                      className="w-full border-0 border-b border-black bg-transparent focus:outline-none h-6 text-xs sm:text-sm text-right"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[12px] sm:text-[16px] flex-1">
                    Add the amounts above for qualifying children and other dependents. You may add to this the amount of
                    any other credits. Enter the total here
                  </div>
                  <div className="text-[12px] sm:text-[16px] mr-2">$</div>
                  <div className="w-16 sm:w-20">
                    <input
                      type="number"
                      value={formData.dependents.totalCredits}
                      onChange={(e) => handleNestedChange('dependents', 'totalCredits', parseInt(e.target.value) || 0)}
                      className="w-full border-0 border-b border-black bg-transparent focus:outline-none h-6 text-xs sm:text-sm text-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 - Other Adjustments */}
        <div className="flex flex-col sm:flex-row border-b-2">
          <div>
            <p className="font-bold text-base sm:text-lg mt-4">
              Step 4: <br/>
              (Optional)<br/>
              Other <br/>
              Adjustment<br/>
            </p>
          </div>
          <div className="ml-0 sm:ml-30">
            <div className="p-2 sm:p-3 text-[14px] sm:text-[16px]">
              <div className="text-[12px] sm:text-[16px] mb-3">
                a) Other income (not from jobs). If you want tax withheld for other income you 
                expect this year that won&#39;t have withholding, enter the amount of other income here. 
                This may include interest, dividends, and retirement income . . . . . . . .
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[12px] sm:text-[16px] flex-1"></div>
                <div className="text-[12px] sm:text-[16px] mr-2">4(a) $</div>
                <div className="w-16 sm:w-20">
                  <input
                    type="number"
                    value={formData.otherAdjustments.otherIncome}
                    onChange={(e) => handleNestedChange('otherAdjustments', 'otherIncome', parseFloat(e.target.value) || 0)}
                    className="w-full border-0 border-b bg-blue-100 border-black focus:outline-none h-6 text-xs sm:text-sm text-right"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] sm:text-[16px] flex-1">b) Deductions. If you expect to claim deductions other than the standard deduction and 
                  want to reduce your withholding, use the Deductions Worksheet on page 3 and enter 
                  the result here . . . . . . . . . . . . . . . . . . . . . . .</div>
                  <div className="text-[12px] sm:text-[16px] mr-2">4(b) $</div>
                  <div className="w-16 sm:w-20">
                    <input
                      type="number"
                      value={formData.otherAdjustments.deductions}
                      onChange={(e) => handleNestedChange('otherAdjustments', 'deductions', parseFloat(e.target.value) || 0)}
                      className="w-full border-0 border-b border-black bg-blue-100 focus:outline-none h-6 text-xs sm:text-sm text-right"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[12px] sm:text-[16px] flex-1">c) Extra withholding. Enter any additional tax you want withheld each pay period . .</div>
                  <div className="text-[12px] sm:text-[16px] mr-2">4(c) $</div>
                  <div className="w-16 sm:w-20">
                    <input
                      type="number"
                      value={formData.otherAdjustments.extraWithholding}
                      onChange={(e) => handleNestedChange('otherAdjustments', 'extraWithholding', parseFloat(e.target.value) || 0)}
                      className="w-full border-0 border-b border-black bg-blue-100 focus:outline-none h-6 text-xs sm:text-sm text-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 - Sign Here */}
        <div className="flex flex-col sm:flex-row border-b-2">
          <div>
            <p className="font-bold text-base sm:text-lg mt-4">
              Step 5: <br/>
              Sign<br/>
              Here <br/>
            </p>
          </div>
          <div className="ml-0 sm:ml-30">
            <div className="p-2 sm:p-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                <div className="">
                  <div className="text-[14px] sm:text-[16px] mb-1">Employer&#39;s name and address</div>
                  <div className="h-12 sm:h-16 p-1">
                    <textarea
                      name="employerInfo.name"
                      value={formData.employerInfo.name}
                      onChange={handleInputChange}
                      className="w-full h-full mt-6 sm:mt-8 focus:outline-none bg-blue-100 text-[10px] sm:text-xs"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[14px] sm:text-[16px] mb-1">First date of employment</div>
                  <input
                    type="text"
                    name="employerInfo.firstDateOfEmployment"
                    value={formData.employerInfo.firstDateOfEmployment}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b mt-6 sm:mt-8 bg-blue-100 focus:outline-none h-12 sm:h-16 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <div className="text-[14px] sm:text-[16px] mb-1">Employer identification number (EIN)</div>
                  <input
                    type="text"
                    name="employerInfo.ein"
                    value={formData.employerInfo.ein}
                    onChange={handleInputChange}
                    className="w-full border-0 border-b mt-6 sm:mt-8 h-12 sm:h-16 border-black bg-blue-100 focus:outline-none text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 border-gray-800 pt-2 text-center">
          <div className="text-[12px] sm:text-[16px] font-semibold mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-36">
            <span>For Privacy Act and Paperwork Reduction Act Notice, see page 3</span>
            <span>Cat. No. 10220Q</span>
            <span className="font-bold text-[16px] sm:text-[20px]">Form W-4 (2025)</span>
          </div>
        </div>

        <W4WithholdingTables />
        {/* Notification ABOVE the button */}
        {notification && (
          <div className={`mt-4 mb-4 p-4 rounded border flex items-center justify-between shadow-lg transition-all duration-300 ${notification.type === 'success' ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800'}`}>
            <span className="text-base sm:text-lg font-semibold">{notification.message}</span>
            <button type="button" className="ml-4 font-bold text-xl focus:outline-none" onClick={() => setNotification(null)} aria-label="Close">&times;</button>
          </div>
        )}
        <div className="mt-4 sm:mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-black text-base sm:text-xl font-semibold text-white px-4 sm:px-60 py-2 sm:py-4 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
          >
            Submit Form
          </button>
        </div>
      </form>
    );
}
  
