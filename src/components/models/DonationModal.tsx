"use client";

interface DonationModalProps {
     open: boolean;
     amount: number;
     name: string;
     email: string;
     phone: string;
     onNameChange: (value: string) => void;
     onEmailChange: (value: string) => void;
     onPhoneChange: (value: string) => void;
     onClose: () => void;
     onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function DonationModal({
     open,
     amount,
     name,
     email,
     phone,
     onNameChange,
     onEmailChange,
     onPhoneChange,
     onClose,
     onSubmit,
}: DonationModalProps) {
     if (!open) return null;

     return (
          <div
               className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5"
               onMouseDown={(e) => {
                    if (e.target === e.currentTarget) {
                         onClose();
                    }
               }}
          >
               <div className="w-full max-w-md border-2 border-border bg-background p-6 shadow-xl">
                    <div className="mb-6">
                         <h2 className="text-2xl font-black text-foreground">
                              Support LnkShrt
                         </h2>

                         <p className="mt-2 text-sm text-text">
                              You&apos;re donating{" "}
                              <span className="font-bold text-foreground">
                                   ₹{amount}
                              </span>
                         </p>
                    </div>

                    <form onSubmit={onSubmit} className="flex flex-col gap-5">
                         <div>
                              <label
                                   htmlFor="donation-name"
                                   className="text-xs font-bold text-text"
                              >
                                   NAME
                              </label>

                              <input
                                   id="donation-name"
                                   type="text"
                                   required
                                   value={name}
                                   onChange={(e) =>
                                        onNameChange(e.target.value)
                                   }
                                   placeholder="Your name"
                                   className="mt-1 w-full border-2 border-border bg-background px-4 py-3 text-foreground outline-none focus:border-foreground"
                              />
                         </div>

                         <div>
                              <label
                                   htmlFor="donation-email"
                                   className="text-xs font-bold text-text"
                              >
                                   EMAIL
                              </label>

                              <input
                                   id="donation-email"
                                   type="email"
                                   required
                                   value={email}
                                   onChange={(e) =>
                                        onEmailChange(e.target.value)
                                   }
                                   placeholder="you@example.com"
                                   className="mt-1 w-full border-2 border-border bg-background px-4 py-3 text-foreground outline-none focus:border-foreground"
                              />
                         </div>

                         <div>
                              <label
                                   htmlFor="donation-phone"
                                   className="text-xs font-bold text-text"
                              >
                                   PHONE NUMBER
                              </label>

                              <input
                                   id="donation-phone"
                                   type="tel"
                                   required
                                   value={phone}
                                   onChange={(e) =>
                                        onPhoneChange(
                                             e.target.value.replace(/\D/g, ""),
                                        )
                                   }
                                   placeholder="10-digit phone number"
                                   pattern="[0-9]{10}"
                                   maxLength={10}
                                   className="mt-1 w-full border-2 border-border bg-background px-4 py-3 text-foreground outline-none focus:border-foreground"
                              />
                         </div>

                         <div className="flex gap-3 pt-2">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="w-1/2 border-2 border-border py-3 font-bold"
                              >
                                   CANCEL
                              </button>

                              <button
                                   type="submit"
                                   className="w-1/2 bg-[#c41e3a] py-3 font-bold text-white"
                              >
                                   CONTINUE
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}
