"use client";

import { ArrowRight, Link as LinkIcon, MoveRight } from "lucide-react";
import Link from "next/link";
import Theme from "@/components/theme";
import { faqs } from "@/data/faq";
import { weOffer } from "@/data/weOffer";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { contributions } from "@/data/contribution";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { currentUser } from "@/lib/features/auth/authSlice";
import { getCurrentUser } from "@/lib/features/auth/authThunks";
import DonationModal from "@/components/models/DonationModal";

export default function Home() {
     const [openIndex, setOpenIndex] = useState<number | null>(null);
     const [donating, setDonating] = useState<string | null>(null);
     const [donationModal, setDonationModal] = useState(false);

     const [selectedDonation, setSelectedDonation] = useState<{
          amount: number;
          title: string;
     } | null>(null);

     const [donationForm, setDonationForm] = useState({
          name: "",
          email: "",
          phone: "",
     });

     const dispatch = useAppDispatch();

     useEffect(() => {
          dispatch(getCurrentUser());
     }, [dispatch]);

     useEffect(() => {
          const script = document.createElement("script");

          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;

          document.body.appendChild(script);

          return () => {
               document.body.removeChild(script);
          };
     }, []);

     const user = useAppSelector(currentUser);

     const openDonationModal = (amount: number, title: string) => {
          setSelectedDonation({
               amount,
               title,
          });

          setDonationForm({
               name: user?.name || "",
               email: user?.email || "",
               phone: "",
          });

          setDonationModal(true);
     };

     const handleDonation = async (
          amount: number,
          contributionTitle: string,
          form: {
               name: string;
               email: string;
               phone: string;
          },
     ) => {
          try {
               setDonating(contributionTitle);

               const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACkEND_URL}order/create-order`,
                    {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                              name: form.name,
                              email: form.email,
                              phone: form.phone,
                              amount,
                         }),
                    },
               );

               const result = await response.json();

               if (!response.ok || !result.success) {
                    throw new Error(
                         result.message || "Failed to create donation order",
                    );
               }

               const donationOrder = result.data.donationOrder;

               console.log("Donation order created:", donationOrder);

               if (!(window as any).Razorpay) {
                    throw new Error("Razorpay SDK is not loaded");
               }

               const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

                    amount: donationOrder.amount,

                    currency: donationOrder.currency,

                    name: "LnkShrt",

                    description: "Support LnkShrt development",

                    order_id: donationOrder.orderId,

                    prefill: {
                         name: form.name,
                         email: form.email,
                         contact: form.phone,
                    },

                    theme: {
                         color: "#c41e3a",
                    },

                    handler: async (paymentResponse: {
                         razorpay_payment_id: string;
                         razorpay_order_id: string;
                         razorpay_signature: string;
                    }) => {
                         try {
                              console.log("Payment successful!");

                              console.log(
                                   "Payment ID:",
                                   paymentResponse.razorpay_payment_id,
                              );

                              console.log(
                                   "Order ID:",
                                   paymentResponse.razorpay_order_id,
                              );

                              console.log(
                                   "Signature:",
                                   paymentResponse.razorpay_signature,
                              );

                              const verifyResponse = await fetch(
                                   `${process.env.NEXT_PUBLIC_BACkEND_URL}order/verify-payment`,
                                   {
                                        method: "POST",

                                        headers: {
                                             "Content-Type": "application/json",
                                        },

                                        body: JSON.stringify({
                                             donationId:
                                                  donationOrder.donationId,

                                             razorpayOrderId:
                                                  paymentResponse.razorpay_order_id,

                                             razorpayPaymentId:
                                                  paymentResponse.razorpay_payment_id,

                                             razorpaySignature:
                                                  paymentResponse.razorpay_signature,
                                        }),
                                   },
                              );

                              const verifyResult = await verifyResponse.json();

                              console.log(
                                   "Verification response:",
                                   verifyResult,
                              );

                              if (!verifyResponse.ok || !verifyResult.success) {
                                   throw new Error(
                                        verifyResult.message ||
                                             "Payment verification failed",
                                   );
                              }

                              console.log(
                                   "Donation payment verified successfully!",
                              );

                              alert(
                                   "Thank you! Your donation was successful ❤️",
                              );
                         } catch (error) {
                              console.error(
                                   "Payment verification error:",
                                   error,
                              );

                              alert(
                                   error instanceof Error
                                        ? error.message
                                        : "Payment verification failed",
                              );
                         } finally {
                              setDonating(null);
                         }
                    },

                    modal: {
                         ondismiss: () => {
                              console.log("Razorpay checkout closed");

                              setDonating(null);
                         },
                    },
               };

               const razorpay = new (window as any).Razorpay(options);

               razorpay.open();

               setDonationModal(false);
          } catch (error) {
               console.error("Donation error:", error);

               alert(
                    error instanceof Error
                         ? error.message
                         : "Unable to start donation",
               );

               setDonating(null);
          }
     };

     return (
          <>
               <nav className=" fixed top-0 left-0 w-full  z-50 bg-background flex items-center justify-between border-b border-foreground/30 px-2.5 lg:px-30">
                    <div className="flex items-center py-5 px-3 gap-1.5 ">
                         <LinkIcon size={30} />
                         <a
                              href="#home"
                              className="font-black text-[14px] md:text-xl"
                         >
                              LnkShrt
                         </a>
                    </div>

                    <div className="flex items-center gap-5 px-10 font-extrabold text-[12px] py-3">
                         <a href="#features" className="hidden md:block">
                              FEATURES
                         </a>
                         <a href="#pricing" className="hidden md:block">
                              PRICING
                         </a>
                         <a href="#faq" className="hidden md:block">
                              FAQ
                         </a>
                         <Link href="/login">LOGIN</Link>
                         {user ? (
                              <Link
                                   href="/home"
                                   className="bg-[#c41e3a] text-white py-1 px-2 md:py-4 md:px-4 rounded hover:underline"
                              >
                                   Dashboard
                              </Link>
                         ) : (
                              <Link
                                   href="/register"
                                   className="bg-[#c41e3a] text-white py-1 px-2 md:py-4 md:px-4 rounded"
                              >
                                   Get Started
                              </Link>
                         )}
                         {/* <button
                              onClick={() =>
                                   setTheme(
                                        resolvedTheme === "dark"
                                             ? "light"
                                             : "dark",
                                   )
                              }
                         >
                              {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                         </button> */}
                         <Theme />
                    </div>
               </nav>
               <main className="w-full  flex flex-col  mt-20 md:mt-30 py-1 md:py-10">
                    <section
                         className="py-15 md:py-20 flex flex-col md:flex-row items-center justify-between gap-20 md:gap-10  md:px-30 border-b border-[#3a3530]"
                         id="home"
                    >
                         <div className="px-5 flex flex-col gap-4 ">
                              <p className="text-[#e95e75] font-extrabold">
                                   Engineered For Every Click
                              </p>
                              <h1 className="text-3xl md:text-6xl font-extrabold tracking-[2px] leading-8 md:leading-15">
                                   Doesn&apos;t your <br></br> links deserve a{" "}
                                   <span className="text-[#c41e3a]">
                                        {" "}
                                        better place?
                                   </span>
                              </h1>
                              <p className="text-[#8a8078]">
                                   Create clean, memorable short links with
                                   analytics, custom aliases, QR codes, and
                                   powerful insights—all in one place.
                              </p>
                              <div className="flex flex-col md:flex-row gap-2 mt-3">
                                   <Link
                                        href="/register"
                                        className="bg-[#c41e3a] text-white text-center py-3 md:px-5 hover:underline md:font-[10px] decoration-0 cursor-pointer"
                                   >
                                        Start For Free
                                   </Link>
                                   <a
                                        href="#pricing"
                                        className="flex  items-center justify-center gap-1 border border-[#a2a09d]  py-3 md:px-5 hover:underline md:font-[10px] decoration-0 cursor-pointer"
                                   >
                                        See Pricing <MoveRight size={15} />
                                   </a>
                              </div>
                         </div>
                         <div className="w-[85%] md:w-[55%] flex flex-col  border-5 border-border/90 gap-7 py-7 px-5 lg:px-8 bg-background shadow ">
                              <div className=" flex flex-col gap-2 font-extrabold text-foreground text-[12px] tracking-[8px] ">
                                   <h1>SHORTNER MODULE</h1>
                                   <hr className="h-[.1px] mt-1 border-0 bg-foreground/30" />
                              </div>
                              <div>
                                   <form className=" flex flex-col gap-6">
                                        <section>
                                             <label
                                                  htmlFor="url"
                                                  className="text-text text-[11px] font-extrabold"
                                             >
                                                  DESTINATION URL
                                             </label>
                                             <input
                                                  type="url"
                                                  className="w-full border-2 border-border py-4 mt-1 px-4 outline-none  focus:shadow2 text-input text-[16px] font-semibold"
                                                  placeholder="https://example.com"
                                             />
                                        </section>

                                        <section>
                                             <label
                                                  htmlFor="url"
                                                  className="text-text text-[11px] font-extrabold"
                                             >
                                                  CUSTOM ALIAS (optional)
                                             </label>
                                             <input
                                                  type="url"
                                                  className="w-full border-2 border-border py-4 mt-1 px-4 outline-none focus:shadow2 text-input text-[16px] font-semibold"
                                                  placeholder="e.g. my-link"
                                             />
                                        </section>
                                        <button className="w-full flex items-center justify-center gap-2 bg-foreground py-4 px-4 cursor-pointer transition-transform duration-150 active:translate-y-1">
                                             <ArrowRight
                                                  className="text-background"
                                                  size={15}
                                             />
                                             <span className="text-background font-black text-[14px]">
                                                  GENERATE NOW
                                             </span>
                                        </button>
                                   </form>
                              </div>
                         </div>
                    </section>

                    <section
                         className="flex flex-col py-15 px-5  gap-3 mt-3 md:px-30 border-b border-[#3a3530]"
                         id="features"
                    >
                         <div className="py-5  flex flex-col gap-2">
                              <h1 className="text-2xl text-foreground font-extrabold md:text-4xl">
                                   Why Choose LnkShrt ?
                              </h1>

                              <h4 className="text-[#8a8078]">
                                   We have everything for you&apos;r links
                              </h4>
                         </div>
                         <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
                              {weOffer.map((feature) => (
                                   <div
                                        key={feature.title}
                                        className="flex flex-col items-center py-5 px-5 gap-2 border-b border-[#3a3530] md:w-[32%] md:px-10 md:border-r "
                                   >
                                        <feature.icon size={24} />
                                        <h3 className="text-[#c31e4a]">
                                             {feature.title}
                                        </h3>
                                        <p>{feature.description}</p>
                                   </div>
                              ))}
                         </div>
                    </section>

                    <section
                         className="flex flex-col py-15 px-5  gap-3 mt-3 md:px-30 border-b border-[#3a3530]"
                         id="pricing"
                    >
                         <div className="py-5  flex flex-col gap-2">
                              <h1 className="text-2xl text-foreground font-extrabold md:text-4xl">
                                   Everything is Free — For Now
                              </h1>

                              <h4 className="text-[#8a8078] py-3 md:max-w-150 leading-6">
                                   We&apos;re currently offering all of our
                                   features completely free. Enjoy everything
                                   our platform has to offer without any
                                   subscriptions or hidden costs. <br />
                                   <br />
                                   Although, If you find our service useful and
                                   would like to support its development,
                                   you&apos;re always welcome to contribute.
                                   Every contribution helps us improve the
                                   platform and keep building new features for
                                   everyone.
                              </h4>
                         </div>

                         <div className="flex gap-6 overflow-x-auto py-5 hide-scrollbar">
                              {contributions.map((con) => (
                                   <div
                                        key={con.title}
                                        className="
        w-[90%] md:w-[23%]
        shrink-0
        flex flex-col
        justify-between
        gap-8
        border-2 border-border
        bg-background
        p-6
        shadow
        transition-all duration-300
        hover:-translate-x-1 hover:-translate-y-1
      "
                                   >
                                        <div className="space-y-5">
                                             <span className="inline-block rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-text">
                                                  Contribution
                                             </span>

                                             <div>
                                                  <h2 className="text-2xl font-extrabold text-foreground">
                                                       {con.title}
                                                  </h2>

                                                  <h3 className="mt-3 text-5xl font-black tracking-tight text-foreground">
                                                       {`₹${con.amount}`}
                                                  </h3>
                                             </div>

                                             <p className="leading-relaxed text-text">
                                                  {con.description}
                                             </p>
                                        </div>

                                        <button
                                             type="button"
                                             disabled={donating !== null}
                                             onClick={() =>
                                                  openDonationModal(
                                                       Number(con.amount),
                                                       con.title,
                                                  )
                                             }
                                             className="
          mt-2
          rounded-lg
          border-2 border-foreground
          px-5
          py-3
          text-center
          font-bold
          uppercase
          tracking-wider
          cursor-pointer
          transition-colors duration-200
          hover:bg-foreground
          hover:text-background
          disabled:opacity-50
          disabled:cursor-not-allowed
     "
                                        >
                                             {donating === con.title
                                                  ? "Processing..."
                                                  : "Donate Now →"}
                                        </button>
                                   </div>
                              ))}
                         </div>
                    </section>

                    <section
                         className="flex flex-col py-15 px-5  gap-3 mt-3 md:px-30 border-b border-[#3a3530]"
                         id="faq"
                    >
                         <div className="py-5  flex flex-col gap-2">
                              <h1 className="text-2xl text-foreground font-extrabold md:text-4xl">
                                   FAQs
                              </h1>
                         </div>

                         <div className="flex flex-col gap-5">
                              {faqs.map((fa, index) => (
                                   <div
                                        key={fa.question}
                                        className="flex flex-col gap-3 border-b py-5 cursor-pointer border-[#3a3530] transition-allduration-900 ease-in-out"
                                        onClick={() =>
                                             setOpenIndex((pre) =>
                                                  pre === index ? null : index,
                                             )
                                        }
                                   >
                                        <h1 className="flex justify-between">
                                             <span>{fa.question}</span>
                                             {openIndex === index ? (
                                                  <ChevronUp />
                                             ) : (
                                                  <ChevronDown />
                                             )}
                                        </h1>
                                        <div
                                             className={`overflow-hidden transition-all duration-700 ${
                                                  openIndex === index
                                                       ? "max-h-40 opacity-100 mt-2"
                                                       : "max-h-0 opacity-0"
                                             }`}
                                        >
                                             <p className="px-3 text-[#8a8078] leading-7">
                                                  {fa.answer}
                                             </p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </section>

                    <section className="flex flex-col py-15 px-5  gap-3 mt-3 md:px-30 border-b border-[#3a3530]">
                         <div className="py-5  flex flex-col items-center gap-6">
                              <h1 className="text-3xl text-foreground font-bold  md:text-5xl tracking-wide leading-8 md:leading-13">
                                   Ready to Know Your <br />
                                   Audience Better?
                              </h1>

                              <Link
                                   href="/register"
                                   className="bg-[#c41e3a] py-5 px-12 text-white"
                              >
                                   Start for free
                              </Link>
                         </div>
                    </section>
               </main>

               <DonationModal
                    open={donationModal}
                    amount={selectedDonation?.amount ?? 0}
                    name={donationForm.name}
                    email={donationForm.email}
                    phone={donationForm.phone}
                    onNameChange={(value) =>
                         setDonationForm((prev) => ({
                              ...prev,
                              name: value,
                         }))
                    }
                    onEmailChange={(value) =>
                         setDonationForm((prev) => ({
                              ...prev,
                              email: value,
                         }))
                    }
                    onPhoneChange={(value) =>
                         setDonationForm((prev) => ({
                              ...prev,
                              phone: value,
                         }))
                    }
                    onClose={() => {
                         setDonationModal(false);
                         setSelectedDonation(null);
                    }}
                    onSubmit={(e) => {
                         e.preventDefault();

                         if (!selectedDonation) return;

                         handleDonation(
                              selectedDonation.amount,
                              selectedDonation.title,
                              donationForm,
                         );
                    }}
               />

               <footer className="flex justify-between md:flex-row py-5 px-5 md:px-30">
                    <div className="flex items-center justify-between py-5 px-3 gap-1.5 ">
                         <div className="flex items-center gap-1">
                              <LinkIcon size={30} />
                              <a
                                   href="#home"
                                   className="font-black text-[14px] md:text-xl"
                              >
                                   LnkShrt
                              </a>
                         </div>
                    </div>
                    <p className="flex items-center text-[13px] text-[#6b6560]">
                         &copy; 2026 LnkShrt
                    </p>
               </footer>
          </>
     );
}
