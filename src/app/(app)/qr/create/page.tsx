"use client";

import { Italianno } from "next/font/google";

const italianno = Italianno({
     weight: "400",
     subsets: ["latin"],
});

import React from "react";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";

import { ArrowLeft, CircleAlert, Download, Ellipsis, X } from "lucide-react";
import { FaRegCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Link from "next/link";
import { PostLink } from "@/types";
import { ShortLink } from "@/types";
import api from "@/api/axios";
import SuccessModal from "@/components/models/LinkCreatedModal";

import { ReactQRCode } from "@lglab/react-qr-code";
import { toJpeg, toPng } from "html-to-image";

import QRCustomization, {
     type QROptions,
} from "@/components/ui/QrCustomization";

function GenerateQr() {
     const [input, setInput] = useState<string>("");
     const [form, setForm] = useState<PostLink>({
          longUrl: "",
          title: "",
          tags: [],
     });

     const { showToast } = useToast();

     const [urlError, setUrlError] = useState<string>("");
     const [submitting, setSubmitting] = useState<boolean>(false);
     const [showModal, setShowModal] = useState<boolean>(false);
     const [shortLink, setShortLink] = useState<ShortLink | null>(null);
     const [stage, setStage] = useState<"link" | "qr">("link");

     const [brandingName, setBrandingName] = useState<string>("scan me");
     const [downloading, setDownloading] = useState<"png" | "jpg" | null>(null);
     const [downloadError, setDownloadError] = useState<string>("");

     const qrCaptureRef = useRef<HTMLDivElement>(null);
     const linkCheck = useRef<HTMLInputElement>(null);

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
               linkCheck.current?.focus();
               return;
          }

          if (!isValidUrl(form.longUrl.trim())) {
               setUrlError(
                    "Please enter a valid URL (e.g. https://example.com).",
               );
               linkCheck.current?.focus();
               return;
          }

          setStage("qr");

          // Uncomment when the create-link endpoint is wired up.
          // If you re-enable this, keep setStage("qr") ONLY inside the
          // try block on success, not before the request fires.
          //
          // setSubmitting(true);
          //
          // const payload = {
          //      ...form,
          //      title: form.title?.trim() || undefined,
          //      tags,
          // };
          //
          // try {
          //      const { data } = await api.post<ApiResponse<ShortLink>>(
          //           "/links",
          //           payload,
          //      );
          //
          //      setShortLink(data.data);
          //      setStage("qr");
          // } catch (err) {
          //      const e = err as AxiosError<{ message?: string }>;
          //      setUrlError(
          //           e.response?.data?.message ||
          //                "Something went wrong creating your link. Please try again.",
          //      );
          // } finally {
          //      setSubmitting(false);
          // }
     };

     // Go back from the "customize design" stage to the "configure code" stage.
     // Form state, tags, and qrOptions are all left untouched, so the user's
     // work is preserved when they land back on the link form.
     const handleBackToLink = () => {
          setDownloadError("");
          setStage("link");
     };

     const [qrOptions, setQrOptions] = useState<QROptions>({
          background: "#ffffff",

          dataModules: {
               color: "#000000",
               style: "square",
          },

          finderOuter: {
               color: "#000000",
               style: "square",
          },

          finderInner: {
               color: "#000000",
               style: "square",
          },

          image: {
               src: "https://reactqrcode.com/images/logo-60.png",
               width: 50,
               height: 50,
               excavate: true,
               opacity: 1,
          },
     });

     const handleDownload = async (format: "png" | "jpg") => {
          if (!qrCaptureRef.current) {
               return;
          }

          if (!form.longUrl.trim()) {
               showToast("A long URL is needed", "error");
               return;
          }

          setDownloadError("");
          setDownloading(format);

          try {
               const dataUrl =
                    format === "png"
                         ? await toPng(qrCaptureRef.current, {
                                pixelRatio: 3,
                                cacheBust: true,
                                backgroundColor: "#ffffff",
                           })
                         : await toJpeg(qrCaptureRef.current, {
                                pixelRatio: 3,
                                cacheBust: true,
                                quality: 0.95,
                                backgroundColor: "#ffffff",
                           });

               const fileName = brandingName.trim()
                    ? brandingName.trim().toLowerCase().replace(/\s+/g, "-")
                    : "qr-code";

               // 1. Trigger the local download first.
               const link = document.createElement("a");
               link.download = `${fileName}.${format}`;
               link.href = dataUrl;
               link.click();

               // 2. Only once the download has been kicked off do we notify
               //    the backend, and only with the image + form data.
               const blob = await (await fetch(dataUrl)).blob();

               const body = new FormData();
               body.append("image", blob, `${fileName}.${format}`);
               body.append("form", JSON.stringify(form));

               await api.post(`/qr/qr-generate`, body, {
                    headers: { "Content-Type": "multipart/form-data" },
               });
          } catch (err) {
               console.error("Failed to export QR code:", err);
               const message =
                    "Something went wrong saving your QR code. Please try again.";
               setDownloadError(message);
          } finally {
               setDownloading(null);
          }
     };

     return (
          <div className="flex flex-col gap-8 px-5 md:px-16 py-8">
               <div className="flex items-center">
                    <div
                         className={`flex items-center gap-2 font-bold text-sm ${
                              stage === "link" ? "text-short" : "text-dashText"
                         }`}
                    >
                         <span>
                              {stage === "link" ? (
                                   <FaRegCircle size={16} />
                              ) : (
                                   <IoIosCheckmarkCircle
                                        size={16}
                                        className="text-short"
                                   />
                              )}
                         </span>
                         <span>Configure code</span>
                    </div>

                    <div
                         className={`w-16 h-px mx-3 ${
                              stage === "link" ? "bg-cardBorder" : "bg-short"
                         }`}
                    />

                    <div
                         className={`flex items-center gap-2 font-bold text-sm ${
                              stage === "link" ? "text-muted" : "text-short"
                         }`}
                    >
                         <span>
                              <FaRegCircle size={16} />
                         </span>
                         <span>Customize design</span>
                    </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6">
                    {stage === "link" ? (
                         <div className="w-full md:w-[70%] bg-dashBg border border-cardBorder rounded-2xl px-4 md:px-8 py-6 flex flex-col gap-5 shadow-sm">
                              <div className="flex items-center justify-between">
                                   <h4 className="text-2xl font-extrabold text-dashText">
                                        Create a new LnkShrt Code
                                   </h4>
                              </div>

                              <form
                                   id="create-link"
                                   onSubmit={handleSubmit}
                                   className="w-full flex flex-col items-center gap-8"
                              >
                                   <section className="bg-dashBg w-full py-10 px-4 md:px-8 rounded-xl flex flex-col gap-8 border border-cardBorder">
                                        <section>
                                             <label
                                                  htmlFor="url"
                                                  className="text-dashText text-xs font-extrabold uppercase tracking-wide"
                                             >
                                                  Destination URL
                                             </label>
                                             <input
                                                  id="url"
                                                  ref={linkCheck}
                                                  type="text"
                                                  name="longUrl"
                                                  value={form.longUrl}
                                                  onChange={handleChange}
                                                  className={`w-full bg-cardBg border ${
                                                       urlError
                                                            ? "border-red-500"
                                                            : "border-cardBorder"
                                                  } py-2.5 rounded-lg mt-2.5 px-4 outline-none focus:shadow2 text-dashText text-sm font-medium transition-all`}
                                                  placeholder="https://example.com/my-long-url"
                                             />
                                             {urlError && (
                                                  <div className="flex items-center mt-1 gap-2 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
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

                                        <section>
                                             <label
                                                  htmlFor="title"
                                                  className="text-dashText text-xs font-extrabold uppercase tracking-wide"
                                             >
                                                  Title{" "}
                                                  <span className="text-muted normal-case font-medium">
                                                       (optional)
                                                  </span>
                                             </label>
                                             <input
                                                  id="title"
                                                  type="text"
                                                  name="title"
                                                  value={form.title}
                                                  onChange={handleChange}
                                                  className="w-full bg-cardBg border border-cardBorder rounded-lg py-2.5 px-4 mt-2.5 outline-none focus:shadow2 text-dashText text-sm font-medium transition-all"
                                             />
                                        </section>

                                        <section>
                                             <label
                                                  htmlFor="tags"
                                                  className="text-dashText text-xs font-extrabold uppercase tracking-wide"
                                             >
                                                  Tags{" "}
                                                  <span className="text-muted normal-case font-medium">
                                                       (optional)
                                                  </span>
                                             </label>

                                             <div className="mt-2.5 flex flex-wrap items-center gap-2 bg-cardBg border border-cardBorder rounded-lg px-3 py-2.5 focus-within:shadow2 transition-all">
                                                  {tags.map((tag) => (
                                                       <span
                                                            key={tag}
                                                            className="flex items-center gap-1 bg-navB text-dashText px-2 py-1 rounded-md text-sm font-semibold"
                                                       >
                                                            {tag}
                                                            <button
                                                                 type="button"
                                                                 onClick={() =>
                                                                      removeTag(
                                                                           tag,
                                                                      )
                                                                 }
                                                                 className="text-muted hover:text-dashText"
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
                                                                 setInput(
                                                                      e.target
                                                                           .value,
                                                                 )
                                                            }
                                                            onKeyDown={
                                                                 handleKeyDown
                                                            }
                                                            placeholder={
                                                                 tags.length ===
                                                                 0
                                                                      ? "Add tags"
                                                                      : ""
                                                            }
                                                            className="flex-1 min-w-25 outline-none text-sm font-medium bg-transparent text-dashText placeholder:text-text"
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

                                   <div className="w-full flex justify-between sticky mt-4 bottom-1.5 md:bottom-3 bg-cardBg py-3 items-center rounded-xl px-4 md:px-8 border border-cardBorder shadow3">
                                        <Link
                                             href="/links"
                                             className="border border-cardBorder text-dashText font-semibold py-2 px-4 rounded-lg hover:bg-navB transition-colors"
                                        >
                                             Cancel
                                        </Link>
                                        <button
                                             type="submit"
                                             disabled={submitting}
                                             className="min-w-40 h-11 flex items-center justify-center rounded-lg bg-short hover:opacity-90 text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                    ) : (
                         <div className="w-full md:w-[70%] bg-cardBg border border-cardBorder rounded-2xl px-4 md:px-8 py-6 shadow-sm flex flex-col gap-5">
                              <button
                                   type="button"
                                   onClick={handleBackToLink}
                                   className="flex items-center gap-2 w-fit text-sm font-bold text-dashText hover:text-short transition-colors cursor-pointer"
                              >
                                   <ArrowLeft size={16} />
                                   Back to link details
                              </button>

                              <QRCustomization
                                   options={qrOptions}
                                   onChange={setQrOptions}
                              />
                         </div>
                    )}

                    <div className="w-full md:w-[30%]">
                         <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 flex flex-col items-center gap-5 shadow-sm sticky top-6">
                              <div
                                   ref={qrCaptureRef}
                                   className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl"
                              >
                                   <ReactQRCode
                                        value={
                                             form.longUrl ||
                                             "https://example.com"
                                        }
                                        size={220}
                                        marginSize={4}
                                        level="H"
                                        background={qrOptions.background}
                                        dataModulesSettings={
                                             qrOptions.dataModules
                                        }
                                        finderPatternOuterSettings={
                                             qrOptions.finderOuter
                                        }
                                        finderPatternInnerSettings={
                                             qrOptions.finderInner
                                        }
                                        imageSettings={
                                             qrOptions.image ?? undefined
                                        }
                                   />

                                   <p
                                        className={`${italianno.className} text-2xl font-extrabold text-black text-center max-w-[260px] break-words`}
                                   >
                                        {brandingName}
                                   </p>
                              </div>

                              <div className="w-full space-y-2">
                                   <label
                                        htmlFor="brandingName"
                                        className="text-xs font-bold uppercase tracking-wide text-muted"
                                   >
                                        Branding name
                                   </label>
                                   <input
                                        id="brandingName"
                                        type="text"
                                        value={brandingName}
                                        onChange={(e) =>
                                             setBrandingName(e.target.value)
                                        }
                                        placeholder="e.g. Summer Sale QR"
                                        maxLength={40}
                                        className="w-full bg-cardBg border border-cardBorder rounded-lg py-2.5 px-3 outline-none focus:shadow2 text-dashText text-sm font-medium transition-all placeholder:text-text"
                                   />
                                   <p className="text-xs text-muted">
                                        Shown above your QR code and used as the
                                        file name when you download it.
                                   </p>
                              </div>

                              {downloadError && (
                                   <div className="flex items-center gap-2 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                                        <CircleAlert
                                             size={18}
                                             className="text-red-500 shrink-0"
                                        />
                                        <p className="text-sm text-red-500">
                                             {downloadError}
                                        </p>
                                   </div>
                              )}

                              <div className="w-full flex gap-2">
                                   <button
                                        type="button"
                                        onClick={() => handleDownload("png")}
                                        disabled={downloading !== null}
                                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-cardBorder text-dashText text-sm font-bold hover:bg-navB transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                   >
                                        <Download size={15} />
                                        {downloading === "png"
                                             ? "Saving..."
                                             : "PNG"}
                                   </button>

                                   <button
                                        type="button"
                                        onClick={() => handleDownload("jpg")}
                                        disabled={downloading !== null}
                                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-short hover:opacity-90 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                   >
                                        <Download size={15} />
                                        {downloading === "jpg"
                                             ? "Saving..."
                                             : "JPG"}
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>

               <SuccessModal
                    open={showModal}
                    link={shortLink}
                    onClose={() => setShowModal(false)}
               />
          </div>
     );
}

export default GenerateQr;
