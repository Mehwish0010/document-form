"use client"

export default function W4WithholdingTables() {
  return (
    <div className="max-w-9xl mx-auto p-1 bg-white font-poppins text-xs border-t-2 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold">Form W-4 (2024)</div>
        <div className="font-bold">Page 4</div>
      </div>

      {/* Married Filing Jointly Table */}
      <div className="mb-6">
        <div className=" font-bold mb-2 p-1  text-center text-2xl ">
          Married Filing Jointly or Qualifying Surviving Spouse
        </div>

        <table className="w-full border border-black text-xs">
          <thead>
            <tr className="">
              <th className="border  border-black p-1 text-left font-bold w-[80px]">
                Higher Paying Job Annual Taxable Wage & Salary
              </th>
              <th className="border border-black p-1 text-center font-bold">$0 - 9,999</th>
              <th className="border border-black p-1 text-center font-bold">$10,000 - 19,999</th>
              <th className="border border-black p-1 text-center font-bold">$20,000 - 29,999</th>
              <th className="border border-black p-1 text-center font-bold">$30,000 - 39,999</th>
              <th className="border border-black p-1 text-center font-bold">$40,000 - 49,999</th>
              <th className="border border-black p-1 text-center font-bold">$50,000 - 59,999</th>
              <th className="border border-black p-1 text-center font-bold">$60,000 - 69,999</th>
              <th className="border border-black p-1 text-center font-bold">$70,000 - 79,999</th>
              <th className="border border-black p-1 text-center font-bold">$80,000 - 99,999</th>
              <th className="border border-black p-1 text-center font-bold">$100,000 - 149,999</th>
              <th className="border border-black p-1 text-center font-bold">$150,000 - 239,999</th>
              <th className="border border-black p-1 text-center font-bold">$240,000 - 259,999</th>
              
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold">$0 - 9,999</td>
              <td className="border border-black p-1 text-center">$0</td>
              <td className="border border-black p-1 text-center">$0</td>
              <td className="border border-black p-1 text-center">$700</td>
              <td className="border border-black p-1 text-center">$850</td>
              <td className="border border-black p-1 text-center">$910</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$10,000 - 19,999</td>
              <td className="border border-black p-1 text-center">$0</td>
              <td className="border border-black p-1 text-center">$700</td>
              <td className="border border-black p-1 text-center">$1,700</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$20,000 - 29,999</td>
              <td className="border border-black p-1 text-center">$700</td>
              <td className="border border-black p-1 text-center">$1,700</td>
              <td className="border border-black p-1 text-center">$2,700</td>
              <td className="border border-black p-1 text-center">$3,110</td>
              <td className="border border-black p-1 text-center">$3,310</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$4,420</td>
              <td className="border border-black p-1 text-center">$6,420</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$30,000 - 39,999</td>
              <td className="border border-black p-1 text-center">$850</td>
              <td className="border border-black p-1 text-center">$1,810</td>
              <td className="border border-black p-1 text-center">$3,110</td>
              <td className="border border-black p-1 text-center">$3,460</td>
              <td className="border border-black p-1 text-center">$3,660</td>
              <td className="border border-black p-1 text-center">$3,770</td>
              <td className="border border-black p-1 text-center">$3,770</td>
              <td className="border border-black p-1 text-center">$3,770</td>
              <td className="border border-black p-1 text-center">$4,770</td>
              <td className="border border-black p-1 text-center">$6,770</td>
              <td className="border border-black p-1 text-center">$6,770</td>
              <td className="border border-black p-1 text-center">$6,770</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$40,000 - 49,999</td>
              <td className="border border-black p-1 text-center">$910</td>
              <td className="border border-black p-1 text-center">$2,110</td>
              <td className="border border-black p-1 text-center">$3,310</td>
              <td className="border border-black p-1 text-center">$3,660</td>
              <td className="border border-black p-1 text-center">$3,860</td>
              <td className="border border-black p-1 text-center">$3,970</td>
              <td className="border border-black p-1 text-center">$3,970</td>
              <td className="border border-black p-1 text-center">$3,970</td>
              <td className="border border-black p-1 text-center">$4,970</td>
              <td className="border border-black p-1 text-center">$6,970</td>
              <td className="border border-black p-1 text-center">$6,970</td>
              <td className="border border-black p-1 text-center">$7,970</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$50,000 - 59,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,220</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$3,770</td>
              <td className="border border-black p-1 text-center">$3,970</td>
              <td className="border border-black p-1 text-center">$5,080</td>
              <td className="border border-black p-1 text-center">$5,080</td>
              <td className="border border-black p-1 text-center">$6,080</td>
              <td className="border border-black p-1 text-center">$7,080</td>
              <td className="border border-black p-1 text-center">$8,080</td>
              <td className="border border-black p-1 text-center">$9,080</td>
              <td className="border border-black p-1 text-center">$10,080</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$60,000 - 69,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,220</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$3,770</td>
              <td className="border border-black p-1 text-center">$3,970</td>
              <td className="border border-black p-1 text-center">$5,080</td>
              <td className="border border-black p-1 text-center">$6,080</td>
              <td className="border border-black p-1 text-center">$7,060</td>
              <td className="border border-black p-1 text-center">$8,080</td>
              <td className="border border-black p-1 text-center">$9,080</td>
              <td className="border border-black p-1 text-center">$10,080</td>
              <td className="border border-black p-1 text-center">$11,080</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$70,000 - 79,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,220</td>
              <td className="border border-black p-1 text-center">$3,420</td>
              <td className="border border-black p-1 text-center">$4,620</td>
              <td className="border border-black p-1 text-center">$5,820</td>
              <td className="border border-black p-1 text-center">$6,930</td>
              <td className="border border-black p-1 text-center">$7,930</td>
              <td className="border border-black p-1 text-center">$8,930</td>
              <td className="border border-black p-1 text-center">$9,930</td>
              <td className="border border-black p-1 text-center">$10,930</td>
              <td className="border border-black p-1 text-center">$11,930</td>
              <td className="border border-black p-1 text-center">$12,930</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$80,000 - 99,999</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$3,070</td>
              <td className="border border-black p-1 text-center">$6,270</td>
              <td className="border border-black p-1 text-center">$7,620</td>
              <td className="border border-black p-1 text-center">$8,820</td>
              <td className="border border-black p-1 text-center">$9,930</td>
              <td className="border border-black p-1 text-center">$10,930</td>
              <td className="border border-black p-1 text-center">$11,930</td>
              <td className="border border-black p-1 text-center">$12,930</td>
              <td className="border border-black p-1 text-center">$14,010</td>
              <td className="border border-black p-1 text-center">$15,210</td>
              <td className="border border-black p-1 text-center">$16,410</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$100,000 - 124,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,440</td>
              <td className="border border-black p-1 text-center">$8,840</td>
              <td className="border border-black p-1 text-center">$8,390</td>
              <td className="border border-black p-1 text-center">$9,790</td>
              <td className="border border-black p-1 text-center">$11,100</td>
              <td className="border border-black p-1 text-center">$12,300</td>
              <td className="border border-black p-1 text-center">$13,500</td>
              <td className="border border-black p-1 text-center">$14,700</td>
              <td className="border border-black p-1 text-center">$15,900</td>
              <td className="border border-black p-1 text-center">$17,100</td>
              <td className="border border-black p-1 text-center">$18,300</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$125,000 - 149,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,440</td>
              <td className="border border-black p-1 text-center">$8,840</td>
              <td className="border border-black p-1 text-center">$8,390</td>
              <td className="border border-black p-1 text-center">$9,790</td>
              <td className="border border-black p-1 text-center">$11,100</td>
              <td className="border border-black p-1 text-center">$12,300</td>
              <td className="border border-black p-1 text-center">$13,500</td>
              <td className="border border-black p-1 text-center">$14,700</td>
              <td className="border border-black p-1 text-center">$15,900</td>
              <td className="border border-black p-1 text-center">$17,100</td>
              <td className="border border-black p-1 text-center">$18,300</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$150,000 - 174,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,440</td>
              <td className="border border-black p-1 text-center">$8,840</td>
              <td className="border border-black p-1 text-center">$8,390</td>
              <td className="border border-black p-1 text-center">$9,790</td>
              <td className="border border-black p-1 text-center">$11,100</td>
              <td className="border border-black p-1 text-center">$12,300</td>
              <td className="border border-black p-1 text-center">$13,500</td>
              <td className="border border-black p-1 text-center">$14,700</td>
              <td className="border border-black p-1 text-center">$15,900</td>
              <td className="border border-black p-1 text-center">$17,100</td>
              <td className="border border-black p-1 text-center">$18,300</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$175,000 - 199,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,440</td>
              <td className="border border-black p-1 text-center">$8,840</td>
              <td className="border border-black p-1 text-center">$8,390</td>
              <td className="border border-black p-1 text-center">$9,790</td>
              <td className="border border-black p-1 text-center">$11,100</td>
              <td className="border border-black p-1 text-center">$12,470</td>
              <td className="border border-black p-1 text-center">$14,470</td>
              <td className="border border-black p-1 text-center">$16,470</td>
              <td className="border border-black p-1 text-center">$18,470</td>
              <td className="border border-black p-1 text-center">$20,470</td>
              <td className="border border-black p-1 text-center">$22,470</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$200,000 - 249,999</td>
              <td className="border border-black p-1 text-center">$2,790</td>
              <td className="border border-black p-1 text-center">$5,990</td>
              <td className="border border-black p-1 text-center">$9,790</td>
              <td className="border border-black p-1 text-center">$12,540</td>
              <td className="border border-black p-1 text-center">$14,840</td>
              <td className="border border-black p-1 text-center">$17,350</td>
              <td className="border border-black p-1 text-center">$19,650</td>
              <td className="border border-black p-1 text-center">$21,950</td>
              <td className="border border-black p-1 text-center">$24,250</td>
              <td className="border border-black p-1 text-center">$26,550</td>
              <td className="border border-black p-1 text-center">$28,850</td>
              <td className="border border-black p-1 text-center">$31,150</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$250,000 and over</td>
              <td className="border border-black p-1 text-center">$3,140</td>
              <td className="border border-black p-1 text-center">$6,840</td>
              <td className="border border-black p-1 text-center">$10,540</td>
              <td className="border border-black p-1 text-center">$13,390</td>
              <td className="border border-black p-1 text-center">$16,090</td>
              <td className="border border-black p-1 text-center">$18,700</td>
              <td className="border border-black p-1 text-center">$21,200</td>
              <td className="border border-black p-1 text-center">$23,700</td>
              <td className="border border-black p-1 text-center">$26,200</td>
              <td className="border border-black p-1 text-center">$28,700</td>
              <td className="border border-black p-1 text-center">$31,200</td>
              <td className="border border-black p-1 text-center">$33,700</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Single or Married Filing Separately Table */}
      <div className="mb-6">
        <div className="text-center font-bold mb-2 text-lg bg-gray-200 p-4 border border-black">
          Single or Married Filing Separately
        </div>

        <table className="w-full border border-black text-xs">
          <thead>
            <tr className="">
              <th className="border  border-black p-1 text-left font-bold w-[80px]">
                Higher Paying Job Annual Taxable Wage & Salary
              </th>
              <th className="border border-black p-1 text-center font-bold">$0 - 9,999</th>
              <th className="border border-black p-1 text-center font-bold">$10,000 - 19,999</th>
              <th className="border border-black p-1 text-center font-bold">$20,000 - 29,999</th>
              <th className="border border-black p-1 text-center font-bold">$30,000 - 39,999</th>
              <th className="border border-black p-1 text-center font-bold">$40,000 - 49,999</th>
              <th className="border border-black p-1 text-center font-bold">$50,000 - 59,999</th>
              <th className="border border-black p-1 text-center font-bold">$60,000 - 69,999</th>
              <th className="border border-black p-1 text-center font-bold">$70,000 - 79,999</th>
              <th className="border border-black p-1 text-center font-bold">$80,000 - 99,999</th>
              <th className="border border-black p-1 text-center font-bold">$100,000 - 124,999</th>
              <th className="border border-black p-1 text-center font-bold">$125,000 - 149,999</th>
              <th className="border border-black p-1 text-center font-bold">$450,000 and over</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold">$0 - 9,999</td>
              <td className="border border-black p-1 text-center">$200</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
              <td className="border border-black p-1 text-center">$1,370</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$10,000 - 19,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$2,390</td>
              <td className="border border-black p-1 text-center">$4,390</td>
              <td className="border border-black p-1 text-center">$4,690</td>
              <td className="border border-black p-1 text-center">$4,690</td>
              <td className="border border-black p-1 text-center">$4,690</td>
              <td className="border border-black p-1 text-center">$5,560</td>
              <td className="border border-black p-1 text-center">$5,260</td>
              <td className="border border-black p-1 text-center">$5,460</td>
              <td className="border border-black p-1 text-center">$5,460</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$20,000 - 29,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$2,390</td>
              <td className="border border-black p-1 text-center">$4,390</td>
              <td className="border border-black p-1 text-center">$4,690</td>
              <td className="border border-black p-1 text-center">$4,690</td>
              <td className="border border-black p-1 text-center">$4,690</td>
              <td className="border border-black p-1 text-center">$5,560</td>
              <td className="border border-black p-1 text-center">$5,260</td>
              <td className="border border-black p-1 text-center">$5,460</td>
              <td className="border border-black p-1 text-center">$5,460</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$30,000 - 39,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,870</td>
              <td className="border border-black p-1 text-center">$2,390</td>
              <td className="border border-black p-1 text-center">$5,240</td>
              <td className="border border-black p-1 text-center">$6,240</td>
              <td className="border border-black p-1 text-center">$7,240</td>
              <td className="border border-black p-1 text-center">$7,860</td>
              <td className="border border-black p-1 text-center">$8,080</td>
              <td className="border border-black p-1 text-center">$8,280</td>
              <td className="border border-black p-1 text-center">$8,480</td>
              <td className="border border-black p-1 text-center">$8,680</td>
              <td className="border border-black p-1 text-center">$8,880</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$40,000 - 49,999</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$3,720</td>
              <td className="border border-black p-1 text-center">$4,890</td>
              <td className="border border-black p-1 text-center">$5,840</td>
              <td className="border border-black p-1 text-center">$7,930</td>
              <td className="border border-black p-1 text-center">$8,230</td>
              <td className="border border-black p-1 text-center">$9,130</td>
              <td className="border border-black p-1 text-center">$9,330</td>
              <td className="border border-black p-1 text-center">$9,530</td>
              <td className="border border-black p-1 text-center">$9,730</td>
              <td className="border border-black p-1 text-center">$9,930</td>
              <td className="border border-black p-1 text-center">$10,130</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$50,000 - 59,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,090</td>
              <td className="border border-black p-1 text-center">$5,460</td>
              <td className="border border-black p-1 text-center">$6,660</td>
              <td className="border border-black p-1 text-center">$7,860</td>
              <td className="border border-black p-1 text-center">$9,060</td>
              <td className="border border-black p-1 text-center">$9,950</td>
              <td className="border border-black p-1 text-center">$10,950</td>
              <td className="border border-black p-1 text-center">$11,950</td>
              <td className="border border-black p-1 text-center">$12,950</td>
              <td className="border border-black p-1 text-center">$13,950</td>
              <td className="border border-black p-1 text-center">$14,950</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$60,000 - 69,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,090</td>
              <td className="border border-black p-1 text-center">$5,460</td>
              <td className="border border-black p-1 text-center">$6,660</td>
              <td className="border border-black p-1 text-center">$7,860</td>
              <td className="border border-black p-1 text-center">$10,540</td>
              <td className="border border-black p-1 text-center">$11,900</td>
              <td className="border border-black p-1 text-center">$12,950</td>
              <td className="border border-black p-1 text-center">$13,950</td>
              <td className="border border-black p-1 text-center">$15,080</td>
              <td className="border border-black p-1 text-center">$16,380</td>
              <td className="border border-black p-1 text-center">$17,680</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$70,000 - 79,999</td>
              <td className="border border-black p-1 text-center">$2,270</td>
              <td className="border border-black p-1 text-center">$4,290</td>
              <td className="border border-black p-1 text-center">$6,450</td>
              <td className="border border-black p-1 text-center">$8,450</td>
              <td className="border border-black p-1 text-center">$10,450</td>
              <td className="border border-black p-1 text-center">$12,450</td>
              <td className="border border-black p-1 text-center">$13,950</td>
              <td className="border border-black p-1 text-center">$15,230</td>
              <td className="border border-black p-1 text-center">$16,530</td>
              <td className="border border-black p-1 text-center">$17,830</td>
              <td className="border border-black p-1 text-center">$19,130</td>
              <td className="border border-black p-1 text-center">$20,430</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$80,000 - 99,999</td>
              <td className="border border-black p-1 text-center">$2,970</td>
              <td className="border border-black p-1 text-center">$6,120</td>
              <td className="border border-black p-1 text-center">$8,290</td>
              <td className="border border-black p-1 text-center">$10,080</td>
              <td className="border border-black p-1 text-center">$13,190</td>
              <td className="border border-black p-1 text-center">$15,490</td>
              <td className="border border-black p-1 text-center">$17,290</td>
              <td className="border border-black p-1 text-center">$18,590</td>
              <td className="border border-black p-1 text-center">$19,890</td>
              <td className="border border-black p-1 text-center">$21,190</td>
              <td className="border border-black p-1 text-center">$22,490</td>
              <td className="border border-black p-1 text-center">$23,790</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$100,000 - 124,999</td>
              <td className="border border-black p-1 text-center">$4,970</td>
              <td className="border border-black p-1 text-center">$6,120</td>
              <td className="border border-black p-1 text-center">$8,290</td>
              <td className="border border-black p-1 text-center">$11,860</td>
              <td className="border border-black p-1 text-center">$14,190</td>
              <td className="border border-black p-1 text-center">$16,490</td>
              <td className="border border-black p-1 text-center">$17,290</td>
              <td className="border border-black p-1 text-center">$18,590</td>
              <td className="border border-black p-1 text-center">$19,890</td>
              <td className="border border-black p-1 text-center">$21,190</td>
              <td className="border border-black p-1 text-center">$22,490</td>
              <td className="border border-black p-1 text-center">$23,790</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$125,000 and over</td>
              <td className="border border-black p-1 text-center">$5,100</td>
              <td className="border border-black p-1 text-center">$8,190</td>
              <td className="border border-black p-1 text-center">$9,360</td>
              <td className="border border-black p-1 text-center">$11,860</td>
              <td className="border border-black p-1 text-center">$14,190</td>
              <td className="border border-black p-1 text-center">$16,490</td>
              <td className="border border-black p-1 text-center">$18,790</td>
              <td className="border border-black p-1 text-center">$21,090</td>
              <td className="border border-black p-1 text-center">$23,390</td>
              <td className="border border-black p-1 text-center">$25,690</td>
              <td className="border border-black p-1 text-center">$27,990</td>
              <td className="border border-black p-1 text-center">$30,290</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Head of Household Table */}
      <div className="mb-6">
        <div className="text-center font-bold mb-2  text-lg p-2 border border-black">Head of Household</div>

        <table className="w-full border border-black text-xs">
          <thead>
            <tr className="">
              <th className="border  border-black p-1 text-left font-bold w-[80px]">
                Higher Paying Job Annual Taxable Wage & Salary
              </th>
              <th className="border border-black p-1 text-center font-bold">$0 - 9,999</th>
              <th className="border border-black p-1 text-center font-bold">$10,000 - 19,999</th>
              <th className="border border-black p-1 text-center font-bold">$20,000 - 29,999</th>
              <th className="border border-black p-1 text-center font-bold">$30,000 - 39,999</th>
              <th className="border border-black p-1 text-center font-bold">$40,000 - 49,999</th>
              <th className="border border-black p-1 text-center font-bold">$50,000 - 59,999</th>
              <th className="border border-black p-1 text-center font-bold">$60,000 - 69,999</th>
              <th className="border border-black p-1 text-center font-bold">$70,000 - 79,999</th>
              <th className="border border-black p-1 text-center font-bold">$80,000 - 99,999</th>
              <th className="border border-black p-1 text-center font-bold">$100,000 - 124,999</th>
              <th className="border border-black p-1 text-center font-bold">$125,000 - 149,999</th>
              <th className="border border-black p-1 text-center font-bold">$150,000 - 174,999</th>
            
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold">$0 - 9,999</td>
              <td className="border border-black p-1 text-center">$0</td>
              <td className="border border-black p-1 text-center">$450</td>
              <td className="border border-black p-1 text-center">$860</td>
              <td className="border border-black p-1 text-center">$1,000</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$1,870</td>
              <td className="border border-black p-1 text-center">$1,890</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$10,000 - 19,999</td>
              <td className="border border-black p-1 text-center">$450</td>
              <td className="border border-black p-1 text-center">$1,450</td>
              <td className="border border-black p-1 text-center">$2,000</td>
              <td className="border border-black p-1 text-center">$2,200</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$2,250</td>
              <td className="border border-black p-1 text-center">$4,070</td>
              <td className="border border-black p-1 text-center">$4,070</td>
              <td className="border border-black p-1 text-center">$4,070</td>
              <td className="border border-black p-1 text-center">$4,290</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$20,000 - 29,999</td>
              <td className="border border-black p-1 text-center">$860</td>
              <td className="border border-black p-1 text-center">$2,000</td>
              <td className="border border-black p-1 text-center">$2,600</td>
              <td className="border border-black p-1 text-center">$3,800</td>
              <td className="border border-black p-1 text-center">$2,820</td>
              <td className="border border-black p-1 text-center">$2,820</td>
              <td className="border border-black p-1 text-center">$3,780</td>
              <td className="border border-black p-1 text-center">$4,780</td>
              <td className="border border-black p-1 text-center">$5,870</td>
              <td className="border border-black p-1 text-center">$5,890</td>
              <td className="border border-black p-1 text-center">$6,890</td>
              <td className="border border-black p-1 text-center">$6,090</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$30,000 - 39,999</td>
              <td className="border border-black p-1 text-center">$1,000</td>
              <td className="border border-black p-1 text-center">$2,200</td>
              <td className="border border-black p-1 text-center">$2,800</td>
              <td className="border border-black p-1 text-center">$3,900</td>
              <td className="border border-black p-1 text-center">$3,000</td>
              <td className="border border-black p-1 text-center">$3,000</td>
              <td className="border border-black p-1 text-center">$5,960</td>
              <td className="border border-black p-1 text-center">$6,960</td>
              <td className="border border-black p-1 text-center">$8,960</td>
              <td className="border border-black p-1 text-center">$7,090</td>
              <td className="border border-black p-1 text-center">$7,590</td>
              <td className="border border-black p-1 text-center">$7,590</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$40,000 - 49,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,220</td>
              <td className="border border-black p-1 text-center">$2,820</td>
              <td className="border border-black p-1 text-center">$3,930</td>
              <td className="border border-black p-1 text-center">$4,850</td>
              <td className="border border-black p-1 text-center">$5,850</td>
              <td className="border border-black p-1 text-center">$6,850</td>
              <td className="border border-black p-1 text-center">$8,050</td>
              <td className="border border-black p-1 text-center">$9,130</td>
              <td className="border border-black p-1 text-center">$9,330</td>
              <td className="border border-black p-1 text-center">$9,530</td>
              <td className="border border-black p-1 text-center">$9,730</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$50,000 - 59,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,320</td>
              <td className="border border-black p-1 text-center">$2,820</td>
              <td className="border border-black p-1 text-center">$5,930</td>
              <td className="border border-black p-1 text-center">$6,850</td>
              <td className="border border-black p-1 text-center">$8,050</td>
              <td className="border border-black p-1 text-center">$9,250</td>
              <td className="border border-black p-1 text-center">$10,450</td>
              <td className="border border-black p-1 text-center">$11,530</td>
              <td className="border border-black p-1 text-center">$11,730</td>
              <td className="border border-black p-1 text-center">$11,930</td>
              <td className="border border-black p-1 text-center">$12,130</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$60,000 - 69,999</td>
              <td className="border border-black p-1 text-center">$1,020</td>
              <td className="border border-black p-1 text-center">$2,320</td>
              <td className="border border-black p-1 text-center">$4,020</td>
              <td className="border border-black p-1 text-center">$5,930</td>
              <td className="border border-black p-1 text-center">$6,850</td>
              <td className="border border-black p-1 text-center">$8,050</td>
              <td className="border border-black p-1 text-center">$9,250</td>
              <td className="border border-black p-1 text-center">$10,450</td>
              <td className="border border-black p-1 text-center">$11,530</td>
              <td className="border border-black p-1 text-center">$13,730</td>
              <td className="border border-black p-1 text-center">$14,730</td>
              <td className="border border-black p-1 text-center">$15,730</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$70,000 - 79,999</td>
              <td className="border border-black p-1 text-center">$1,950</td>
              <td className="border border-black p-1 text-center">$4,350</td>
              <td className="border border-black p-1 text-center">$6,150</td>
              <td className="border border-black p-1 text-center">$7,550</td>
              <td className="border border-black p-1 text-center">$8,770</td>
              <td className="border border-black p-1 text-center">$9,970</td>
              <td className="border border-black p-1 text-center">$11,170</td>
              <td className="border border-black p-1 text-center">$12,370</td>
              <td className="border border-black p-1 text-center">$13,450</td>
              <td className="border border-black p-1 text-center">$13,650</td>
              <td className="border border-black p-1 text-center">$13,850</td>
              <td className="border border-black p-1 text-center">$14,050</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$80,000 - 99,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,440</td>
              <td className="border border-black p-1 text-center">$6,240</td>
              <td className="border border-black p-1 text-center">$7,640</td>
              <td className="border border-black p-1 text-center">$8,860</td>
              <td className="border border-black p-1 text-center">$10,060</td>
              <td className="border border-black p-1 text-center">$12,860</td>
              <td className="border border-black p-1 text-center">$14,860</td>
              <td className="border border-black p-1 text-center">$16,740</td>
              <td className="border border-black p-1 text-center">$17,740</td>
              <td className="border border-black p-1 text-center">$18,740</td>
              <td className="border border-black p-1 text-center">$19,740</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$100,000 - 124,999</td>
              <td className="border border-black p-1 text-center">$2,040</td>
              <td className="border border-black p-1 text-center">$4,440</td>
              <td className="border border-black p-1 text-center">$6,440</td>
              <td className="border border-black p-1 text-center">$8,440</td>
              <td className="border border-black p-1 text-center">$10,960</td>
              <td className="border border-black p-1 text-center">$12,860</td>
              <td className="border border-black p-1 text-center">$14,860</td>
              <td className="border border-black p-1 text-center">$16,910</td>
              <td className="border border-black p-1 text-center">$19,090</td>
              <td className="border border-black p-1 text-center">$20,390</td>
              <td className="border border-black p-1 text-center">$21,690</td>
              <td className="border border-black p-1 text-center">$22,990</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$125,000 - 149,999</td>
              <td className="border border-black p-1 text-center">$2,720</td>
              <td className="border border-black p-1 text-center">$5,920</td>
              <td className="border border-black p-1 text-center">$8,220</td>
              <td className="border border-black p-1 text-center">$10,980</td>
              <td className="border border-black p-1 text-center">$13,280</td>
              <td className="border border-black p-1 text-center">$15,580</td>
              <td className="border border-black p-1 text-center">$17,880</td>
              <td className="border border-black p-1 text-center">$20,180</td>
              <td className="border border-black p-1 text-center">$22,360</td>
              <td className="border border-black p-1 text-center">$23,660</td>
              <td className="border border-black p-1 text-center">$24,960</td>
              <td className="border border-black p-1 text-center">$26,260</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$150,000 - 174,999</td>
              <td className="border border-black p-1 text-center">$2,970</td>
              <td className="border border-black p-1 text-center">$6,470</td>
              <td className="border border-black p-1 text-center">$9,370</td>
              <td className="border border-black p-1 text-center">$11,870</td>
              <td className="border border-black p-1 text-center">$14,190</td>
              <td className="border border-black p-1 text-center">$16,490</td>
              <td className="border border-black p-1 text-center">$18,790</td>
              <td className="border border-black p-1 text-center">$21,090</td>
              <td className="border border-black p-1 text-center">$23,390</td>
              <td className="border border-black p-1 text-center">$24,590</td>
              <td className="border border-black p-1 text-center">$25,890</td>
              <td className="border border-black p-1 text-center">$27,190</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$175,000 - 199,999</td>
              <td className="border border-black p-1 text-center">$2,970</td>
              <td className="border border-black p-1 text-center">$6,470</td>
              <td className="border border-black p-1 text-center">$9,370</td>
              <td className="border border-black p-1 text-center">$12,640</td>
              <td className="border border-black p-1 text-center">$15,190</td>
              <td className="border border-black p-1 text-center">$17,660</td>
              <td className="border border-black p-1 text-center">$20,160</td>
              <td className="border border-black p-1 text-center">$22,660</td>
              <td className="border border-black p-1 text-center">$25,050</td>
              <td className="border border-black p-1 text-center">$26,550</td>
              <td className="border border-black p-1 text-center">$28,050</td>
              <td className="border border-black p-1 text-center">$29,550</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$200,000 - 249,999</td>
              <td className="border border-black p-1 text-center">$2,720</td>
              <td className="border border-black p-1 text-center">$5,920</td>
              <td className="border border-black p-1 text-center">$8,220</td>
              <td className="border border-black p-1 text-center">$10,980</td>
              <td className="border border-black p-1 text-center">$13,280</td>
              <td className="border border-black p-1 text-center">$15,580</td>
              <td className="border border-black p-1 text-center">$17,880</td>
              <td className="border border-black p-1 text-center">$20,180</td>
              <td className="border border-black p-1 text-center">$22,360</td>
              <td className="border border-black p-1 text-center">$23,660</td>
              <td className="border border-black p-1 text-center">$24,960</td>
              <td className="border border-black p-1 text-center">$26,260</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$250,000 - 449,999</td>
              <td className="border border-black p-1 text-center">$2,970</td>
              <td className="border border-black p-1 text-center">$6,470</td>
              <td className="border border-black p-1 text-center">$9,370</td>
              <td className="border border-black p-1 text-center">$12,640</td>
              <td className="border border-black p-1 text-center">$15,190</td>
              <td className="border border-black p-1 text-center">$17,660</td>
              <td className="border border-black p-1 text-center">$20,160</td>
              <td className="border border-black p-1 text-center">$22,660</td>
              <td className="border border-black p-1 text-center">$25,050</td>
              <td className="border border-black p-1 text-center">$26,550</td>
              <td className="border border-black p-1 text-center">$28,050</td>
              <td className="border border-black p-1 text-center">$29,550</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">$450,000 and over</td>
              <td className="border border-black p-1 text-center">$3,140</td>
              <td className="border border-black p-1 text-center">$6,840</td>
              <td className="border border-black p-1 text-center">$9,940</td>
              <td className="border border-black p-1 text-center">$12,640</td>
              <td className="border border-black p-1 text-center">$15,190</td>
              <td className="border border-black p-1 text-center">$17,660</td>
              <td className="border border-black p-1 text-center">$20,160</td>
              <td className="border border-black p-1 text-center">$22,660</td>
              <td className="border border-black p-1 text-center">$25,050</td>
              <td className="border border-black p-1 text-center">$26,550</td>
              <td className="border border-black p-1 text-center">$28,050</td>
              <td className="border border-black p-1 text-center">$29,550</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
