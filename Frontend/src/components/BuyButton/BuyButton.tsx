"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { startPayment } from "@/lib/payment";

export default function BuyButton({  courseId }: { courseId: string }) {

  const [loading, setLoading] = useState(false);

  async function handleBuyNow() {

    try {

      setLoading(true);

      const res = await startPayment(courseId);

      console.log(res);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      <Button
        onClick={handleBuyNow}
        disabled={loading}
        className="w-full bg-[#0039a6] hover:bg-[#002d85] h-12 text-base font-bold rounded-xl disabled:opacity-70"
      >
        {loading ? "Processing..." : "Enroll Now"}
      </Button>

      <p className="text-center text-xs text-slate-400 font-medium">
        30-day money-back guarantee
      </p>
    </div>
  );
}