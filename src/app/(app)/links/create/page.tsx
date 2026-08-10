"use client";
import React from "react";
import { useState } from "react";

import { SlLock } from "react-icons/sl";
import { CircleAlert, Ellipsis, X } from "lucide-react";
import Link from "next/link";
import { PostLink } from "@/types";
import { ShortLink } from "@/types";
import { ApiResponse } from "@/types";
import api from "@/api/axios";
import SuccessModal from "@/components/models/LinkCreatedModal";
import { AxiosError } from "axios";

function CreateLink() {
     const [input, setInput] = useState<string>("");
     const [form, setForm] = useState<PostLink>({
          longUrl: "",
          title: "",
          tags: [],
          customCode: "",
     });

     const [urlError, setUrlError] = useState<string>("");
     const [submitting, setSubmitting] = useState<boolean>(false);
     const [showModal, setShowModal] = useState<boolean>(false);
     const [shortLink, setShortLink] = useState<ShortLink | null>(null);

     const tags = form.tags ?? [];

     const isValidUrl = (value: string): boolean => {
          if (!value.trim()) return false;

          try {
               const parsed = new URL(value);
               return (
                    parsed.protocol === "http:" || parsed.protocol === "https:"
               );
          } catch {
               return false;
          }
     };

     const addTag = () => {
          const name = input.trim().toLowerCase();

          if (!name || tags.includes(name) || tags.length >= 3) return;

          setForm((prev) => ({
               ...prev,
               tags: [...(prev.tags ?? []), name],
          }));

          setInput("");
     };

     const removeTag = (tag: string) => {
          setForm((prev) => ({
               ...prev,
               tags: (prev.tags ?? []).filter((t) => t !== tag),
          }));
     };

     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" || e.key === ",") {
               e.preventDefault();
               addTag();
          }

          if (e.key === "Backspace" && !input && tags.length) {
               setForm((prev) => ({
                    ...prev,
                    tags: tags.slice(0, -1),
               }));
          }
     };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          const name = e.target.name;

          setForm((prev) => ({ ...prev, [name]: value }));

          if (urlError) setUrlError("");
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (!form.longUrl.trim()) {
               setUrlError("Destination URL is required.");
               return;
          }

          if (!isValidUrl(form.longUrl.trim())) {
               setUrlError(
                    "Please enter a valid URL (e.g. https://example.com).",
               );
               return;
          }

          setSubmitting(true);

          const payload = {
               ...form,
               title: form.title?.trim() ||  undefined,
               customCode: form.customCode?.trim() || undefined,
               tags,
          };

          try {
               const { data } = await api.post<ApiResponse<ShortLink>>(
                    "/links",
                    payload,
               );
             
               setShortLink(data.data);
               setShowModal(true);
          } catch (err) {
               const e = err as AxiosError<{ message?: string }>;
               console.log(e.response?.data.message)
                              
               setUrlError( e.response?.data?.message ||
                    "Something went wrong creating your link. Please try again.",
               );
          } finally {
               setSubmitting(false);
               setForm({
                    longUrl: "",
                    title: "",
                    tags: [],
                    customCode: "",
               });
          }
     };

     return (
          <div className="max-w-3xl mx-auto px-3 md:px-8  flex flex-col gap-5 ">
               <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-bold text-dashText">
                         Create a new short link
                    </h4>
               </div>

               <div>
                    <form
                         id="create-link"
                         onSubmit={handleSubmit}
                         className="w-full flex flex-col items-center gap-8"
                    >
                         <section className="bg-dashBg w-[98%] py-15 px-4 rounded-sm flex flex-col gap-8">
                              <section>
                                   <label
                                        htmlFor="url"
                                        className="text-text text-xs font-extrabold"
                                   >
                                        DESTINATION URL
                                   </label>
                                   <input
                                        id="url"
                                        type="url"
                                        name="longUrl"
                                        value={form.longUrl}
                                        onChange={handleChange}
                                        className={`w-full border ${
                                             urlError
                                                  ? "border-red-500"
                                                  : "border-navB"
                                        } py-2.5 rounded-sm mt-2.5 px-4 outline-none focus:shadow2 text-input text-sm font-medium`}
                                        placeholder="https://example.com/my-long-url"
                                        required
                                   />
                                   {urlError && (
                                        <div className="flex items-center mt-1 gap-2 w-full md:w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                                             <CircleAlert
                                                  size={18}
                                                  className="text-red-500 shrink-0"
                                             />
                                             <p className="text-sm text-red-500">
                                                  {urlError}
                                             </p>
                                        </div>
                                   )}
                              </section>

                              <section className="flex items-end gap-4">
                                   <div className="flex-1">
                                        <label
                                             htmlFor="domain"
                                             className="text-text text-sm font-extrabold"
                                        >
                                             Short link domain
                                        </label>

                                        <div className="relative mt-2.5">
                                             <input
                                                  id="domain"
                                                  type="text"
                                                  value="s.utpx.in"
                                                  className="w-full border border-navB rounded-sm py-2.5 pl-4 pr-10 outline-none focus:shadow2 text-input text-sm font-medium"
                                                  readOnly
                                             />

                                             <SlLock
                                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                                  size={14}
                                             />
                                        </div>
                                   </div>

                                   <div className="pb-2.5 text-lg font-medium">
                                        /
                                   </div>

                                   <div className="flex-1">
                                        <label
                                             htmlFor="alias"
                                             className="text-text text-sm font-extrabold"
                                        >
                                             Custom alias{" "}
                                             <span className="text-xs">
                                                  (optional)
                                             </span>
                                        </label>

                                        <input
                                             id="alias"
                                             type="text"
                                             name="customCode"
                                             value={form.customCode}
                                             onChange={handleChange}
                                             className="w-full border border-navB rounded-sm py-2.5 px-4 mt-2.5 outline-none focus:shadow2 text-input text-sm font-medium"
                                        />
                                   </div>
                              </section>

                              <section>
                                   <label
                                        htmlFor="title"
                                        className="text-text text-sm font-extrabold"
                                   >
                                        Title{" "}
                                        <span className="text-xs">
                                             (optional)
                                        </span>
                                   </label>
                                   <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-navB rounded-sm py-2.5 px-4 mt-2.5 outline-none focus:shadow2 text-input text-sm font-medium"
                                   />
                              </section>

                              <section>
                                   <label
                                        htmlFor="tags"
                                        className="text-text text-sm font-extrabold"
                                   >
                                        Tags{" "}
                                        <span className="text-xs">
                                             (optional)
                                        </span>
                                   </label>

                                   <div className="mt-2.5 flex flex-wrap items-center gap-2 border border-navB rounded-sm px-3 py-2.5 focus-within:shadow2">
                                        {tags.map((tag) => (
                                             <span
                                                  key={tag}
                                                  className="flex items-center gap-1 bg-navB px-2 rounded text-sm"
                                             >
                                                  {tag}
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            removeTag(tag)
                                                       }
                                                  >
                                                       <X size={14} />
                                                  </button>
                                             </span>
                                        ))}

                                        {tags.length < 3 && (
                                             <input
                                                  id="tags"
                                                  type="text"
                                                  value={input}
                                                  onChange={(e) =>
                                                       setInput(e.target.value)
                                                  }
                                                  onKeyDown={handleKeyDown}
                                                  placeholder={
                                                       tags.length === 0
                                                            ? "Add tags"
                                                            : ""
                                                  }
                                                  className="flex-1 min-w-25 outline-none text-sm font-medium"
                                             />
                                        )}
                                   </div>

                                   {tags.length > 0 && (
                                        <p className="mt-2 text-xs text-muted px-1">
                                             {tags.length}/3 tags
                                        </p>
                                   )}
                              </section>
                         </section>

                         <div className="w-full flex justify-between sticky mt-4  bottom-1.5 md:bottom-3 bg-dashBg py-3 items-center rounded-xl px-4 md:px-8  shadow3">
                              <Link
                                   href="/links"
                                   className="border border-navB py-2 px-4 rounded shadow-xs"
                              >
                                   Cancel
                              </Link>

                              <button
                                   type="submit"
                                   disabled={submitting}
                                   className="min-w-40 h-11 flex items-center justify-center rounded bg-[#c41e3a] text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                   {submitting ? (
                                        <div className="flex items-center justify-center w-8">
                                             <Ellipsis className="text-white animate-pulse w-50 h-50" />
                                        </div>
                                   ) : (
                                        "Create your link"
                                   )}
                              </button>
                         </div>
                    </form>
               </div>

               <SuccessModal
                    open={showModal}
                    link={shortLink}
                    onClose={() => setShowModal(false)}
               />
          </div>
     );
}

export default CreateLink;
