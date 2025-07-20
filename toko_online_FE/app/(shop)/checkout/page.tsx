"use client";

declare global {
  interface Window {
    snap: any;
  }
}

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CreditCard,
  Truck,
  ArrowLeft,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ordersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
  });

  // Handle empty cart redirect
  useEffect(() => {
    if (items.length === 0) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/keranjang");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [items.length, router]);

  // Load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_PUBLIC_KEY ||
        "Mid-client-6oa1-Fj2p0aKB3q6"
    );
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric characters
    const value = e.target.value.replace(/[^0-9+]/g, "");
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.phone || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        cart_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        payment_status: "pending",
      };

      // Create order
      const response = await ordersAPI.create(orderData);
      console.log("Order created:", response);

      // Check if Midtrans Snap is loaded
      if (window.snap) {
        window.snap.pay(response.token, {
          onSuccess: (results: any) => {
            console.log("Success", results);
            toast({
              title: "Payment Successful!",
              description: "Your order has been processed successfully.",
            });
            clearCart();
            router.push("/");
          },
          onPending: (results: any) => {
            console.log("Pending", results);
            toast({
              title: "Payment Pending",
              description: "Your payment is being processed.",
            });
            clearCart();
            router.push("/");
          },
          onError: (results: any) => {
            console.error("Error", results);
            toast({
              title: "Payment Failed",
              description: "There was an error processing your payment.",
              variant: "destructive",
            });
          },
          onClose: () => {
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment popup without finishing.",
              variant: "destructive",
            });
          },
        });
      } else {
        // Fallback if Snap is not loaded
        toast({
          title: "Order created successfully!",
          description: "Redirecting to payment page...",
        });
        clearCart();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while redirecting
  if (items.length === 0 || isRedirecting) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-20 w-20 mx-auto text-gray-400 mb-6" />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Your cart is empty. Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent"
              >
                <Link href="/keranjang">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Cart
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:bg-blue-50"
              >
                <Link href="/produk">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Complete your order and proceed to payment
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                    <Truck className="mr-2 h-5 w-5 text-blue-500" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="customer_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+62 812-3456-7890"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Shipping Address *
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete shipping address"
                      rows={4}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2">
                      Midtrans Payment Gateway
                    </p>
                    <p className="text-sm text-gray-600">
                      You will be redirected to Midtrans secure payment page to
                      complete your payment. We accept various payment methods
                      including credit cards, bank transfers, and e-wallets.
                    </p>

                    {/* Payment Methods */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">We accept:</p>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          VISA
                        </div>
                        <div className="px-2 py-1 bg-red-600 text-white text-xs rounded">
                          MC
                        </div>
                        <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                          BCA
                        </div>
                        <div className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                          OVO
                        </div>
                        <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                          DANA
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4 border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <img
                            src={
                              item.image_url ||
                              "/placeholder.svg?height=48&width=48"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">
                            Rp{" "}
                            {(
                              Math.floor(item.price) * item.quantity
                            ).toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-gray-500 line-through">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Pricing */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="font-medium text-gray-900">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <Separator className="bg-gray-200" />
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Order Total
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-medium border-0 text-base"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Place Order & Pay
                        </>
                      )}
                    </Button>

                    {/* Additional Navigation Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                      >
                        <Link href="/keranjang">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Edit Cart
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        className="text-blue-500 hover:bg-blue-50"
                      >
                        <Link href="/produk">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add More
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        🔒 Secure checkout
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        📦 Fast delivery
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        💯 Money back guarantee
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      By placing this order, you agree to our{" "}
                      <button className="text-blue-500 hover:underline">
                        terms and conditions
                      </button>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
