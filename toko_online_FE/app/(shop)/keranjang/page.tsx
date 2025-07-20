"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-20 w-20 mx-auto text-gray-400 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium border-0"
            >
              <Link href="/produk">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const shippingCost = total >= 100000 ? 0 : 15000;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent"
            >
              <Link href="/produk">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Cart Items ({items.length})
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={
                              item.image_url ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-green-700">
                              Rp{" "}
                              {Math.floor(item.price * 0.8).toLocaleString(
                                "id-ID"
                              )}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              Rp {item.price.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>In Stock</span>
                            <span>•</span>
                            <button className="text-blue-500 hover:text-blue-700 hover:underline">
                              Save for later
                            </button>
                            <span>•</span>
                            <button className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              Add to Wishlist
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="h-8 w-8 border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Number.parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 h-8 text-center text-sm border-gray-300"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="text-right">
                          <p className="font-bold text-gray-900 mb-2">
                            Rp{" "}
                            {(
                              Math.floor(item.price * 0.8) * item.quantity
                            ).toLocaleString("id-ID")}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({items.length} items)
                    </span>
                    <span className="font-medium text-gray-900">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shippingCost === 0
                        ? "FREE"
                        : `Rp ${shippingCost.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Order Total
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      Rp {finalTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {total < 100000 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">FREE Shipping</span> on
                      orders over Rp 100.000
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Add Rp {(100000 - total).toLocaleString("id-ID")} more to
                      qualify
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Button
                    asChild
                    className="w-full h-10 bg-yellow-500 hover:bg-yellow-600 text-black font-medium border-0"
                    size="lg"
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                      <span>🔒 Secure checkout</span>
                      <span>•</span>
                      <span>📦 Fast delivery</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-gray-100">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
