// ─── Auth & Clinic ────────────────────────────────────────────────────────────

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Clinic {
  id: string
  name: string
  businessEmail: string
  timezone: string
  country: string
  city: string
  phone: string
  logoUrl?: string
  reviewStatus: ReviewStatus
  reviewSubmittedAt: string
  approvedAt?: string
  stripeAccountId?: string
  stripeConnected: boolean
  passFeesToPatient: boolean
  bnplEnabled: boolean
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'clinic_admin' | 'staff' | 'patient'
  clinicId?: string
  avatarUrl?: string
  createdAt: string
}

// ─── Products / CMS ───────────────────────────────────────────────────────────

export type PricingType  = 'individual' | 'bundle' | 'variation'
export type ProductType  = 'unit' | 'session' | 'syringe' | 'vial' | 'package' | 'treatment' | 'area'

export interface ProductVariation {
  id: string
  label: string      // e.g. "Upper Face", "Full Face"
  price: number
  memberPrice?: number
}

export interface BundleTier {
  id: string
  sessions: number
  price: number
  memberPrice?: number
  label: string      // e.g. "Starter Pack"
}

export interface ExpectationCard {
  id: string
  type: 'pre' | 'post'
  title: string
  body: string
  iconEmoji?: string
}

export interface BeforeAfterImage {
  id: string
  beforeUrl: string
  afterUrl: string
  caption?: string
  productId: string
}

export interface Product {
  id: string
  clinicId: string
  name: string
  productType: ProductType
  category: string
  concern: string[]         // ['anti-aging', 'acne', 'pigmentation']
  description: string
  pricingType: PricingType
  basePrice?: number        // for individual
  memberPrice?: number
  variations?: ProductVariation[]
  bundles?: BundleTier[]
  durationMinutes: number
  coverImageUrl?: string
  galleryImages: string[]
  beforeAfterImages: BeforeAfterImage[]
  expectationCards: ExpectationCard[]
  schedulingLink?: string   // URL | deep-link | https://wa.me/...
  isActive: boolean
  isMemberOnly: boolean
  createdAt: string
}

/** @deprecated use Product */
export type Treatment = Product

// ─── Memberships ──────────────────────────────────────────────────────────────

export type RolloverMode = 'stack' | 'expire'

export interface MembershipTier {
  id: string
  clinicId: string
  name: string
  monthlyPrice: number
  annualPrice?: number
  includedProducts: { productId: string; sessionsPerMonth: number }[]
  rolloverMode: RolloverMode
  rolloverCapSessions?: number
  perks: string[]
  stripeProductId?: string
  stripePriceId?: string
  isActive: boolean
  createdAt: string
}

export interface MembershipSubscription {
  id: string
  patientId: string
  tierId: string
  clinicId: string
  status: 'active' | 'paused' | 'cancelled'
  startDate: string
  nextBillingDate: string
  creditsRemaining: number
  creditsRolledOver: number
  totalSaved: number
  stripeSubscriptionId?: string
}

// ─── Offers & Campaigns ───────────────────────────────────────────────────────

export type TriggerType = 'birthday' | 'anniversary' | 'holiday' | 'manual'
export type OfferType  = 'discount' | 'free_treatment' | 'scratch_card' | 'points_bonus'

export interface Offer {
  id: string
  clinicId: string
  title: string
  description: string
  offerType: OfferType
  triggerType: TriggerType
  holidayDate?: string      // ISO for holiday triggers
  discountPercent?: number
  discountFixed?: number
  pointsBonus?: number
  freeProductId?: string
  scratchRevealValue?: string   // what the scratch card reveals
  voiceMessageUrl?: string      // birthday voice note
  isActive: boolean
  sentCount: number
  redemptionCount: number
  createdAt: string
}

// ─── Analytics / Dashboard ────────────────────────────────────────────────────

export interface DailyMetric {
  date: string
  revenue: number
  newPatients: number
  checkIns: number
  referrals: number
  googleReviews: number
}

export interface StaffMember {
  id: string
  clinicId: string
  name: string
  avatarUrl?: string
  role: string
  membershipsSold: number
  treatmentsRedeemed: number
  totalRevenue: number
  pointsThisPeriod: number
}

// ─── Patient / App ────────────────────────────────────────────────────────────

export interface Patient {
  id: string
  clinicId: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  anniversaryDate?: string
  qrCode: string
  loyaltyPoints: number
  skinProfile?: SkinProfile
  membershipId?: string
  createdAt: string
  totalSpend: number
  referralCode: string
  referredBy?: string
}

export interface SkinProfile {
  skinType: 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive'
  primaryConcerns: string[]
  allergies: string[]
  lastAssessment: string
  dermatologistNotes?: string
}

export interface CartItem {
  productId: string
  name: string
  imageUrl?: string
  pricingType: PricingType
  selectedVariationId?: string
  selectedBundleTierId?: string
  quantity: number
  unitPrice: number
  memberPrice?: number
}

export interface PointsTransaction {
  id: string
  patientId: string
  type: 'earn' | 'redeem' | 'expire'
  source: 'purchase' | 'referral' | 'google_review' | 'checkin' | 'redemption' | 'signup_bonus'
  points: number
  description: string
  createdAt: string
  expiresAt?: string
}

export interface RewardRedemption {
  id: string
  patientId: string
  mode: 'bank_in' | 'redeem'   // cash discount | free service
  pointsUsed: number
  cashValue?: number
  treatmentId?: string
  expiresAt: string            // 3-day timer
  status: 'pending' | 'used' | 'expired'
  createdAt: string
}

export interface BlogArticle {
  id: string
  title: string
  excerpt: string
  coverImageUrl: string
  authorName: string
  authorCredentials: string
  tags: string[]
  readMinutes: number
  publishedAt: string
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface ApiStatus {
  loading: boolean
  error: string | null
}

export type ViewMode = 'admin' | 'patient'
