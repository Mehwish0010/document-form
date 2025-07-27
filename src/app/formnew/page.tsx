"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import { useRouter } from "next/navigation";

// All hooks and functions must be inside the component or at the top level, not in the module

export default function NewFormForm() {
  // Synchronously clear previous user data before rendering (should be in useEffect)
  useEffect(() => {
    localStorage.removeItem("applicantName");
    localStorage.removeItem("applicantJob");
    localStorage.removeItem("applicantLocation");
  }, []);

  const formRef = useRef<HTMLDivElement>(null);
  const applicantSignaturePadRef = useRef<SignatureCanvas>(null);
  const employerSignaturePadRef = useRef<SignatureCanvas>(null);
  const router = useRouter();

  // All form fields in one state object
  const [formData, setFormData] = useState({
    // Job application fields
    fullName: "",
    jobRole: "",
    location: "",
    // Employer section
    employerName: "",
    employerNoApplicable: false,
    employerStreet: "",
    employerCityStateZip: "",
    employerPhone: "",
    employerFax: "",
    employerEmail: "",
    employerContact: "",
    employerTitle: "",
    // Section 1: Applicant
    applicantName: "",
    applicantFormerNames: "",
    applicantDOB: "",
    applicantSSN4: "",
    applicantPPID: "",
    applicantEmploymentDates: "",
    applicantPositions: "",
    // Section 1: Yes/No questions
    applicantQ0: "",
    applicantQ1: "",
    applicantQ2: "",
    // Section 1: Signature & Date
    applicantSignature: "",
    applicantDate: "",
    // Section 2: Employer
    section2EmploymentDates: "",
    section2EmployerPhone: "",
    section2Q0: "",
    section2Q1: "",
    section2Q2: "",
    section2Q3: "",
    // Section 2: Signature & Date
    employerSignature: "",
    employerDate: "",
    // Return section
    dateFormReceived: "",
    receivedBy: "",
  });

  // Notification utility
  const showNotification = useCallback(
    (type: "success" | "error", message: string) => {
      if (typeof window === "undefined") return;
      const div = document.createElement("div");
      div.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 ${
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      } px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100`;
      div.innerHTML = `
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${
              type === "success"
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
            }
          </svg>
          <span>${message}</span>
        </div>
      `;
      document.body.appendChild(div);
      setTimeout(() => {
        div.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => div.remove(), 300);
      }, 5000);
    },
    []
  );

  // Load job application data on mount
  useEffect(() => {
    const saved = localStorage.getItem("jobApplicationData");
    if (saved) {
      try {
        // Defensive: Only parse if it looks like JSON (starts with { or [)
        const trimmed = saved.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({
            ...prev,
            fullName: parsed.fullName || "",
            jobRole: parsed.jobRole || "",
            location: parsed.location || "",
          }));
        }
      } catch {
        // If parsing fails, clear the corrupted data and show a notification
        localStorage.removeItem("jobApplicationData");
        showNotification(
          "error",
          "Saved application data was corrupted and has been cleared. Please re-enter your information."
        );
      }
    }
    
  }, [showNotification]);

  // Handle input changes
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  // Validate required fields for all sections
  const validateForm = useCallback(() => {
    // Section 1: Applicant
    if (
      !formData.employerName ||
      !formData.employerStreet ||
      !formData.employerCityStateZip ||
      !formData.employerPhone ||
      !formData.employerEmail ||
      !formData.applicantName ||
      !formData.applicantDOB ||
      !formData.applicantSSN4 ||
      !formData.applicantEmploymentDates ||
      !formData.applicantPositions ||
      !formData.applicantQ0 ||
      !formData.applicantQ1 ||
      !formData.applicantQ2 ||
      !formData.applicantDate ||
      !applicantSignaturePadRef.current ||
      applicantSignaturePadRef.current.isEmpty()
    ) {
      return false;
    }
    // Section 2: Employer
    if (
      !formData.section2EmploymentDates ||
      !formData.section2EmployerPhone ||
      !formData.section2Q0 ||
      !formData.section2Q1 ||
      !formData.section2Q2 ||
      !formData.section2Q3 ||
      !employerSignaturePadRef.current ||
      employerSignaturePadRef.current.isEmpty() ||
      !formData.employerDate
    ) {
      return false;
    }
    // Return section
    if (!formData.dateFormReceived || !formData.receivedBy) {
      return false;
    }
    return true;
  }, [formData]);

  // Form submit handler
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        // Get signature data
        const applicantSignatureDataUrl =
          applicantSignaturePadRef.current?.toDataURL() || "";
        const employerSignatureDataUrl =
          employerSignaturePadRef.current?.toDataURL() || "";

        // Validate required fields
        if (!validateForm()) {
          showNotification("error", "Please fill in all required fields");
          return;
        }

        // Prepare payload
        const formDataToSend = {
          ...formData,
          applicantSignature: applicantSignatureDataUrl,
          employerSignature: employerSignatureDataUrl,
        };

        // Submit form
        const response = await fetch("/api/formsnew", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataToSend),
        });

        let result: unknown = {};
        let parseError = false;
        let serverReturnedInvalidJson = false;
        try {
          // Defensive: Only try to parse JSON if response is not empty and is valid JSON
          const text = await response.text();
          if (text.trim().length === 0) {
            parseError = true;
            result = {
              success: false,
              error: "Empty response from server.",
            };
          } else {
            try {
              result = JSON.parse(text);
            } catch {
              parseError = true;
              serverReturnedInvalidJson = true;
              result = {
                success: false,
                error:
                  "Submission error: The server returned invalid data. Please try again later or contact support.",
              };
            }
          }
        } catch {
          parseError = true;
          result = {
            success: false,
            error: "Could not read server response.",
          };
        }

        // Type guard for result
        const isResultObj = (val: unknown): val is { success?: boolean; error?: string } =>
          typeof val === "object" && val !== null;

        if (
          !response.ok ||
          !(
            isResultObj(result) &&
            typeof result.success === "boolean" &&
            result.success
          )
        ) {
          // If JSON parse error, show a more specific message
          if (serverReturnedInvalidJson && isResultObj(result)) {
            showNotification("error", result.error ?? "");
          } else if (parseError && isResultObj(result)) {
            showNotification(
              "error",
              result.error || "Submission error: Invalid server response."
            );
          } else if (isResultObj(result)) {
            showNotification(
              "error",
              result.error || "Failed to submit form"
            );
          } else {
            showNotification("error", "Failed to submit form");
          }
          return;
        }

        // Success actions
        showNotification("success", "Form submitted successfully!");

        // Save only the job application info
        try {
          localStorage.setItem(
            "jobApplicationData",
            JSON.stringify({
              fullName: formData.fullName,
              jobRole: formData.jobRole,
              location: formData.location,
            })
          );
        } catch{
          showNotification(
            "error",
            "Could not save application info to your browser."
          );
        }

        // Save for next page
        try {
          localStorage.setItem("applicantName", formData.fullName);
          localStorage.setItem("applicantJob", formData.jobRole);
          localStorage.setItem("applicantLocation", formData.location);
        } catch {
          // Ignore, not critical
        }

        // Reset form and signature
        setFormData({
          fullName: "",
          jobRole: "",
          location: "",
          employerName: "",
          employerNoApplicable: false,
          employerStreet: "",
          employerCityStateZip: "",
          employerPhone: "",
          employerFax: "",
          employerEmail: "",
          employerContact: "",
          employerTitle: "",
          applicantName: "",
          applicantFormerNames: "",
          applicantDOB: "",
          applicantSSN4: "",
          applicantPPID: "",
          applicantEmploymentDates: "",
          applicantPositions: "",
          applicantQ0: "",
          applicantQ1: "",
          applicantQ2: "",
          applicantSignature: "",
          applicantDate: "",
          section2EmploymentDates: "",
          section2EmployerPhone: "",
          section2Q0: "",
          section2Q1: "",
          section2Q2: "",
          section2Q3: "",
          employerSignature: "",
          employerDate: "",
          dateFormReceived: "",
          receivedBy: "",
        });
        applicantSignaturePadRef.current?.clear();
        employerSignaturePadRef.current?.clear();

        // Navigate
        router.push("/all-forms");
      } catch  {
        // If error message is a JSON parse error, show a friendlier message
        showNotification(
          "error",
          "Submission error: The server returned invalid data. Please try again later or contact support."
        );
      }
    },
    [formData, router, showNotification, validateForm]
  );

  

  // Clear signature handler
  const clearApplicantSignature = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      applicantSignaturePadRef.current?.clear();
      setFormData((prev) => ({
        ...prev,
        applicantSignature: "",
      }));
    },
    []
  );

  const clearEmployerSignature = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      employerSignaturePadRef.current?.clear();
      setFormData((prev) => ({
        ...prev,
        employerSignature: "",
      }));
    },
    []
  );

  // Helper for radio group
  const handleRadioChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  return (
    <form onSubmit={handleSubmit}>
      <div
        ref={formRef}
        className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 text-md shadow-xl leading-relaxed text-justify text-black font-serif"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-center bg-black text-white py-2 rounded">
            Job Application Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-b border-black px-2 py-1"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Job Role
              </label>
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
              <label className="block text-sm font-semibold mb-1">
                Location
              </label>
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
        {/* ... (Intro, instructions, etc. unchanged) ... */}
        <h1 className="text-center font-bold uppercase text-sm mb-2">
          Commonwealth of Pennsylvania
        </h1>
        <h2 className="text-center font-bold uppercase text-sm mb-4 underline">
          Sexual Misconduct/Abuse Disclosure Release
        </h2>
        <p className="text-center text-sm italic mb-6">
          (Pursuant to Act 168 of 2014)
        </p>
        {/* ... (Instructions, definitions, etc. unchanged) ... */}
        <h3 className="font-bold mb-2 text-center underline">Instructions</h3>
        <p className="mb-4">
          This standardized form has been developed by the Pennsylvania
          Department of Education, pursuant to Act 168 of 2014, to be used by
          school entities and independent contractors of school entities and by
          applicants who would be employed by or in a school entity in a
          position involving direct contact with children to satisfy the Act&apos;s
          requirements of providing information related to abuse or sexual
          misconduct. As required by Act 168, in addition to fulfilling the
          requirements under section 111 of the School Code and the Child
          Protective Services Law (&apos;CPSL&apos;), an applicant who would be employed
          by or in a school entity in a position having direct contact with
          children, must provide the information requested in SECTION 1 of this
          form and complete written authorization that consents to and
          authorizes the disclosure by the applicant&apos;s current and former
          employers of the information requested in SECTION 2 of this form. The
          applicant shall complete one form for the applicant&apos;s current
          employer(s) and one for each of the applicant&apos;s former employers that
          were school entities or where the applicant was employed in a position
          having direct contact with children (therefore, the applicant may have
          to complete more than one form). Upon completion by the applicant, the
          hiring school entity or independent contractor shall submit the form to
          the applicant&apos;s current and former employers to complete SECTION 2.{" "}
          <span className="font-extrabold">
            A school entity or independent contractor may not hire an applicant
            who does not provide the required information for a position
            involving direct contact with children.
          </span>
        </p>
        <h3 className="font-bold underline mb-2">Relevant Definitions:</h3>
        <p className="mb-2">
          <span className="font-bold">Direct Contact with Children</span> is
          defined as: &apos;the possibility of care, supervision, guidance or control
          of children or routine interaction with children.&apos;
        </p>
        <p className="mb-2">
          <span className="font-bold">Sexual Misconduct</span> is defined as:
          &apos;any act, including, but not limited to, any verbal, nonverbal,
          written or electronic communication or physical activity, directed
          toward or with a child or a student regardless of the age of the child
          or student that is designed to establish a romantic or sexual
          relationship with the child or student. Such acts include, but are not
          limited to: (1) sexual or romantic invitation; (2) dating or
          soliciting dates; (3) engaging in sexualized or romantic dialogue; (4)
          making sexually suggestive comments; (5) self-disclosure or physical
          exposure of a sexual, romantic or erotic nature; or (6) any sexual,
          indecent, romantic or erotic contact with the child or student.&apos;
        </p>
        <p className="mb-4">
          <span className="font-bold">Abuse</span> is defined as &apos;conduct that
          falls under the purview and reporting requirements of the CPSL, 23
          Pa.C.S. Ch. 63, is directed toward or against a child or a student,
          regardless of the age of the child or student.&apos;
        </p>
        <h3 className="font-bold underline mb-2">Please Note</h3>
        <p className="mb-4">
          A prospective employer that receives any requested information
          regarding an applicant may use the information for the purpose of
          evaluating the applicant&apos;s fitness to be hired or for continued
          employment and shall report the information as appropriate to the
          Department of Education, a state licensing agency, law enforcement
          agency, child protective services agency, another school entity or to
          a prospective employer.
        </p>
        <p className="mb-4">
          If the prospective employer decides to further consider an applicant
          after receiving an affirmative response to any of the questions listed
          in SECTIONS 1 and 2 of this form, the prospective employer shall
          request that former employers responding affirmatively to the
          questions provide additional information about the matters disclosed
          and include any related records. The
          <span className="underline font-extrabold">
            Commonwealth of Pennsylvania Sexual Misconduct/Abuse Disclosure
            Information Request
          </span>{" "}
          can be used to request this follow-up information. Former employers
          shall provide the additional information and records within 60
          calendar days of the prospective employer&apos;s request.
        </p>
        <p className="mb-6">
          The completed form and any information or records received shall not
          be considered public records for the purposes of the Act of February
          14, 2008 (P.L. 6, No. 3) known as the “Right to Know Law.&apos;
        </p>
        <p>
          The Department of Education shall have jurisdiction to determine
          willful violations of Act 168 and may, following a hearing, assess a
          civil penalty not to exceed $10,000. School entities shall be barred
          from entering into a contract with an independent contractor who is
          found to have willfully violated the provisions of Act 168.
        </p>
        <p className="text-center text-xs mt-8">1/3</p>

        {/* Employer Section */}
        <div className="border mt-20 p-4">
          <h2 className="text-center font-bold uppercase text-sm">
            Commonwealth of Pennsylvania
          </h2>
          <h3 className="text-center font-bold uppercase text-sm underline">
            Sexual Misconduct/Abuse Disclosure Release
          </h3>
          <p className="text-center text-xs italic">
            (under Act 168 of 2014)
          </p>
        </div>
        <p className="text-center text-xs  font-semibold my-2">
          (Hiring school entity or independent contractor submits this form to
          ALL current employer(s) and to former employer(s) that were school
          entities and/or where the applicant had direct contact with children)
        </p>
        <div className="border border-black">
          <div className="flex flex-col sm:flex-row justify-between items-start w-full">
            <div className="w-full sm:w-96 border border-black p-1">
              <label className="block ml-1 text-md">
                Name of Current or Former Employer:
              </label>
              <input
                className="w-full h-5 mt-1"
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full sm:flex-1 border border-black p-4.25 flex items-center ml-0">
              <input
                type="checkbox"
                className="mr-2 mt-1"
                name="employerNoApplicable"
                checked={formData.employerNoApplicable}
                onChange={handleChange}
              />
              <span className="text-md">No applicable employment</span>
            </div>
          </div>
          <div className="border">
            <label className="block text-md p-2">Street Address:</label>
            <input
              className="w-full h-8 mt-1"
              type="text"
              name="employerStreet"
              value={formData.employerStreet}
              onChange={handleChange}
              required
            />
          </div>
          <div className="border">
            <label className="block  p-2">City, State, Zip:</label>
            <input
              className="w-full h-8 mt-1"
              type="text"
              name="employerCityStateZip"
              value={formData.employerCityStateZip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                Telephone Number:
              </label>
              <input
                className="w-full h-8 mt-1"
                type="text"
                name="employerPhone"
                value={formData.employerPhone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                Fax Number:
              </label>
              <input
                className="w-full h-8 mt-1"
                type="text"
                name="employerFax"
                value={formData.employerFax}
                onChange={handleChange}
              />
            </div>
            <div className="border">
              <label className="ml-2">Email:</label>
              <input
                className="w-full h-8 mt-1"
                type="email"
                name="employerEmail"
                value={formData.employerEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                Contact Person:
              </label>
              <input
                className="w-full h-8 mt-1"
                type="text"
                name="employerContact"
                value={formData.employerContact}
                onChange={handleChange}
              />
            </div>
            <div className="border">
              <label className="mt-2 ml-2">Title:</label>
              <input
                className="w-full h-8 mt-1"
                type="text"
                name="employerTitle"
                value={formData.employerTitle}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <p className="text-md my-4">
          The named applicant is under consideration for a position with our
          entity. The Pennsylvania General Assembly has determined that
          additional safeguards are necessary in the hiring of school employees
          to ensure the safety of the Commonwealth&apos;s students. The
          individual whose name appears below has reported previous employment
          with your entity. We request you provide the information requested in
          SECTION 2 of this form within{" "}
          <span className="font-bold">20 calendar days</span> as required by Act
          168 of 2014.
        </p>

        {/* Section 1: Applicant */}
        <div className="border-t border-black pt-4 mt-6">
          <h4 className="font-bold uppercase underline text-md  mb-2">
            Section 1: Applicant Certification and Release (To be completed by
            the applicant even if the applicant has no current or prior
            employment to disclose)
          </h4>
          <div className="grid grid-cols-1">
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                Applicants Name (First, Middle, Last):
              </label>
              <input
                className="w-full h-4 mt-1"
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                Any former names by which the Applicant has been identified:
              </label>
              <input
                className="w-full h-4 mt-1"
                type="text"
                name="applicantFormerNames"
                value={formData.applicantFormerNames}
                onChange={handleChange}
              />
            </div>
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                DOB:
              </label>
              <input
                className="w-full h-4 mt-1"
                type="text"
                name="applicantDOB"
                value={formData.applicantDOB}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                Last 4 digits of Applicant&apos;s Social Security Number:
              </label>
              <input
                className="w-full h-4 mt-1"
                type="text"
                name="applicantSSN4"
                value={formData.applicantSSN4}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border">
              <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
                PPID (if applicable):
              </label>
              <input
                className="w-full h-6 mt-1"
                type="text"
                name="applicantPPID"
                value={formData.applicantPPID}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="border">
            <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
              Approximate dates of employment with the entity listed above:
            </label>
            <input
              className="w-full h-6 mt-1"
              type="text"
              name="applicantEmploymentDates"
              value={formData.applicantEmploymentDates}
              onChange={handleChange}
              required
            />
          </div>
          <div className="border">
            <label className="block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2">
              Position(s) held with the entity:
            </label>
            <input
              className="w-full h-6 mt-1"
              type="text"
              name="applicantPositions"
              value={formData.applicantPositions}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <p className="text-md mt-6">
          Pursuant to Act 168, an employer, school entity, administrator and/or
          independent contractor that provides information or records about a
          current or former employee or applicant shall be immune from criminal
          liability under the CPSL, the Educator DisciplineAct, and from the
          cival liability for the disclosure of the information, or records
          provided were knowingly false.Such immunity shall be an addition to
          and not in limitation of any other immmunity provided law or any
          absoluten or conditional previliges applicable to such disclosure by
          the virtue of the circumstancesof the applicants consent thereto.
          Under Act 168, the willfull failure to respond to or for provide the
          information and records as requested may result in civil penalties
          and/or professional discipline, where applicable.
        </p>

        <p className="text-center text-xs mt-6">2/3</p>

        {/* Section 1: Yes/No Questions */}
        <div className="p-4 mt-8">
          <h4 className="font-bold text-md mb-4">Have you (Applicant) ever?</h4>
          {[
            "Been the subject of an abuse or sexual misconduct investigation by any employer, state licensing agency, law enforcement agency or child protective services agency (unless the investigation resulted in a finding that the allegations were false)?",
            "Been disciplined, discharged, non-renewed, asked to resign from employment, resigned from or otherwise separated from employment while allegations of abuse or sexual misconduct were pending or under investigation or due to adjudication or findings of abuse or sexual misconduct?",
            "Had a license, professional license or certificate suspended, surrendered or revoked while allegations of abuse or sexual misconduct were pending or under investigation or due to an adjudication or findings of abuse or sexual misconduct?",
          ].map((question, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start mb-2"
            >
              <div className="flex items-center mr-6 mt-0.5">
                <label className="mr-1">Yes</label>
                <input
                  type="radio"
                  name={`applicantQ${idx}`}
                  className="mr-2"
                  value="yes"
                  checked={
                    formData[`applicantQ${idx}` as keyof typeof formData] ===
                    "yes"
                  }
                  onChange={handleRadioChange}
                  required
                />
                <label className="mr-1">No</label>
                <input
                  type="radio"
                  name={`applicantQ${idx}`}
                  value="no"
                  checked={
                    formData[`applicantQ${idx}` as keyof typeof formData] ===
                    "no"
                  }
                  onChange={handleRadioChange}
                  required
                />
              </div>
              <p className="text-md">{question}</p>
            </div>
          ))}

          <p className="mt-4 text-md">
            By signing this form, I certify under penalty of law that the
            statements made in this form are correct, complete and true to the
            best of my knowledge. I understand that false statements herein
            including, without limitation, any willful misrepresentation shall,
            subject me to criminal prosecution under 18 P.C.S. § 4904 (relating
            to unsworn falsification to authorities) and to discipline up to and
            including termination of employment, and may subject me to civil
            penalties. I understand that this form and the responses are
            official records of the Department of Education. I also hereby
            authorize the above-named employer to release all requested
            information and any related records. I hereby release, waive and
            discharge the above-named employer from any and all liability for
            providing the requested information and records. I understand and
            acknowledge that third party vendors may be used to process this Act
            168 pre-employment history review.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-8">
            {/* Signature Section */}
            <div>
              <label className="block mb-2 font-semibold">
                Signature of Applicant
              </label>
              <div className="border border-gray-300 w-64 h-24 rounded shadow-sm">
                <SignatureCanvas
                  ref={applicantSignaturePadRef}
                  penColor="black"
                  canvasProps={{ className: "w-full h-full" }}
                />
              </div>
              <button
                type="button"
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={clearApplicantSignature}
              >
                Clear Signature
              </button>
            </div>
            {/* Date Picker Section */}
            <div className="mt-4 md:mt-0">
              <label className="font-bold block mb-1">Date</label>
              <input
                type="date"
                name="applicantDate"
                value={formData.applicantDate}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-48"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Employer */}
        <div className="border-t-2 border-black pt-4 mt-6">
          <h4 className="font-bold uppercase underline text-xs mb-2">
            Section 2: Current/Former Employer Verification (To be completed by
            the applicant&apos;s current employer(s) and all former employers
            that were school entities and/or where the applicant had direct
            contact with children)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="section2EmploymentDates">
                Dates of employment of Applicant:
              </label>
              <input
                type="date"
                id="section2EmploymentDates"
                name="section2EmploymentDates"
                value={formData.section2EmploymentDates}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-48"
                required
              />
            </div>
            <div>
              <label
                htmlFor="section2EmployerPhone"
                className=" block text-md font-medium leading-tight mb-1 whitespace-nowrap  ml-2"
              >
                Contact telephone #:
              </label>
              <input
                type="tel"
                id="section2EmployerPhone"
                name="section2EmployerPhone"
                className="border-b h-6 mt-1 w-full outline-none text-nowrap"
                value={formData.section2EmployerPhone}
                onChange={handleChange}
                placeholder="(xxx) xxx-xxxx"
                required
              />
            </div>
          </div>
          {[
            "Been the subject of an abuse or sexual misconduct investigation by any employer, state licensing agency, law enforcement agency or child protective services agency (unless the investigation resulted in a finding that the allegations were false)?",
            "Been disciplined, discharged, non-renewed, asked to resign from employment, resigned from or otherwise separated from employment while allegations of abuse or sexual misconduct were pending or under investigation or due to adjudication or findings of abuse or sexual misconduct?",
            "Had a license, professional license or certificate suspended, surrendered or revoked while allegations of abuse or sexual misconduct were pending or under investigation or due to an adjudication or findings of abuse or sexual misconduct?",
            "No records or other evidence currently exists regarding the above questions. I have no knowledge of information pertaining to the applicant that would disqualify the applicant from employment.",
          ].map((question, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start mb-2"
            >
              <div className="flex items-center mr-6 mt-0.5">
                <label className="mr-1">Yes</label>
                <input
                  type="radio"
                  name={`section2Q${idx}`}
                  className="mr-2"
                  value="yes"
                  checked={
                    formData[`section2Q${idx}` as keyof typeof formData] ===
                    "yes"
                  }
                  onChange={handleRadioChange}
                  required
                />
                <label className="mr-1">No</label>
                <input
                  type="radio"
                  name={`section2Q${idx}`}
                  value="no"
                  checked={
                    formData[`section2Q${idx}` as keyof typeof formData] ===
                    "no"
                  }
                  onChange={handleRadioChange}
                  required
                />
              </div>
              <p className="text-md">{question}</p>
            </div>
          ))}

          <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-8">
            {/* Signature Section */}
            <div>
              <label className="block mb-2 font-semibold">
                Former Employer Representative Signature and Title
              </label>
              <div className="border border-gray-300 w-64 h-24 rounded shadow-sm">
                <SignatureCanvas
                  ref={employerSignaturePadRef}
                  penColor="black"
                  canvasProps={{ className: "w-full h-full" }}
                />
              </div>
              <button
                type="button"
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={clearEmployerSignature}
              >
                Clear Signature
              </button>
            </div>
            <div className="mt-4 md:mt-0">
              <label className="font-bold block mb-1">Date</label>
              <input
                type="date"
                name="employerDate"
                value={formData.employerDate}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-full sm:w-48"
                required
              />
            </div>
          </div>
        </div>

        {/* Return Section */}
        <div className="border-t-2 border-black pt-4 mt-6">
          <h5 className="font-semibold ">
            Return all completed information to:
          </h5>
          <div className="p-4 text-md">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border ">
                <p className=" ml-2">School Entity/Independent Contractor:</p>
                <p className="ml-2 text-lg">
                  Behavior Analysis & Therapy Partners
                </p>
              </div>
              <div className="border">
                <p className=" ml-2">Phone:</p>
                <p className="ml-2 text-lg">610-664-6200</p>
              </div>
              <div className="border">
                <p className=" ml-2">Address:</p>
                <p className="ml-2 text-lg">139 Montgomery Ave Suite #110</p>
              </div>
              <div className="border">
                <p className="font-medium ml-2">Fax:</p>
                <p className="ml-2 text-lg">610-664-6202</p>
              </div>
              <div className="border">
                <p className=" ml-2">City:</p>
                <p className="ml-2 text-lg ">Bala Cynwyd</p>
              </div>
              <div className="border">
                <p className="ml-2">Email:</p>
                <p className="ml-2  text-lg  ">hr.batp@gmail.com</p>
              </div>
              <div className="border">
                <p className=" ml-2">State:</p>
                <p className="ml-2 text-lg">PA</p>
              </div>
              <div className="border">
                <p className=" ml-2">Zip:</p>
                <p className="ml-2 text-lg">19004</p>
              </div>
              <div className="border">
                <p className=" ml-2">Contact Person:</p>
                <p className="ml-2 text-lg">Vinnie Adams</p>
              </div>
              <div className="border">
                <p className=" ml-2">Title:</p>
                <p className="ml-2  text-lg">HR Coordinator</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="font-bold block mb-1">
                  Date Form Received:
                </label>
                <input
                  type="date"
                  name="dateFormReceived"
                  value={formData.dateFormReceived}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full sm:w-48"
                  required
                />
              </div>
              <div>
                <p className="font-bold">Received by:</p>
                <input
                  type="text"
                  name="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="border-b border-gray-500 h-6 mt-1 w-full sm:w-48 outline-none text-sm"
                  required
                />
              </div>
            </div>
          </div>
          <p className="text-center text-xs mt-4">3/3</p>
        </div>
        <div className="flex justify-center mt-8 mb-8">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 sm:px-32 py-2 bg-black text-white rounded hover:bg-blue-700 font-semibold text-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
