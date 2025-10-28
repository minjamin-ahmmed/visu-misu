import React, { useState, useCallback } from "react";
import { ImageResult } from "../types";
import { editImage } from "../services/geminiService";
import Loader from "./Loader";
import { X, Edit3, Wand2, Sparkles, Download } from "lucide-react";

interface EditModalProps {
  imageResult: ImageResult | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateImage: (id: string, newSrc: string, newMimeType: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  imageResult,
  isOpen,
  onClose,
  onUpdateImage,
}) => {
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyEdit = useCallback(async () => {
    if (!editPrompt || !imageResult) return;
    setIsEditing(true);
    setError(null);
    try {
      const base64Data = imageResult.src.split(",")[1];
      const { src: newSrc, mimeType: newMimeType } = await editImage(
        base64Data,
        imageResult.mimeType,
        editPrompt
      );
      onUpdateImage(imageResult.id, newSrc, newMimeType);
      setEditPrompt("");
    } catch (err) {
      setError("Failed to apply edit. Please try again.");
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  }, [editPrompt, imageResult, onUpdateImage]);

  if (!isOpen || !imageResult) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-black/95 to-teal-900/20 border border-teal-800/50 rounded-2xl w-full max-w-4xl flex flex-col md:flex-row gap-8 p-8 backdrop-blur-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-teal-400 hover:text-teal-200 hover:bg-teal-800/30 rounded-lg transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 aspect-square bg-black rounded-xl overflow-hidden flex items-center justify-center border border-teal-800/30">
          <img
            src={imageResult.src}
            alt={imageResult.perspective}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-800/30 rounded-lg">
                <Edit3 className="w-5 h-5 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-teal-100">
                {imageResult.perspective}
              </h3>
            </div>
            <p className="text-sm text-teal-300">
              Describe the changes you want to make to this image. Be specific
              about colors, objects, lighting, or style changes.
            </p>
          </div>

          <div className="flex-grow flex flex-col space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-teal-300 text-sm font-semibold">
                <Wand2 className="w-4 h-4" />
                <span>Edit Instructions</span>
              </label>
              <textarea
                placeholder="e.g., 'Add a retro filter with warm colors' or 'Make the sky stormy with dark clouds'"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="w-full flex-grow bg-black/50 border border-teal-800/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none text-teal-100 placeholder-teal-400 font-medium"
                rows={5}
                disabled={isEditing}
              />
            </div>

            <button
              onClick={handleApplyEdit}
              disabled={!editPrompt.trim() || isEditing}
              className="w-full relative py-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:from-teal-800 disabled:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-white shadow-lg hover:shadow-teal-500/25 flex items-center justify-center space-x-2"
            >
              {isEditing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Applying Changes...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Apply Edit</span>
                </>
              )}
              {isEditing && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-teal-700 overflow-hidden rounded-b-xl">
                  <div className="h-full w-1/2 bg-teal-400 animate-pulse-horizontal"></div>
                </div>
              )}
            </button>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 text-sm text-center font-medium">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-pulse-horizontal {
          animation: pulse-horizontal 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EditModal;
