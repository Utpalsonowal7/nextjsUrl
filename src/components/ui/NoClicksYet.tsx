import React from 'react'

export default function NoClicksYet() {
  return (
       <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-muted">
            <div className="w-12 h-12 rounded-full bg-navB/50 flex items-center justify-center">
                 <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                 >
                      <path d="M3 3v18h18" />
                      <path d="m7 16 4-5 3 3 5-7" />
                 </svg>
            </div>

            <div className="text-center">
                 <p className="text-sm font-medium text-muted">No clicks yet</p>
                 <p className="text-xs text-muted/60 mt-1">
                      Your click activity will appear here
                 </p>
            </div>
       </div>
  );
}
