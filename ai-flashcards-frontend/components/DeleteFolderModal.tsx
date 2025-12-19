"use client";

import { useState, useEffect } from "react";
import { deleteFolder, getAllCardsOfFolder } from "@/lib/api-client";
import { FolderDto } from "@/types/folder";

interface DeleteFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folderId: number;
  accessToken: string;
  folder: FolderDto;
}

export default function DeleteFolderModal({
  isOpen,
  onClose,
  onSuccess,
  folderId,
  accessToken,
  folder,
}: DeleteFolderModalProps) {
  const [cardCount, setCardCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [countError, setCountError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch card count when modal opens
  useEffect(() => {
    if (isOpen && accessToken) {
      fetchCardCount();
    } else {
      // Reset state when modal closes
      setCardCount(null);
      setCountError(null);
      setIsLoadingCount(false);
    }
  }, [isOpen, folderId, accessToken]);

  const fetchCardCount = async () => {
    try {
      setIsLoadingCount(true);
      setCountError(null);

      // Fetch with page=0, size=1 just to get totalElements
      const response = await getAllCardsOfFolder(accessToken, folderId, 0, 1);
      setCardCount(response.totalElements);
    } catch (err) {
      console.error("Failed to fetch card count:", err);
      setCountError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to load card count. Please try again."
      );
    } finally {
      setIsLoadingCount(false);
    }
  };

  const handleCloseModal = () => {
    setDeleteError(null);
    setSuccessMessage(null);
    setCardCount(null);
    setCountError(null);
    onClose();
  };

  const handleDeleteFolder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't allow deletion if we don't have card count or if there's a count error
    if (cardCount === null || countError) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteFolder(accessToken, folderId);

      // Show success message
      setSuccessMessage("Folder deleted successfully!");

      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        handleCloseModal();
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Failed to delete folder:", err);
      setDeleteError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to delete folder. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80" />

      {/* Modal Container */}
      <div className="relative bg-black border-2 border-red-500 max-w-md w-full mx-4 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-900">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            Delete Folder
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black p-1"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleDeleteFolder} className="p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-900/30 border-2 border-green-600 p-4">
              <p className="text-green-400 font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoadingCount && (
            <div className="mb-6 flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading card count...</p>
              </div>
            </div>
          )}

          {/* Count Error Message */}
          {countError && !isLoadingCount && (
            <div className="mb-6 bg-red-900/30 border-2 border-red-600 p-4">
              <p className="text-red-400 font-semibold">{countError}</p>
            </div>
          )}

          {/* Confirmation Message */}
          {!isLoadingCount && !countError && cardCount !== null && (
            <div className="mb-6">
              <p className="text-white text-lg mb-4">
                Are you sure you want to delete this folder?
              </p>
              <div className="bg-slate-900 border-2 border-slate-800 p-4 rounded">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Folder Name
                  </p>
                  <p className="text-white">{folder.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Cards in Folder
                  </p>
                  <p className="text-white">
                    {cardCount === 0
                      ? "No cards"
                      : `${cardCount} card${cardCount === 1 ? "" : "s"}`}
                  </p>
                  {cardCount > 0 && (
                    <p className="text-red-400 text-sm mt-2 font-semibold">
                      All cards in this folder will also be deleted.
                    </p>
                  )}
                </div>
              </div>
              <p className="text-red-400 text-sm mt-4 font-semibold">
                This action cannot be undone.
              </p>
            </div>
          )}

          {/* Delete Error Message */}
          {deleteError && (
            <div className="mb-6 bg-red-900/30 border-2 border-red-600 p-4">
              <p className="text-red-400 font-semibold">{deleteError}</p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isDeleting || isLoadingCount}
              className="px-6 py-2.5 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black disabled:border-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black uppercase tracking-wide text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isDeleting ||
                isLoadingCount ||
                cardCount === null ||
                countError !== null
              }
              className="px-6 py-2.5 bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black disabled:border-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black uppercase tracking-wide text-sm flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

