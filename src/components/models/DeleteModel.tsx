"use client";

import { IoClose } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { useToast } from "@/hooks/useToast";

import { useState } from "react";
import api from "@/api/axios";
import { AxiosError } from "axios";

import { useAppDispatch } from "@/lib/hooks";
import { removeLink } from "@/lib/features/link/linkSlice";

interface DeleteModalProps {
     isOpen: boolean;
     onClose: () => void;
     id: number;
}

const DeleteModal = ({ isOpen, onClose, id }: DeleteModalProps) => {
     const [loading, setLoading] = useState<boolean>(false);

     const { showToast } = useToast();
     const dispatch = useAppDispatch();

     if (!isOpen || !id) return null;

     const handleDelete = async () => {
          try {
               setLoading(true);

               await api.delete(`/links/${id}`);

               onClose();
               showToast("Link deleted successfully", "success");
               dispatch(removeLink(id));
          } catch (err) {
               const e = err as AxiosError<{ message?: string }>;

               const message =
                    e.response?.data?.message || "Failed to delete link";

               showToast(message, "error");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
               onClick={(e) => {
                    if (e.target === e.currentTarget) {
                         onClose();
                    }
               }}
          >
               <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                         <h2 className="text-lg font-semibold">Delete link?</h2>

                         <button
                              onClick={onClose}
                              className="cursor-pointer text-gray-500 hover:text-black"
                         >
                              <IoClose size={22} />
                         </button>
                    </div>

                    <div className="mb-5 flex flex-col gap-3 items-center text-center">
                         <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                              <FiTrash2 size={22} />
                         </div>

                         <p className="text-sm text-muted">
                              Are you sure you want to delete this link?
                         </p>

                         <p className="text-sm text-muted">
                              This cannot be undone.
                         </p>
                    </div>

                    <div className="flex gap-3">
                         <button
                              onClick={onClose}
                              className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                         >
                              Cancel
                         </button>

                         <button
                              onClick={handleDelete}
                              disabled={loading}
                              className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                         >
                              {loading ? "Deleting..." : "Delete"}
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default DeleteModal;
