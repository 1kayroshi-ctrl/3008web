import React, { useState, useEffect, useRef } from "react";

// ============================================
// TYPES
// ============================================
interface Section {
  id: string;
  label: string;
}

interface RentalModule {
  id: string;
  name: string;
  subtitle: string;
  flowGpm: string;
  tons: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  features: string[];
}

type RentalDuration = "daily" | "weekly" | "monthly";

interface CartItem {
  id: string;
  moduleId: string;
  moduleName: string;
  duration: RentalDuration;
  rate: number;
  quantity: number;
}

// ============================================
// ICONS (Industrial SVG set)
// ============================================
const Icons = {
  Calendar: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  ),
  Truck: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.22-1.113-.615-1.53a15.04 15.04 0 00-2.084-1.765 2.25 2.25 0 00-1.301-.42H5.25a2.25 2.25 0 00-2.25 2.25v7.5"
      />
    </svg>
  ),
  Clipboard: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 15h.008v.008H6.75V15zm0 3h.008v.008H6.75V18zm0-6h.008v.008H6.75V12z"
      />
    </svg>
  ),
  Calculator: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm6-6.75h.008v.008h-.008V9.75zm0 2.25h.008v.008h-.008V12zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm-9 3.75h10.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H9.75A2.25 2.25 0 007.5 6v12a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  ),
  Document: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  ),
  Phone: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  ),
  Exclamation: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  ),
  Cart: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  Minus: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 12H4"
      />
    </svg>
  ),
};

// ============================================
// REUSABLE COMPONENTS
// ============================================
function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=="
          alt="Error loading image"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`border border-gray-200 bg-white transition-all duration-200 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const Section: React.FC<{
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, title, children, className = "" }) => (
  <section
    id={id}
    className={`py-16 md:py-20 border-b border-gray-200 last:border-b-0 ${className}`}
  >
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-10 md:mb-12 border-l-4 border-gray-700 pl-5">
        {title}
      </h2>
      {children}
    </div>
  </section>
);

// Format currency
const formatUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// ============================================
// STICKY SIDE NAVIGATION
// ============================================
const SideNav: React.FC<{
  sections: Section[];
  activeSection: string;
}> = ({ sections, activeSection }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40 w-48">
      <div className="border-l border-gray-300 pl-5 space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block text-left text-sm font-medium transition-all duration-200 hover:text-gray-900 ${
              activeSection === section.id
                ? "text-gray-900 border-l-2 border-gray-900 -ml-[1.125rem] pl-4"
                : "text-gray-500"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ============================================
// CART SIDEBAR
// ============================================
interface CartSidebarProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isOpen,
  onClose,
}) => {
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.rate * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 350 : 0;
  const total = subtotal + deliveryFee;

  const durationLabels: Record<RentalDuration, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50 shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Icons.Cart />
              <h2 className="text-xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <span className="bg-gray-900 text-white text-xs px-2 py-0.5 ml-2">
                {totalItems} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Icons.Cart />
                <p className="mt-2">Your cart is empty</p>
                <p className="text-sm">
                  Add rental modules to get started
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {item.moduleName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {durationLabels[item.duration]} rental •{" "}
                        {formatUSD(item.rate)}/day equivalent
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Icons.Minus />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        <Icons.Plus />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatUSD(item.rate * item.quantity)}
                      </div>
                      <div className="text-xs text-gray-400">
                        @ {formatUSD(item.rate)} each
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    {formatUSD(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Delivery & Setup (estimate)
                  </span>
                  <span className="font-medium">
                    {formatUSD(deliveryFee)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatUSD(total)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    *Excludes taxes & permits
                  </p>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-gray-900 text-white py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Proceed to Quote Request
              </button>
              <p className="text-xs text-gray-400 text-center">
                Delivery timeline: 24–48 hours after
                confirmation
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================
// RENTAL MODULE CARD (with add to cart)
// ============================================
interface RentalModuleCardProps {
  module: RentalModule;
  onAddToCart: (
    module: RentalModule,
    duration: RentalDuration,
  ) => void;
}

const RentalModuleCard: React.FC<RentalModuleCardProps> = ({
  module,
  onAddToCart,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDuration, setSelectedDuration] =
    useState<RentalDuration>("daily");

  const getRateForDuration = (
    duration: RentalDuration,
  ): number => {
    switch (duration) {
      case "daily":
        return module.dailyRate;
      case "weekly":
        return module.weeklyRate;
      case "monthly":
        return module.monthlyRate;
      default:
        return module.dailyRate;
    }
  };

  const durationOptions: {
    value: RentalDuration;
    label: string;
    multiplier: string;
  }[] = [
    {
      value: "daily",
      label: "Daily",
      multiplier: "(min 3 days)",
    },
    {
      value: "weekly",
      label: "Weekly",
      multiplier: "(7 days)",
    },
    {
      value: "monthly",
      label: "Monthly",
      multiplier: "(30 days)",
    },
  ];

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {module.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {module.subtitle}
            </p>
            <div className="flex gap-3 mt-2 text-xs font-mono text-gray-600">
              <span>{module.flowGpm} GPM</span>
              <span>•</span>
              <span>{module.tons} Tons</span>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-300 px-3 py-1"
          >
            {showDetails ? "Hide specs" : "View specs"}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Key Features
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {module.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Icons.Check /> {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* Duration selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Rental Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDuration(opt.value)}
                className={`py-2 text-sm font-medium border transition-all ${
                  selectedDuration === opt.value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {opt.label}
                <span className="block text-xs opacity-75">
                  {opt.multiplier}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rate display */}
        <div className="mb-4 text-center py-3 bg-gray-50">
          <div className="text-xs text-gray-500 uppercase">
            Rate for selected duration
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatUSD(getRateForDuration(selectedDuration))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedDuration === "daily" &&
              "per day (3-day minimum)"}
            {selectedDuration === "weekly" && "per week"}
            {selectedDuration === "monthly" && "per month"}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(module, selectedDuration)}
          className="w-full bg-gray-900 text-white py-2.5 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-auto"
        >
          <Icons.Cart /> Add to Cart
        </button>
        <div className="text-xs text-gray-400 text-center mt-3">
          * Delivery & setup quoted separately
        </div>
      </div>
    </Card>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================
const RentalCoolingTowersPage: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<string>("hero");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const sectionRefs = useRef<
    Record<string, HTMLElement | null>
  >({});

  const sections: Section[] = [
    { id: "hero", label: "Overview" },
    { id: "modules", label: "Rental Modules" },
    { id: "calculator", label: "Tonnage Calculator" },
    { id: "responsibilities", label: "Requirements" },
    { id: "cta", label: "Contact" },
  ];

  // Rental modules data
  const rentalModules: RentalModule[] = [
    {
      id: "mod1",
      name: "Module 1 – Extra Duty",
      subtitle: "Compact, rapid deployment",
      flowGpm: "Up to 3,000",
      tons: "1,000",
      dailyRate: 1419.0,
      weeklyRate: 5225.0,
      monthlyRate: 15950.0,
      features: [
        "Single-point electrical connection",
        "Galvanized steel construction",
        "Axial fans with sound attenuation",
        "Corrosion-resistant fill",
      ],
    },
    {
      id: "mod2",
      name: "Module 2 – Super Duty",
      subtitle: "Industrial mid-range",
      flowGpm: "Up to 6,000",
      tons: "2,000",
      dailyRate: 2365.0,
      weeklyRate: 13508.0,
      monthlyRate: 32835.0,
      features: [
        "Dual-cell configuration",
        "Stainless steel basins",
        "Variable frequency drives",
        "Remote monitoring ready",
      ],
    },
    {
      id: "mod3",
      name: "Module 3 – Maximum Duty",
      subtitle: "High-capacity parallel systems",
      flowGpm: "Up to 9,000",
      tons: "3,000",
      dailyRate: 4378.0,
      weeklyRate: 19580.0,
      monthlyRate: 46750.0,
      features: [
        "Modular multi-cell array",
        "Heavy-duty fan shafts",
        "Plume abatement option",
        "Seismic-rated frame",
      ],
    },
  ];

  // Customer responsibilities
  const responsibilities = [
    "Delivery/Pickup standby time at $85.00 per hour during delays",
    "Obtaining any relevant operating permits",
    "State and local taxes (tax-exempt certificate can be supplied)",
    "Any and all required union labor",
    "Full replacement insurance on equipment (certificate required prior to delivery)",
    "All lifting/off-loading of equipment",
  ];

  // Cart functions
  const addToCart = (
    module: RentalModule,
    duration: RentalDuration,
  ) => {
    const rate = (() => {
      switch (duration) {
        case "daily":
          return module.dailyRate;
        case "weekly":
          return module.weeklyRate;
        case "monthly":
          return module.monthlyRate;
      }
    })();

    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.moduleId === module.id &&
        item.duration === duration,
    );

    if (existingItemIndex >= 0) {
      // Increment quantity if same module and duration
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${module.id}-${duration}-${Date.now()}`,
        moduleId: module.id,
        moduleName: module.name,
        duration,
        rate,
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    alert(
      `Quote request submitted for ${cartItems.length} item(s). Total: ${formatUSD(cartItems.reduce((sum, i) => sum + i.rate * i.quantity, 0) + 350)}\n\nA rental specialist will contact you within 1 hour.`,
    );
    // In production: open modal or redirect to quote form
  };

  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        sectionRefs.current[section.id] = element;
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleCalculatorClick = () => {
    alert(
      "Tonnage calculator: Enter flow rate (GPM), hot water temp, cold water temp, and wet bulb.",
    );
  };

  return (
    <div
      className="bg-white text-gray-900 font-sans antialiased"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Header with Cart Icon */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-gray-900">
            COOLING TOWER DEPOT®
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-gray-600">
              Rentals
            </a>
            <a href="#" className="hover:text-gray-600">
              New Towers
            </a>
            <a href="#" className="hover:text-gray-600">
              Parts
            </a>
            <a href="#" className="hover:text-gray-600">
              Services
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm bg-gray-100 px-3 py-1.5 rounded-none flex items-center gap-2">
              <Icons.Phone /> 1-877-243-3945
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 transition-colors"
            >
              <Icons.Cart />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <SideNav
        sections={sections}
        activeSection={activeSection}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <main className="relative">
        {/* ===== HERO SECTION ===== */}
        <section id="hero" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-sm font-mono text-gray-500 mb-3 tracking-wider">
                  TEMPORARY COOLING SOLUTIONS
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                  Rental Cooling Towers
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Emergency response, planned outages, seasonal
                  peaks — deploy industrial-grade cooling
                  capacity within 24–48 hours. No capital
                  expenditure, full service support.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-gray-900 text-white px-6 py-3 font-medium border border-gray-900 hover:bg-gray-800 transition-colors">
                    Emergency Rental Quote
                  </button>
                  <button className="bg-white text-gray-900 px-6 py-3 font-medium border border-gray-300 hover:border-gray-900 transition-colors">
                    View Fleet Specs
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 h-64 flex items-center justify-center border border-gray-200">
                <ImageWithFallback
                  src="https://www.coolingtowerdepot.com/images/module_2a-photo-1.jpg"
                  alt="Rental fleet ready for deployment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== RENTAL MODULES (with add to cart) ===== */}
        <Section id="modules" title="Rental Modules & Pricing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalModules.map((module) => (
              <RentalModuleCard
                key={module.id}
                module={module}
                onAddToCart={addToCart}
              />
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              All modules include: 24/7 technical support •
              Delivery available nationwide • NEMA 4X control
              panel
            </p>
          </div>
        </Section>

        {/* ===== TONNAGE CALCULATOR ===== */}
        <Section
          id="calculator"
          title="Tonnage & Module Selector"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Don't know your required cooling tons? Enter
                your flow rate and operating conditions — our
                proprietary selector instantly recommends the
                right rental module.
              </p>
              <div className="border border-gray-200 p-5 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Flow Rate (GPM)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 2500"
                      className="w-full border border-gray-300 px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Hot Water °F
                      </label>
                      <input
                        type="number"
                        placeholder="95"
                        className="w-full border border-gray-300 px-3 py-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                        Cold Water °F
                      </label>
                      <input
                        type="number"
                        placeholder="85"
                        className="w-full border border-gray-300 px-3 py-2 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCalculatorClick}
                    className="w-full bg-gray-800 text-white py-2 font-medium hover:bg-gray-700"
                  >
                    Calculate Required Tons
                  </button>
                </div>
              </div>
            </div>
            <div className="border-l border-gray-200 pl-8">
              <div className="flex items-start gap-4">
                <div className="text-gray-700">
                  <Icons.Calculator />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Quick Sizing Guide
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • Module 1: Up to 3,000 GPM / 1,000 tons
                    </li>
                    <li>
                      {" "}
                      Module 2: 3,001–6,000 GPM / 2,000 tons
                    </li>
                    <li>
                      • Module 3: 6,001–9,000 GPM / 3,000 tons
                    </li>
                    <li className="pt-2 text-gray-500 text-xs">
                      Parallel configurations available for
                      higher capacities
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== CUSTOMER RESPONSIBILITIES ===== */}
        <Section
          id="responsibilities"
          title="Customer Responsibilities & Terms"
        >
          <div className="grid md:grid-cols-2 gap-10">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Clipboard />
                <h3 className="font-bold text-lg">
                  Required by Renter
                </h3>
              </div>
              <ul className="space-y-3">
                {responsibilities.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-gray-400 mt-0.5">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Document />
                <h3 className="font-bold text-lg">
                  Included in Rental
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">•</span>{" "}
                  Cooling tower module(s) as selected
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">•</span>{" "}
                  Interconnecting piping & valves
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">•</span>{" "}
                  Factory startup technician (first 8 hours)
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">•</span>{" "}
                  Operation & maintenance manuals
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-400">•</span> 24/7
                  phone support
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <p>
                  All rentals subject to Cooling Tower Depot®
                  Terms and Conditions, Form No. 114.
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* ===== CTA SECTION ===== */}
        <section
          id="cta"
          className="py-20 bg-gray-50 border-t border-gray-200"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Need emergency cooling capacity?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Same-day quotes • 24/7 dispatch • Delivery in as
              little as 24 hours
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gray-900 text-white px-8 py-3 font-medium border border-gray-900 hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                <Icons.Phone /> Call for Emergency Rental
              </button>
              <button className="bg-white text-gray-900 px-8 py-3 font-medium border border-gray-300 hover:border-gray-900 transition-colors inline-flex items-center gap-2">
                <Icons.Document /> Download Rental Spec Sheet
              </button>
            </div>
            <div className="mt-10 text-sm text-gray-500 bg-white inline-block px-6 py-3 border border-gray-200">
              <span className="font-mono font-bold">
                24/7 Hotline: 1-877-243-3945
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>
            © 2025 Cooling Tower Depot®. Rental towers for
            industrial, commercial & emergency applications.
          </p>
          <p className="mt-2">
            Modules • Accessories • Field Service • Engineering
            Support
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RentalCoolingTowersPage;
