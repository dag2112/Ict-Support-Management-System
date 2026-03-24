"use client";
import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  request: any;
  onClose: () => void;
}

export default function FeedbackModal({ request, onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.submitFeedback({ requestId: request.id, rating, comment });
      setSubmitted(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-gray-800">Thank you for your feedback!</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-1">Rate Your Experience</h2>
            <p className="text-sm text-gray-500 mb-5">{request.title}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Satisfaction Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
                <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={rating === 0 || loading}
                  className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-50">
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
                <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
