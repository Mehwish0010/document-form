import React, { useState } from "react";

export default function FinalSubmitButton({ formIds }: { formIds: string[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      setIsLoading(true);
      const response = await fetch('/api/final-submission', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit forms');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        alert("All forms submitted successfully! You will receive a confirmation email shortly.");
      } else {
        setError(result.error || "Unknown error");
        alert("Failed to submit forms: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error('Error submitting forms:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      alert("Failed to submit forms. Please try again.");
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleFinalSubmit}
        disabled={submitting || isLoading}
        className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-bold px-10 py-5 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ minWidth: 280 }}
      >
        {isLoading ? "Submitting..." : "Submit All Forms"}
      </button>
      
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
      
      {success && (
        <div className="text-green-600 text-sm mt-2">
          Forms submitted successfully!
        </div>
      )}
    </div>
  );
} 