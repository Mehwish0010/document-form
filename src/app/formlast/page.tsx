import W4WithholdingTables from "../../components/ui/tables";

// app/w4/page.tsx
export default function W4FormHeader() {
    return (
      <div className="max-w-[1100px] mx-auto p-4 border-2 border-gray-300 text-black text-sm leading-[1.4] font-sans">
        {/* Top Row */}
        <div className="flex justify-between items-start border-b-2 ">
  {/* Left Box */}
  <div className="flex justify-between items-start w-full">
  {/* Left Box */}
  <div className="text-left border-r-2 p-6 ">
    <div className="text-[12px] font-semibold">Form</div>
    <div className="text-5xl font-extrabold leading-none">W-4</div>
    <div className="text-[8px]">Department of the Treasury</div>
    <div className="text-[8px]">Internal Revenue Service</div>
  </div>

  {/* Center Title */}
  <div className="text-center px-4">
    <div className="text-3xl font-bold">Employee’s Withholding Certificate</div>
    <div className="text-[13px] font-bold mt-1">
      Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay.
      <br />
      Give Form W-4 to your employer.
      <br />
      Your withholding is subject to review by the IRS.
    </div>
  </div>

  {/* Right Box */}
  <div className="text-right text-[8px] border-l-2  p-10">
    <div className="border-b-2">OMB No. 1545-0074</div>
    <div className="text-5xl font-bold">2025</div>
  </div>
</div>
</div>

  
        {/* Step 1 Title */}
        <div className="flex justify-between items-start gap-4 mt-3 w-full border-b-2 ">
  {/* Left: Step Title */}
  <div className="text-[15px]  font-bold  whitespace-nowrap ">
    Step 1: Enter Personal Information
  </div>

  {/* Middle: Form Fields */}
  <div className="flex flex-col gap-2  w-full border-l mr-2 ">
  {/* Top row: First, Last, SSN */}
  <div className="flex gap-4 w-full border-b-2">
    <div className="w-1/3 mb-2 ">
      <label className="block text-[14px] font-semibold ml-2"> (a) First name and middle initial</label>
      <div className="h-10 border ml-2 border-gray-300 bg-blue-100" />
    </div>
    <div className="w-1/3 ml-2 ">
      <label className="block text-[14px] font-semibold ml-1">Last name</label>
      <div className="h-10 border border-gray-300 mr-3 bg-blue-100" />
    </div>
    <div className="w-1/3">
      <label className="block text-[14px] font-semibold"> (b) Social security number</label>
      <div className="h-10 border border-gray-300 bg-blue-100" />
    </div>
  </div>

  {/* Second row: Address + Filing Status (in flex) */}
  <div className="flex gap-4 w-full ">
    {/* Address input */}
    <div className="w-2/3 border-b-2">
      <label className="block text-[14px] font-semibold ml-2">Address</label>
      <div className="h-10  bg-blue-100 mt-4 border-gray-300 ml-2" />
    </div>

    {/* Filing Status checkboxes beside Address */}
    <div className="w-1/3 p-3  border-l-2 border-b">
    <p className=""><span className="font-bold">Does your name match the 
name on your social security 
card?</span> If not, to ensure you get 
credit for your earnings, 
contact SSA at 800-772-1213 
or go to www.ssa.gov.</p>
  </div>
  </div>

  {/* Last row: City/ZIP */}
  <div className="border-b-2 mb-2">
    <label className="block text-[16px]  font-semibold ml-2 mb-2">City or town, state, and ZIP code</label>
    <div className="h-10  w-130  ml-2 mb-2 bg-blue-100" />
  </div>
  <div className="w-1/3 pt-[2px] ml-2 ">
      <div className="font-semibold text-[16px]"> (c) Filing Status</div>
      <div className="text-[13px] mt-1 space-y-1">
        <div className="flex items-start space-x-2 font-semibold">
          <input type="checkbox" className="mt-[2px] font-semibold" />
          <span>Single or Married filing separately</span>
        </div>
        <div className="flex items-start space-x-2">
          <input type="checkbox" className="mt-[2px]" />
          <span>Married filing jointly or Qualifying surviving spouse</span>
        </div>
        <div className="flex items-start space-x-2">
          <input type="checkbox" className="mt-[2px]" />
          <span>
            Head of household{' '}
            <span className="italic">
              (Check only if you’re unmarried and pay more than half the costs of keeping up a home for yourself and a qualifying individual.)
            </span>
          </span>
        </div>
      </div>
    </div>
</div>


</div>


<div className="mt-4 border-b-2">
    <p className="text-[16px] mt-5  ">
        <span className="font-bold">TIP:</span> Consider using the estimator at www.irs.gov/W4App to determine the most accurate withholding for the rest of the year if: you 
are completing this form after the beginning of the year; expect to work only part of the year; or have changes during the year in your 
marital status, number of jobs for you (and/or your spouse if married filing jointly), dependents, other income (not from jobs), 
deductions, or credits. Have your most recent pay stub(s) from this year available when using the estimator. At the beginning of next 
year, use the estimator again to recheck your withholding. 

    </p>
    <p className="text-[16px] mb-5">
        <span className=" font-bold">Complete Steps 2–4 ONLY if they apply to you; otherwise, skip to Step 5</span>See page 2 for more information on each step, who can 
        claim exemption from withholding, and when to use the estimator at www.irs.gov/W4App.
    </p>
</div>


<div className=" flex ">
<div>
    <p className="font-bold text-lg mt-4">
    Step 2: <br/>
 Multiple Jobs <br/>
or Spouse <br/>
Works<br/>
    </p>
    </div>
    <div className="ml-30">
<p className="text-[16px] mt-5">
Complete this step if you (1) hold more than one job at a time, or (2) are married filing jointly and your spouse 
also works. The correct amount of withholding depends on income earned from all of these jobs.
Do only one of the following.
(a) Use the estimator at www.irs.gov/W4App for the most accurate withholding for this step (and Steps 3–4). If 
you or your spouse have self-employment income, use this option; or
(b) Use the Multiple Jobs Worksheet on page 3 and enter the result in Step 4(c) below; or
(c) If there are only two jobs total, you may check this box. Do the same on Form W-4 for the other job. This 
option is generally more accurate than (b) if pay at the lower paying job is more than half of the pay at the 
higher paying job. Otherwise, (b) is more accurate . . . . . . . . . . . . . . . . .
</p>
    </div>




    </div>


    <div className="mt-5 text-[16px] border-b-2">
    <p className="mb-5">
        <span className="font-bold ">Complete Steps 3–4(b) on Form W-4 for only ONE of these jobs.</span>Leave those steps blank for the other jobs. (Your withholding will 
            be most accurate if you complete Steps 3–4(b) on the Form W-4 for the highest paying job.)
    </p>
</div>



<div>
    
</div>



<div className=" flex  border-b-2">
<div>
    <p className="font-bold text-lg mt-4">
    Step 3: <br/>
 Claim <br/>
Dependent <br/>
and other<br/>
Credits 
    </p>
    </div>
    <div className="ml-30">
<p className="text-[16px] mt-5">
<div className="p-3 text-[16px]">
          <div className="text-[16px] mb-3">
            If your total income will be $200,000 or less ($400,000 or less if married filing jointly):
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[16px] flex-1">Multiply the number of qualifying children under age 17 by $2,000</div>
              <div className="text-[16px] mr-2">$</div>
              <div className="w-20">
                <input
                  type="text"
                  className="w-full border-0 border-b border-black bg-transparent focus:outline-none h-6 text-sm text-right"
                />
              </div>
            </div>

            <div className="flex items-center  border-2justify-between">
              <div className="text-[16px] flex-1">Multiply the number of other dependents by $500</div>
              <div className="text-[16px]  mr-2">$</div>
              <div className="w-20">
                <input
                  type="text"
                  className="w-full border-0 border-b border-black bg-transparent focus:outline-none h-6 text-sm text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[16px] flex-1">
                Add the amounts above for qualifying children and other dependents. You may add to this the amount of
                any other credits. Enter the total here
              </div>
              <div className="text-[16px] mr-2">$</div>
              <div className="w-20">
                <input
                  type="text"
                  className="w-full border-0 border-b border-black bg-transparent focus:outline-none h-6 text-sm text-right"
                />
              </div>
            </div>
          </div>

          </div>
</p>
    </div>




    </div>












    <div className=" flex border-b-2 ">
<div>
    <p className="font-bold text-lg mt-4">
    Step 4: <br/>
(Optional)<br/>
 Other <br/>
Adjustment<br/>

    </p>
    </div>
    <div className="ml-30">
<p className="text-[16px] mt-5">
<div className="p-3 text-[16px]">
          <div className="text-[16px] mb-3">
          a) Other income (not from jobs). If you want tax withheld for other income you 
expect this year that won’t have withholding, enter the amount of other income here. 
This may include interest, dividends, and retirement income . . . . . . . .
          </div>
          <div className="flex items-center justify-between">
              <div className="text-[16px] flex-1">
              
              </div>
              <div className="text-[16px] mr-2">4(a) $</div>
              <div className="w-20">
                <input
                  type="text"
                  className="w-full border-0 border-b bg-blue-100 border-black  focus:outline-none h-6 text-sm text-right"
                />
              </div>
            </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[16px] flex-1">b) Deductions. If you expect to claim deductions other than the standard deduction and 
want to reduce your withholding, use the Deductions Worksheet on page 3 and enter 
the result here . . . . . . . . . . . . . . . . . . . . . . .</div>
              <div className="text-[16px] mr-2">4(b) $</div>
              <div className="w-20">
                <input
                  type="text"
                  className="w-full border-0 border-b border-black bg-blue-100 focus:outline-none h-6 text-sm text-right"
                />
              </div>
            </div>

            <div className="flex items-center  border-2justify-between">
              <div className="text-[16px] flex-1">c) Extra withholding. Enter any additional tax you want withheld each pay period . .</div>
              <div className="text-[16px]  mr-2"> 4(c) $</div>
              <div className="w-20">
                <input
                  type="text"
                  className="w-full border-0 border-b border-black bg-blue-100 focus:outline-none h-6 text-sm text-right"
                />
              </div>
            </div>

          
          </div>
          
          </div>
</p>
    </div>




    </div>



    <div className=" flex border-b-2 ">
<div>
    <p className="font-bold text-lg mt-4">
    Step 5: <br/>
Sign<br/>
 Here <br/>


    </p>
    </div>
    <div className="ml-30">

    </div>

    <div className="p-3">
          <div className="grid grid-cols-3 gap-8">
            <div className="">
              <div className="text-[16px] mb-1">Employer's name and address</div>
              <div className="  h-16 p-1">
                <textarea className="w-full h-full mt-8 focus:outline-none  bg-blue-100  text-xs" />
              </div>
            </div>
            <div>
              <div className="text-[16px]  mb-1">First date of employment</div>
              <input
                type="text"
                className="w-full border-0 border-b mt-8  bg-blue-100 focus:outline-none h-16 text-sm"
              />
            </div>
            <div>
              <div className="text-[16px] mb-1">Employer identification number (EIN)</div>
              <input
                type="text"
                className="w-full border-0 border-b mt-8 h-16 border-black bg-blue-100 focus:outline-none  text-sm"
              />
            </div>
          
            
            </div>
            </div>


    
    </div>


    <div className="mt-6  border-gray-800    pt-2 text-center">
  <div className="text-[16px]   font-semibold mt-6 flex justify-center items-center space-x-36">
    <span >For Privacy Act and Paperwork Reduction Act Notice, see page 3</span>
    <span>Cat. No. 10220Q</span>
    <span className="font-bold text-[20px]">Form W-4 (2025)</span>
  </div>
</div>
   


<div className="min-h-screen  border-t-2  mt-20 flex justify-center items-start">
      <head className="">
        <title>Form W-4 (2009) - Page 2</title>
        <meta name="description" content="Form W-4 Employee's Withholding Certificate" />
      </head>

      <div className="max-w-6xl w-full mt-16 bg-white flex flex-col">
      <div className="flex flex-col md:flex-row gap-6">
  {/* Left Column — General Instructions */}
  <div className="w-full md:w-1/2">
    {/* Header Section */}
    <div className=" pb-2 mb-4  text-center">
      <h1 className="text-md font-bold">Form W-4 (2009) Page 2</h1>


     
    </div>

    {/* Future Developments */}
    <section className="mb-6">
    <h2 className="text-3xl font-semibold">General Instructions</h2>
      <p className="text-sm">
        Section references are to the Internal Revenue Code unless otherwise noted.
      </p>
      <h2 className="text-xl  font-bold mb-1">Future Developments</h2>
      <p className="text-sm mb-2">
        For the latest information about developments related to Form W-4, such as legislation enacted after it was published, go to
        <span className="text-blue-600 underline ml-1">www.irs.gov/FormW4</span>.
      </p>
    </section>

    {/* Purpose of Form */}
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-1">Purpose of Form</h2>
      <p className="text-sm mb-2">
        Complete Form W-4 so that your employer can withhold the correct federal income for any new pay. If too little is withheld, you will generally have tax when you file your tax return and may owe a penalty. If too much is withheld, you will generally be due a refund. Complete a new Form W-4 when changes to your personal or financial discretion would change the entries on the form. For more information or withholding and when you must furnish a new Form W-4, see Pub. 505, Tax Withholding and Estimated Tax.
      </p>
    </section>

    {/* Exemption from withholding */}
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-1">Exemption from withholding.</h2>
      <p className="text-sm mb-2">
        You may claim exemption from withholding for 2025 if you meet both of the following conditions: you had no federal income tax liability in 2024 and you expect to have no federal income tax liability in 2025. [...] You will need to submit a new Form W-4 by February 17, 2025.
      </p>
    </section>

    {/* Your privacy */}
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-1">Your privacy.</h2>
      <p className="text-sm mb-2">
        Steps 20 and 49) ask for information regarding income you received from sources other than the job associated with this Form W-4. [...]
      </p>
    </section>

    {/* When to use the estimator */}
    <section className="mb-6">
      <h2 className="text-lg font-bold mb-1">When to use the estimator.</h2>
      <p className="text-sm mb-2">
        Consider using the estimator at <span className="text-blue-600 underline">www.irs.gov/W4App</span> if you:
      </p>
      <ol className="list-decimal list-inside text-sm mb-2 pl-4">
        <li className="mb-1">Are submitting this form after the beginning of the year;</li>
        <li className="mb-1">Expect to work only part of the year;</li>
        <li className="mb-1">Have changes during the year in your annual status, number of jobs, or dependents;</li>
        <li className="mb-1">Receive dividends, capital gains, social security, bonuses, or business income;</li>
        <li>Prefer the most accurate withholding for multiple job situations.</li>
      </ol>
    </section>

    {/* Non-resident alien */}
    <section className="mb-6">
      <p className="text-sm  mb-1"><span className="font-bold">TIP:</span>  Have your most recent pay stub(s) from this year available 
when using the estimator to account for federal income tax that 
has already been withheld this year. At the beginning of next 
year, use the estimator again to recheck your withholding.</p>
      <p className="text-sm mb-2"><span  className="font-bold">Self Employment</span> Generally, you will owe both income and 
self-employment taxes on any self-employment income you 
receive separate from the wages you receive as an employee. If 
you want to pay these taxes through withholding from your 
wages, use the estimator at<span className="text-blue-500 underline"> www.irs.gov/W4App </span> to figure the 
amount to have withheld.
       
      </p>
    </section>
  </div>

  {/* Right Column — Specific Instructions */}
  <div className="w-full md:w-1/2">
    {/* Specific Instructions Header */}
    <div className="text-center mb-4 mt-10 ">
        <p className="text-sm">
            <span className="font-bold text-md">Nonresident alien.</span> f you’re a nonresident alien, see Notice 
1392, Supplemental Form W-4 Instructions for Nonresident 
Aliens, before completing this form.
        </p>
      <h2 className="text-3xl font-semibold text-start mt-10">Specific Instructions</h2>
    </div>

    {/* Step 16 */}
    <section className="mb-4">
      <h3 className="text-lg font-bold mb-1">Step 1(c). Check your anticipated filing status.</h3>
      <p className="text-sm">
        This will determine the standard deduction and tax rates used to compute your withholding.
      </p>
    </section>

    {/* Step 2 */}
    <section className="mb-4">
      <h3 className="text-lg font-bold mb-1">Step 2.</h3>
      <p className="text-sm mb-2">
      Use this step if you (1) have more than one job at the 
same time, or (2) are married filing jointly and you and your 
spouse both work. Submit a separate Form W-4 for each job.
 Option (a) most accurately calculates the additional tax you 
need to have withheld, while option (b) does so with a little less 
accuracy. 
Instead, if you (and your spouse) have a total of only two jobs, 
you may check the box in option (c). The box must also be 
checked on the Form W-4 for the other job. If the box is 
checked, the standard deduction and tax brackets will be cut in 
half for each job to calculate withholding. This option is accurate 
for jobs with similar pay; otherwise, more tax than necessary 
may be withheld, and this extra amount will be larger the greater 
the difference in pay is between the two jobs.
<span className="font-semibold">Multiple jobs</span>▲! ON
ultiple jobs. 
one Form W-4. Withholding will be most accurate if you 
Complete Steps 3 through 4(b) on only 
do this on the Form W-4 for the hihest pain job
      </p>
    </section>

    {/* Withholding jobs */}
    <section className="mb-4">
      <h3 className="text-lg font-bold mb-1">Step 3</h3>
      <p className="text-sm mb-2">
      This step provides instructions for determining the 
amount of the child tax credit and the credit for other 
dependents that you may be able to claim when you file your 
tax return. To qualify for the child tax credit, the child must be 
under age 17 as of December 31, must be your dependent who 
generally lives with you for more than half the year, and must 
have the required social security number. You may be able to 
claim a credit for other dependents for whom a child tax credit 
can’t be claimed, such as an older child or a qualifying relative. 
For additional eligibility requirements for these credits, see Pub. 
501, Dependents, Standard Deduction, and Filing Information. 
You can also include other tax credits for which you are eligible 
in this step, such as the foreign tax credit and the education tax 
credits. To do so, add an estimate of the amount for the year to 
your credits for dependents and enter the total amount in Step 
3. Including these credits will increase your paycheck and 
reduce the amountof any refund you may receive when you file 
your tax return.
      </p>
    </section>

    {/* Step 3 */}
    <section className="mb-4">
      <h3 className="text-lg font-bold mb-1">Step 4.</h3>
      <h1>Step 4(a).</h1>
      <p className="text-sm mb-2">
      Enter in this step the total of your other estimated 
income for the year, if any. You shouldn’t include income from 
any jobs or self-employment. If you complete Step 4(a), you 
likely won’t have to make estimated tax payments for that 
income. If you prefer to pay estimated tax rather than having tax 
on other income withheld from your paycheck, see Form 
1040-ES, Estimated Tax for Individuals.
      </p>
    </section>

    {/* Step 4 */}
    <section className="mb-4">
   
      <div className="ml-4">
        <div className="mb-3">
          <h4 className="text-lg font-bold mb-1">Step 4(c).</h4>
          <p className="text-sm">
          Enter in this step any additional tax you want 
withheld from your pay each pay period, including any amounts 
from the Multiple Jobs Worksheet, line 4. Entering an amount 
here will reduce your paycheck and will either increase your 
refund or reduce any amount of tax that you owe.
          </p>
        </div>
        {/* Add additional steps 4(b), 4(c) here if needed */}
      </div>
    </section>
  </div>
</div>


   


</div>
</div>
<div className="max-w-7xl w-full mt-16 bg-white flex flex-col">
<section className="bg-white text-black py-10  border-b-2 md:px-16  font-sans text-sm">
      {/* Step 2(b) Header */}
      <h2 className="font-bold text-lg  text-center  border-b border-t mb-4 p-4">
        Step 2(b)—Multiple Jobs Worksheet <span className="italic">(Keep for your records.)</span>
      </h2>

      {/* Paragraph */}
      <p className="mb-4">
        If you choose the option in Step 2(b) on Form W-4, complete this worksheet (which calculates the total extra tax for all jobs) on only
        <strong> ONE </strong>
        Form W-4. Withholding will be most accurate if you complete the worksheet and enter the result on the Form W-4 for the highest paying job. To be accurate, submit a new Form W-4 for all other jobs if you have not updated your withholding since 2019.
      </p>

      <p className="mb-4">
        <strong>Note:</strong> If more than one job has annual wages of more than $120,000 or there are more than three jobs, see Pub. 505 for additional
        tables; or you can use the online withholding estimator at <a href="https://www.irs.gov/W4App" className="text-blue-600 underline">www.irs.gov/W4App</a>.
      </p>

      {/* Instructions */}
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Two jobs.</strong> If you have two jobs or you’re married filing jointly and you and your spouse each have one job, find the amount from the appropriate table on page 4. Using the “Higher Paying Job” row and the “Lower Paying Job” column, find the value at the intersection of the two household salaries and enter that value on line 1. Then, skip to line 3.
          <div className="flex items-center gap-2 mt-1 ml-150">
  <span>1</span>
  <input
    type="text"
    placeholder="$________________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

        </li>
        <li>
          <strong>Three jobs.</strong> If you and/or your spouse have three jobs at the same time, complete lines 2a, 2b, and 2c below. Otherwise, skip to line 3.
          <ol className="list-[lower-alpha] list-inside ml-4 space-y-1">
            <li>
              Find the amount from the appropriate table on page 4 using the annual wages from the highest paying job in the “Higher Paying Job” row and the annual wages for your next highest paying job in the “Lower Paying Job” column. Find the value at the intersection of the two household salaries and enter that value on line 2a.
              <div className="flex items-center gap-2 mt-1 ml-150">
  <span>2a</span>
  <input
    type="text"
    placeholder="$______________"
    className="bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

            </li>
            <li>
              Add the annual wages of the two highest paying jobs from line 2a together and use the total as the wages in the “Higher Paying Job” row and use the annual wages for your third job in the “Lower Paying Job” column to find the amount from the appropriate table on page 4 and enter this amount.
              <div className="flex items-center gap-2 ml-150 mt-1">
  <span>2b</span>
  <input
    type="text"
    placeholder="$___________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

            </li>
            <li>
              Add the amounts from lines 2a and 2b and enter the result on line 2c.
              <div className="flex items-center gap-2 mt-1 ml-150">
  <span>2c</span>
  <input
    type="text"
    placeholder="$____________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

            </li>
          </ol>
        </li>
        <li>
          Enter the number of pay periods per year for the highest paying job. For example, if that job pays weekly, enter 52; if it pays every other week, enter 26; if it pays monthly, enter 12, etc.
          <div className="flex items-center gap-2 mt-1 ml-150">
  <span>3</span>
  <input
    type="text"
    placeholder="$___________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

        </li>
        <li>
          Divide the amount on line 1 or line 2c by the number of pay periods on line 3. Enter this amount here and in Step 4(c) of Form W-4 for the highest paying job (along with any other additional amount you want withheld).
          <div className="flex items-center gap-2 mt-1 ml-150">
  <span>4</span>
  <input
    type="text"
    placeholder="$____________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

        </li>
      </ol>

      <hr className="my-6 border-black" />

      {/* Step 4(b) Header */}
      <h2 className="font-bold text-lg mb-4 border-b p-4">
        Step 4(b)—Deductions Worksheet <span className="italic">(Keep for your records.)</span>
      </h2>

      <ol className="list-decimal list-inside space-y-2">
        <li>
          Enter an estimate of your 2025 itemized deductions (from Schedule A (Form 1040)). Such deductions may include qualifying home mortgage interest, charitable contributions, state and local taxes (up to $10,000), and medical expenses in excess of 7.5% of your income.
          <div className="flex items-center gap-2 mt-1 ml-150">
  <span>2</span>
  <input
    type="text"
    placeholder="$__________________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

        </li>
        <li>
          <span>Enter:</span>
          <ul className="list-disc ml-8 mt-1">
            <li>$30,000 if you’re married filing jointly or a qualifying surviving spouse</li>
            <li>$22,500 if you’re head of household</li>
            <li>$15,000 if you’re single or married filing separately</li>
          </ul>
          <div className="flex items-center gap-2 mt-1 ml-150">
  <span>3</span>
  <input
    type="text"
    placeholder="$___________________"
    className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
  />
</div>

        </li>
        <li className="flex flex-col gap-1">
  <span>
    If line 1 is greater than line 2, subtract line 2 from line 1 and enter the result here. If line 2 is greater than line 1, enter “-0-”.
  </span>
  <div className="flex items-center gap-2 self-end ml-150">
    <span>4</span>
    <input
      type="text"
      placeholder="$_____________________"
      className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
    />
  </div>
</li>

        <li className="flex flex-col gap-1">
  <span>
    Enter an estimate of your student loan interest, deductible IRA contributions, and certain other adjustments (from Part II of Schedule 1 (Form 1040)). See Pub. 505 for more information.
  </span>
  <div className="flex items-center gap-2 self-end ml-150">
    <span>4</span>
    <input
      type="text"
      placeholder="$________________"
      className=" bg-blue-100 px-2 py-1 w-40 focus:outline-none"
    />
  </div>
</li>

        <li className="flex items-center justify-between">
  <span>
    <span className="font-bold">Add</span> lines 3 and 4. Enter the result here and in <span className="font-bold"> Step 4(b)</span> of Form W-4.
  </span>
  <div className="flex items-center gap-2 ">
    <span>5</span>
    <input
      type="text"
      className="border-b border-gray-500 focus:outline-none w-40 bg-blue-100 px-2 py-1"
      placeholder="$_____________"
    />
  </div>
</li>

      </ol>
      
    </section>







    <div className="max-w-6xl w-full mt-16 bg-white flex flex-col">
  <div className="flex flex-col md:flex-row gap-6">
    <div className="flex-1">
      <p>rivacy Act and Paperwork Reduction Act Notice. We ask for the information 
on this form to carry out the Internal Revenue laws of the United States. Internal 
Revenue Code sections 3402(f)(2) and 6109 and their regulations require you to 
provide this information; your employer uses it to determine your federal income 
tax withholding. Failure to provide a properly completed form will result in your 
being treated as a single person with no other entries on the form; providing 
fraudulent information may subject you to penalties. Routine uses of this 
information include giving it to the Department of Justice for civil and criminal 
litigation; to cities, states, the District of Columbia, and U.S. commonwealths and 
territories for use in administering their tax laws; and to the Department of Health 
and Human Services for use in the National Directory of New Hires. We may also 
disclose this information to other countries under a tax treaty, to federal and state 
agencies to enforce federal nontax criminal laws, or to federal law enforcement 
and intelligence agencies to combat terrorism..</p>
    </div>
    <div className="flex-1">
      <p>You are not required to provide the information requested on a form that is 
subject to the Paperwork Reduction Act unless the form displays a valid OMB 
control number. Books or records relating to a form or its instructions must be 
retained as long as their contents may become material in the administration of 
any Internal Revenue law. Generally, tax returns and return information are 
confidential, as required by Code section 6103. 
The average time and expenses required to complete and file this form will vary 
depending on individual circumstances. For estimated averages, see the 
instructions for your income tax return.
If you have suggestions for making this form simpler, we would be happy to hear 
from you. See the instructions for your income tax return..</p>
    </div>
  </div>
</div>








</div>







<W4WithholdingTables/>






      </div>
    );
  }
  
