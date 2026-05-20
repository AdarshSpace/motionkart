declare global {
    interface Window {
      Razorpay: any;
    }
  }

  
  export async function startPayment( courseId: string ) {
    // create order from backend
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          courseId,
        }),
      }
    );

    console.log('res : ', res)
  
    const data = await res.json();

    console.log('Dtat : ',data);
  
    if (!data.success) {
      throw new Error(data.message);
    }
  
    const options = {
      key: data.RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,
  
      name: "Edu Learn LMS",
      description: "Course Purchase",

      method: {
        upi: true,
        card: true,
        netbanking: false,
        wallet: false,
      },
  
      handler: async function (response: any) {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                paymentId: data.paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            }),
          }
        );
  
        window.location.href = "/courses";
      },
  
      theme: {
        color: "#7c3aed",
      },
    };

    console.log('Options : ',options);
  
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }