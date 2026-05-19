import { z } from "zod";

// ── Auth ───────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ── Address ────────────────────────────────────────────────────────────────
export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10, "Enter valid phone number"),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit PIN"),
  country: z.string().default("India"),
  isDefault: z.boolean().optional().default(false),
});

// ── Cart ───────────────────────────────────────────────────────────────────
export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

// ── Coupon ─────────────────────────────────────────────────────────────────
export const validateCouponSchema = z.object({
  code: z.string().min(1).transform((v) => v.trim().toUpperCase()),
  orderAmount: z.number().int().positive(),
});

// ── Checkout / Order ────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  addressId: z.string().cuid(),
  couponCode: z.string().optional(),
});

// ── Products (Admin) ────────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  description: z.string().optional(),
  shortDescription: z.string().max(200).optional(),
  unit: z.string().optional(),
  price: z.number().int().positive("Price must be positive"),
  compareAtPrice: z.number().int().positive().optional(),
  sku: z.string().min(2),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  categoryId: z.string().cuid(),
  brandId: z.string().cuid(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  tint: z.string().optional(),
});

// ── Category (Admin) ────────────────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

// ── Brand (Admin) ──────────────────────────────────────────────────────────
export const brandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  tagline: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

// ── Coupon (Admin) ─────────────────────────────────────────────────────────
export const couponSchema = z.object({
  code: z.string().min(3).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().positive(),
  minOrderAmount: z.number().int().min(0).optional(),
  maxDiscountAmount: z.number().int().min(0).optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

// ── Order Status (Admin) ───────────────────────────────────────────────────
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
});

// ── Payment ─────────────────────────────────────────────────────────────────
export const verifyPaymentSchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
