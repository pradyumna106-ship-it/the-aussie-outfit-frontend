import { processPayment, verifyPayment } from "../api/payment.api.js";
import { toast } from "react-toastify";
export const handlePayment = async (paymentData, user) => {

    try {
        // CREATE ORDER
        const response = await processPayment(paymentData);
        
        console.log("PAYMENT RESPONSE:", response.data);

        if (!response?.data?.success) {
            toast.error("Failed to create payment order");
            return false;
        }

        const razorpayOrder = response.data.razorpayOrder;

        // CHECK SDK
        if (!window.Razorpay) {
            toast.error("Razorpay SDK not loaded");
            return false;
        }

        // IMPORTANT
        const razorpayKey = "rzp_test_90lAmUtfOQvFlI";

        console.log("RAZORPAY KEY:", razorpayKey);

        if (!razorpayKey) {
            toast.error("Razorpay Key Missing");
            return false;
        }

        const options = {

            key: razorpayKey,

            amount: razorpayOrder.amount,

            currency: razorpayOrder.currency,

            name: "Everything Australia",

            description: "Order Payment",

            order_id: razorpayOrder.id,

            handler: async function (paymentResponse) {

                console.log("PAYMENT SUCCESS:", paymentResponse);

                try {

                    const verifyResponse = await verifyPayment({

                        razorpay_order_id:
                            paymentResponse.razorpay_order_id,

                        razorpay_payment_id:
                            paymentResponse.razorpay_payment_id,

                        razorpay_signature:
                            paymentResponse.razorpay_signature,
                        status: "success"
                    });

                    console.log("VERIFY RESPONSE:", verifyResponse.data);

                    if (verifyResponse.data.success) {

                        toast.success("Payment Successful");

                    } else {

                        toast.error("Payment Verification Failed");
                    }

                } catch (error) {

                    console.error("VERIFY ERROR:", error);

                    toast.error("Error verifying payment");

                }
            },

            modal: {

                ondismiss: async function () {

                    console.log("Checkout closed");

                    try {

                        await verifyPayment({

                            razorpay_order_id: razorpayOrder.id,

                            razorpay_payment_id: "",

                            razorpay_signature: "",

                            status: "cancelled"
                        });

                        toast.error("Payment Cancelled");

                    } catch (error) {

                        console.error(
                            "CANCEL PAYMENT API ERROR:",
                            error
                        );
                    }
                }
            },

            prefill: {

                name: user?.name || "",

                email: user?.email || "",

                contact: user?.phone || ""
            },

            notes: {

                userId: user?._id || ""
            },

            theme: {
                color: "#3399cc"
            }
        };

        console.log("RAZORPAY OPTIONS:", options);

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", async function (response) {

            console.error("PAYMENT FAILED:", response.error);

            try {

                await verifyPayment({

                    razorpay_order_id:
                        response.error.metadata.order_id,

                    razorpay_payment_id:
                        response.error.metadata.payment_id || "",

                    razorpay_signature: "",

                    status: "failed"
                });

            } catch (error) {

                console.error(
                    "FAILED PAYMENT API ERROR:",
                    error
                );
            }

            toast.error(response.error.description);
        });

        razorpay.open();

        return true;

    } catch (error) {

        console.error("PAYMENT ERROR:", error);

        toast.error("Payment initialization failed");

        return false;
    }
};