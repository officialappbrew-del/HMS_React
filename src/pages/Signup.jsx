import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';

// ============================================================
// OPTIMIZED ICON COMPONENT - Dynamically imports only needed icons
// ============================================================
const Icon = ({ name, className = '', ...props }) => {
  const [IconComp, setIconComp] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const mod = await import('lucide-react');
        const Comp = mod[name];
        if (Comp && mounted.current) {
          setIconComp(() => Comp);
        }
      } catch (e) {
        // Silent fail - placeholder will show
      }
    };
    loadIcon();

    return () => {
      mounted.current = false;
    };
  }, [name]);

  if (!IconComp) {
    return <span className={`inline-block w-5 h-5 bg-[#E2DFD6] rounded-sm ${className}`} />;
  }

  return <IconComp className={className} {...props} />;
};

// ============================================================
// MEMOIZED ECG LINE - Prevents unnecessary re-renders
// ============================================================
const EcgLine = React.memo(({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
    <svg
      className="absolute left-0 top-0 h-full w-[200%] motion-safe:animate-ecg-scroll"
      viewBox="0 0 800 60"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0,30 L58,30 L74,30 L84,10 L94,50 L104,30 L120,30 L200,30
           L258,30 L274,30 L284,10 L294,50 L304,30 L320,30 L400,30
           L458,30 L474,30 L484,10 L494,50 L504,30 L520,30 L600,30
           L658,30 L674,30 L684,10 L694,50 L704,30 L720,30 L800,30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));

EcgLine.displayName = 'EcgLine';

// ============================================================
// PROGRESS STEPS COMPONENT - Memoized
// ============================================================
const ProgressSteps = React.memo(({ currentStep, steps }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-[#C79A3D] bg-[#C79A3D] text-white'
                      : isActive
                      ? 'border-[#C79A3D] bg-[#C79A3D]/10 text-[#C79A3D]'
                      : 'border-[#1C2B27]/12 bg-white text-[#9AA6A0]'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  isActive ? 'text-[#1C2B27]' : 'text-[#9AA6A0]'
                }`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 mx-2 h-0.5 rounded ${
                  isCompleted ? 'bg-[#C79A3D]' : 'bg-[#1C2B27]/12'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

ProgressSteps.displayName = 'ProgressSteps';

// ============================================================
// STEP 1: FACILITY INFORMATION - Memoized
// ============================================================
const FacilityInfoStep = React.memo(({ 
  formData, 
  handleChange, 
  isFocused, 
  handleFocus, 
  handleBlur, 
  facilityTypes, 
  countries 
}) => (
  <div className="space-y-3.5">
    <div>
      <label htmlFor="hospitalName" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Hospital or facility name *
      </label>
      <div className="relative">
        <Icon name="Building" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
          isFocused.hospitalName ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
        }`} />
        <input
          id="hospitalName"
          name="hospitalName"
          type="text"
          required
          value={formData.hospitalName}
          onChange={handleChange}
          onFocus={() => handleFocus('hospitalName')}
          onBlur={() => handleBlur('hospitalName')}
          placeholder="e.g., Lagos General Hospital"
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div>
        <label htmlFor="facilityType" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Facility type
        </label>
        <div className="relative">
          <Icon name="Briefcase" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            id="facilityType"
            name="facilityType"
            value={formData.facilityType}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors appearance-none focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          >
            <option value="">Default</option>
            {facilityTypes.map((ft) => (
              <option key={ft.id} value={ft.id}>{ft.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="country" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Country
        </label>
        <div className="relative">
          <Icon name="Globe" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors appearance-none focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name} (+{c.phone_code})</option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="address" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Address *
      </label>
      <div className="relative">
        <Icon name="MapPin" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
          isFocused.address ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
        }`} />
        <input
          id="address"
          name="address"
          type="text"
          required
          value={formData.address}
          onChange={handleChange}
          onFocus={() => handleFocus('address')}
          onBlur={() => handleBlur('address')}
          placeholder="Street address"
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div>
        <label htmlFor="city" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          City *
        </label>
        <div className="relative">
          <Icon name="Home" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            isFocused.city ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
          }`} />
          <input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            onFocus={() => handleFocus('city')}
            onBlur={() => handleBlur('city')}
            placeholder="City"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Phone number *
        </label>
        <div className="relative">
          <Icon name="Phone" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            isFocused.phone ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
          }`} />
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => handleFocus('phone')}
            onBlur={() => handleBlur('phone')}
            placeholder="+234 800 000 0000"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="email" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Billing / work email *
      </label>
      <div className="relative">
        <Icon name="Mail" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
          isFocused.email ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
        }`} />
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          placeholder="billing@hospital.com"
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div>
        <label htmlFor="registrationNumber" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Registration number
        </label>
        <div className="relative">
          <Icon name="FileText" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <input
            id="registrationNumber"
            name="registrationNumber"
            type="text"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="RC 123456"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
        </div>
      </div>

      <div>
        <label htmlFor="taxId" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Tax ID (optional)
        </label>
        <div className="relative">
          <Icon name="CreditCard" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <input
            id="taxId"
            name="taxId"
            type="text"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="Tax ID"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="website" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Website (optional)
      </label>
      <div className="relative">
        <Icon name="Globe" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
        <input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://hospital.com"
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        />
      </div>
    </div>
  </div>
));

FacilityInfoStep.displayName = 'FacilityInfoStep';

// ============================================================
// STEP 2: SUBSCRIPTION & PAYMENT - Memoized
// ============================================================
const SubscriptionStep = React.memo(({ 
  selectedPlanId, 
  setSelectedPlanId, 
  billingPeriod, 
  setBillingPeriod, 
  selectedPaymentMethod, 
  setSelectedPaymentMethod, 
  plans, 
  paymentMethods 
}) => (
  <div className="space-y-4">
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Subscription plan
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {plans.map((p) => (
          <label
            key={p.id}
            className={`flex cursor-pointer flex-col rounded-lg border p-3 text-[13px] transition-all ${
              selectedPlanId == p.id
                ? 'border-[#C79A3D] bg-[#C79A3D]/5 ring-2 ring-[#C79A3D]/25'
                : 'border-[#1C2B27]/12 hover:border-[#1C2B27]/25'
            }`}
          >
            <input
              type="radio"
              name="plan_id"
              value={p.id}
              checked={selectedPlanId == p.id}
              onChange={() => setSelectedPlanId(p.id)}
              className="sr-only"
            />
            <span className="font-medium text-[#1C2B27]">{p.name}</span>
            <span className="mt-1 font-mono text-[15px] font-semibold text-[#C79A3D]">
              ₦{Number(p.price_monthly || 0).toLocaleString()}
              <span className="text-[11px] font-normal text-[#5C6D67]">/mo</span>
            </span>
          </label>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Billing period</span>
        <select
          value={billingPeriod}
          onChange={(e) => setBillingPeriod(e.target.value)}
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3 py-2.5 text-[13.5px] text-[#1C2B27] outline-none focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Payment method</span>
        <select
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          required
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3 py-2.5 text-[13.5px] text-[#1C2B27] outline-none focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        >
          <option value="">Select payment method</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>{method === 'paystack' ? 'Paystack' : method}</option>
          ))}
        </select>
      </label>
    </div>
  </div>
));

SubscriptionStep.displayName = 'SubscriptionStep';

// ============================================================
// STEP 3: ADMINISTRATOR ACCOUNT - Memoized
// ============================================================
const AdminStep = React.memo(({ 
  formData, 
  handleChange, 
  isFocused, 
  handleFocus, 
  handleBlur, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword 
}) => (
  <div className="space-y-3.5">
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div>
        <label htmlFor="adminFirstName" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          First name *
        </label>
        <div className="relative">
          <Icon name="User" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            isFocused.adminFirstName ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
          }`} />
          <input
            id="adminFirstName"
            name="adminFirstName"
            type="text"
            required
            value={formData.adminFirstName}
            onChange={handleChange}
            onFocus={() => handleFocus('adminFirstName')}
            onBlur={() => handleBlur('adminFirstName')}
            placeholder="First name"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
        </div>
      </div>

      <div>
        <label htmlFor="adminLastName" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Last name *
        </label>
        <div className="relative">
          <Icon name="User" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            isFocused.adminLastName ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
          }`} />
          <input
            id="adminLastName"
            name="adminLastName"
            type="text"
            required
            value={formData.adminLastName}
            onChange={handleChange}
            onFocus={() => handleFocus('adminLastName')}
            onBlur={() => handleBlur('adminLastName')}
            placeholder="Last name"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="adminEmail" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Administrator email *
      </label>
      <div className="relative">
        <Icon name="Mail" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
          isFocused.adminEmail ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
        }`} />
        <input
          id="adminEmail"
          name="adminEmail"
          type="email"
          required
          value={formData.adminEmail}
          onChange={handleChange}
          onFocus={() => handleFocus('adminEmail')}
          onBlur={() => handleBlur('adminEmail')}
          placeholder="admin@hospital.com"
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        />
      </div>
    </div>

    <div>
      <label htmlFor="adminPhone" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
        Administrator phone
      </label>
      <div className="relative">
        <Icon name="Phone" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
        <input
          id="adminPhone"
          name="adminPhone"
          type="tel"
          value={formData.adminPhone}
          onChange={handleChange}
          placeholder="+234 800 000 0000"
          className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      <div>
        <label htmlFor="password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Password *
        </label>
        <div className="relative">
          <Icon name="Lock" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            isFocused.password ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
          }`} />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            placeholder="Create a strong password"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#1C2B27]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-[11px] text-[#9AA6A0]">At least 8 characters with letters, numbers and a symbol.</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
          Confirm password *
        </label>
        <div className="relative">
          <Icon name="Lock" className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            isFocused.confirmPassword ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
          }`} />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={() => handleBlur('confirmPassword')}
            placeholder="Re-enter password"
            className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#1C2B27]"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
));

AdminStep.displayName = 'AdminStep';

// ============================================================
// MAIN SIGNUP COMPONENT
// ============================================================
const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = useMemo(() => ['Facility', 'Subscription', 'Administrator'], []);
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    facilityType: '',
    country: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    registrationNumber: '',
    taxId: '',
    website: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [signupState, setSignupState] = useState('form');
  const [plans, setPlans] = useState([]);
  const [countries, setCountries] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [signupResponse, setSignupResponse] = useState(null);
  const [isFocused, setIsFocused] = useState({});
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Live clock - optimized with useRef to prevent re-renders
  const clockIntervalRef = useRef(null);
  useEffect(() => {
    clockIntervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
      }
    };
  }, []);

  // Load config - optimized with abort controller
  useEffect(() => {
    const abortController = new AbortController();
    
    const loadConfig = async () => {
      try {
        const data = await apiRequest('/api/v1/tenants/public-config/', {
          method: 'GET',
          cacheTtl: 30000,
          signal: abortController.signal,
        });
        
        if (!data.allow_new_signups) {
          setSignupState('closed');
          setMessage('Self-service signups are currently closed. Please check back later or contact support.');
          setMessageType('error');
        } else {
          setPlans(data.subscription_plans || []);
          setCountries(data.countries || []);
          setFacilityTypes(data.facility_types || []);
          setPaymentMethods(data.payment_methods || []);
          setSelectedPaymentMethod(data.default_payment_method || (data.payment_methods || [])[0] || '');
          const defaultPlan = (data.subscription_plans || []).find((p) => p.is_default);
          if (defaultPlan) setSelectedPlanId(defaultPlan.id);
          const nigeria = (data.countries || []).find((c) => c.code === 'NG');
          if (nigeria) setFormData((f) => ({ ...f, country: nigeria.id }));
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMessage(`Unable to load signup details: ${err.message || 'Please try again.'}`);
          setMessageType('error');
          setSignupState('closed');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setConfigLoading(false);
        }
      }
    };
    
    loadConfig();
    
    return () => {
      abortController.abort();
    };
  }, []);

  // ============================================================
  // MEMOIZED HANDLERS
  // ============================================================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFocus = useCallback((field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleBlur = useCallback((field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  }, []);

  const handleNext = useCallback(() => {
    // Validate current step before proceeding
    if (currentStep === 0) {
      if (!formData.hospitalName || !formData.address || !formData.city || !formData.phone || !formData.email) {
        setMessage('Please fill in all required fields.');
        setMessageType('error');
        return;
      }
    } else if (currentStep === 1) {
      if (!selectedPlanId) {
        setMessage('Please select a subscription plan.');
        setMessageType('error');
        return;
      }
      if (!selectedPaymentMethod) {
        setMessage('Please select a payment method.');
        setMessageType('error');
        return;
      }
    }
    setMessage('');
    setMessageType('');
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [currentStep, formData, selectedPlanId, selectedPaymentMethod, steps.length]);

  const handlePrevious = useCallback(() => {
    setMessage('');
    setMessageType('');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }
    if (!formData.adminFirstName || !formData.adminLastName || !formData.adminEmail || !formData.password) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    const payload = {
      hospital_name: formData.hospitalName,
      facility_type: formData.facilityType ? parseInt(formData.facilityType, 10) : undefined,
      country: formData.country ? parseInt(formData.country, 10) : undefined,
      state: undefined,
      lga: undefined,
      address: formData.address,
      city: formData.city,
      email: formData.email,
      phone: formData.phone,
      registration_number: formData.registrationNumber,
      tax_id: formData.taxId,
      website: formData.website,
      plan_id: selectedPlanId ? parseInt(selectedPlanId, 10) : undefined,
      billing_period: billingPeriod,
      payment_method: selectedPaymentMethod,
      admin_first_name: formData.adminFirstName,
      admin_last_name: formData.adminLastName,
      admin_email: formData.adminEmail,
      admin_phone: formData.adminPhone,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    try {
      const data = await apiRequest('/api/v1/tenants/self-signup/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSignupResponse(data);
      setSignupState('verification');
      setMessage(
        data.verification_sent
          ? 'Account created! A verification email has been sent. Follow the link to activate your account.'
          : data.message || 'Account created. Please verify your email.'
      );
      setMessageType('success');
    } catch (err) {
      const message =
        err.status === 409
          ? 'An account with these details already exists. Try a different hospital name or email.'
          : err.message || 'Something went wrong. Please try again.';
      setMessage(message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [formData, selectedPlanId, billingPeriod, selectedPaymentMethod]);

  // ============================================================
  // MEMOIZED DATA
  // ============================================================
  const stats = useMemo(() => [
    { label: 'Hospitals', value: '500+', icon: 'Building2' },
    { label: 'Patients', value: '2M+', icon: 'Users' },
    { label: 'Daily encounters', value: '12K+', icon: 'Activity' },
    { label: 'Uptime', value: '99.99%', icon: 'Clock' }
  ], []);

  const clockLabel = useMemo(() => {
    return now.toLocaleTimeString('en-GB', { hour12: false });
  }, [now]);

  // ============================================================
  // RENDER
  // ============================================================
  if (configLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F6F2E7] flex items-center justify-center">
        <div className="text-[#16302A] font-mono text-sm tracking-wider">Loading signup…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F2E7] font-['Inter',system-ui,sans-serif] antialiased lg:flex">
      <style>{`
        @keyframes ecg-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-ecg-scroll {
          animation: ecg-scroll 6s linear infinite;
          will-change: transform;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2.2); opacity: 0; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.8s ease-out infinite;
          will-change: transform, opacity;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-in {
          animation: card-in 0.45s ease-out both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ecg-scroll,
          .animate-pulse-dot,
          .animate-card-in {
            animation: none !important;
          }
        }
      `}</style>

      {/* Brand / instrument panel */}
      <aside className="relative flex w-full flex-col justify-between overflow-hidden bg-[#0D1917] px-6 py-8 text-[#EFEBDD] sm:px-10 sm:py-10 lg:min-h-screen lg:w-[44%] lg:px-12 lg:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #EFEBDD 1px, transparent 1px), linear-gradient(to bottom, #EFEBDD 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="inline-flex rounded-lg border border-[#C79A3D]/40 bg-[#C79A3D]/10 p-2.5">
              <Icon name="ShieldCheck" className="h-5 w-5 text-[#C79A3D]" />
            </span>
            <span className="font-['Lora'] text-lg font-semibold tracking-tight text-[#F6F2E7]">
              SmartCare<span className="text-[#C79A3D]">HMS</span>
            </span>
          </Link>

          <EcgLine className="mt-6 h-10 text-[#C79A3D]/70 sm:mt-8 sm:h-12" />

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#C79A3D] sm:mt-8">
            Start your journey
          </p>
          <h1 className="mt-3 max-w-sm font-['Lora'] text-[28px] font-semibold leading-[1.15] text-[#F6F2E7] sm:text-[34px] lg:text-[36px]">
            Launch your hospital operations.
          </h1>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#A9C0B6] sm:text-sm">
            Set up your team, configure workflows, and start delivering
            precision care across Nigeria.
          </p>

          <dl className="mt-10 hidden grid-cols-2 gap-x-6 gap-y-6 sm:grid lg:mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-[#EFEBDD]/15 pl-3">
                <Icon name={stat.icon} className="h-4 w-4 text-[#A9C0B6]" />
                <dd className="mt-2 font-mono text-xl font-medium text-[#F6F2E7]">{stat.value}</dd>
                <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-[#EFEBDD]/10 pt-5 lg:mt-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Award" className="h-3.5 w-3.5" /> HIPAA-aligned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Globe" className="h-3.5 w-3.5" /> NDPR certified
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Icon name="ShieldCheck" className="h-3.5 w-3.5" /> ISO 27001
            </span>
          </div>
          <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="motion-safe:animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#C79A3D]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C79A3D]" />
            </span>
            {clockLabel}
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[560px] motion-safe:animate-card-in">
          <div className="rounded-2xl border border-[#1C2B27]/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(13,25,23,0.18)] sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C79A3D]">
              {signupState === 'verification' ? 'Complete payment' : `Step ${currentStep + 1} of ${steps.length}`}
            </p>
            <h2 className="mt-1.5 font-['Lora'] text-xl font-semibold leading-snug text-[#1C2B27] sm:text-[22px]">
              {signupState === 'verification' ? 'Check your email' : `Enter ${steps[currentStep].toLowerCase()} details`}
            </h2>
            <p className="mt-1.5 text-[13px] leading-snug text-[#5C6D67]">
              {signupState === 'verification'
                ? 'Your workspace and root administrator account will be created after payment is confirmed.'
                : `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]} information`}
            </p>

            {/* Progress Steps */}
            {signupState === 'form' && (
              <ProgressSteps currentStep={currentStep} steps={steps} />
            )}

            {/* Message Display */}
            {message && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${
                  messageType === 'success'
                    ? 'border-[#3E6E58]/30 bg-[#3E6E58]/10 text-[#2C5245]'
                    : 'border-[#A6372E]/30 bg-[#A6372E]/10 text-[#8A2E26]'
                }`}
              >
                {messageType === 'success' ? (
                  <Icon name="CheckCircle" className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
                ) : (
                  <Icon name="AlertCircle" className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            {signupState === 'closed' ? (
              <div className="mt-6 rounded-xl border border-[#A6372E]/30 bg-[#A6372E]/10 p-4 text-[13px] text-[#8A2E26]">
                {message}
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3E6E58] transition-colors hover:text-[#2C5245]"
                  >
                    <Icon name="ChevronLeft" className="h-3.5 w-3.5" />
                    Back to login
                  </Link>
                </div>
              </div>
            ) : signupState === 'verification' ? (
              <div className="mt-5 space-y-4">
                {signupResponse?.checkout?.authorization_url && (
                  <div className="rounded-xl border border-[#C79A3D]/40 bg-[#C79A3D]/10 p-4 text-[13px] text-[#5C4518]">
                    <p className="font-semibold text-[#3D3014]">Complete subscription payment</p>
                    <p className="mt-1">Complete payment with {signupResponse.checkout.gateway === 'paypal' ? 'PayPal' : 'Paystack'}. Your hospital workspace and root administrator account are created only after the provider confirms payment.</p>
                    <a
                      href={signupResponse.checkout.authorization_url}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] hover:bg-[#1C3B33]"
                    >
                      Pay {signupResponse.checkout.currency} {Number(signupResponse.checkout.amount).toLocaleString()}
                      <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
                <div className="rounded-xl border border-[#3E6E58]/30 bg-[#3E6E58]/10 p-4 text-[13px] text-[#2C5245]">
                  <p>After payment is confirmed, a verification email will be sent to <strong>{formData.adminEmail}</strong>.</p>
                  <p className="mt-1">You will not be able to sign in until both payment and email verification are complete.</p>
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center rounded-lg border border-[#1C2B27]/12 bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#1C2B27] transition-colors hover:bg-[#F6F2E7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2"
                  >
                    Return to login
                  </Link>
                  <Link
                    to="/verify-email"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2"
                  >
                    Payment is required first
                    <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form className="mt-5" onSubmit={handleSubmit}>
                {/* Step Content */}
                {currentStep === 0 && (
                  <FacilityInfoStep
                    formData={formData}
                    handleChange={handleChange}
                    isFocused={isFocused}
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                    facilityTypes={facilityTypes}
                    countries={countries}
                  />
                )}
                
                {currentStep === 1 && (
                  <SubscriptionStep
                    selectedPlanId={selectedPlanId}
                    setSelectedPlanId={setSelectedPlanId}
                    billingPeriod={billingPeriod}
                    setBillingPeriod={setBillingPeriod}
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    plans={plans}
                    paymentMethods={paymentMethods}
                  />
                )}
                
                {currentStep === 2 && (
                  <AdminStep
                    formData={formData}
                    handleChange={handleChange}
                    isFocused={isFocused}
                    handleFocus={handleFocus}
                    handleBlur={handleBlur}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 rounded-lg border border-[#1C2B27]/12 bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#1C2B27] transition-colors hover:bg-[#F6F2E7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2"
                    >
                      Back
                    </button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2"
                    >
                      Next
                      <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin text-[#F6F2E7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating account
                        </>
                      ) : (
                        <>
                          Create account
                          <Icon name="ArrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="mt-4 text-center text-[11px] leading-snug text-[#9AA6A0]">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}

            {signupState === 'form' && (
              <p className="mt-4 text-center text-[13px] text-[#5C6D67]">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-[#3E6E58] transition-colors hover:text-[#2C5245] hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>

          <p className="mt-5 text-center text-[11px] leading-snug text-[#9AA6A0]">
            Need help? Contact your system administrator
            <span className="mx-2 hidden sm:inline">&middot;</span>
            <span className="block sm:inline">&copy; {new Date().getFullYear()} SmartCare HMS</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;