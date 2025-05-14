"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ChevronLeft,
  Clock,
  Search,
  Store,
  Home,
  Check,
  MapPinOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/nav-bar"; // Assuming this exists
import { cn } from "@/lib/utils"; // Assuming this exists
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

// Mock merchant data
const MERCHANTS = [
  {
    id: 1,
    name: "Print Master Shop",
    address: "123 Main St, New York, NY 10001",
    rating: 4.8,
    reviews: 123,
    delivery: "Same day",
    services: [
      "Poster Printing",
      "Photo Books",
      "Business Cards",
      "Document Printing",
    ],
    coordinates: { lat: 40.7128, lng: -74.006 },
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 2,
    name: "Quality Print Solutions",
    address: "555 Lexington Ave, New York, NY 10017",
    rating: 4.9,
    reviews: 500,
    delivery: "Same day",
    services: [
      "Poster Printing",
      "Photo Books",
      "Business Cards",
      "Document Printing",
    ],
    coordinates: { lat: 40.7168, lng: -73.9861 },
    image: "/placeholder.svg?height=150&width=300",
  },
  {
    id: 3,
    name: "Quick Print Services",
    address: "789 Fifth Ave, New York, NY 10003",
    rating: 3.5,
    reviews: 56,
    delivery: "Next Day",
    services: [
      "Poster Printing",
      "Photo Books",
      "Business Cards",
      "Document Printing",
    ],
    coordinates: { lat: 40.7308, lng: -73.9973 },
    image: "/placeholder.svg?height=150&width=300",
  },
];

type DeliveryOption = "pickup" | "delivery";
type LocationPermissionStatus =
  | "prompt"
  | "granted"
  | "denied"
  | "unsupported"
  | "loading";

declare global {
  interface Window {
    google: any;
  }
}

export default function LocationSelectionPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<number | null>(null);
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>("pickup");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<LocationPermissionStatus>("loading"); // Start as loading
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [nearbyMerchants, setNearbyMerchants] = useState(MERCHANTS); // Initial state can be empty or default
  const [isLoadingMerchants, setIsLoadingMerchants] = useState(true); // Start as loading

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Filter merchants based on search query
  const filteredMerchants = nearbyMerchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get user's location (this function now always attempts to get location)
  const getUserLocation = () => {
    setLocationPermission("loading"); // Set loading state before attempting
    setIsLoadingMerchants(true); // Indicate merchants are loading

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userCoords);
        setLocationPermission("granted");

        // In a real app, you would fetch nearby merchants based on location
        // For now, we'll simulate a delay and use our mock data
        setTimeout(() => {
          setNearbyMerchants(MERCHANTS); // Use mock data for simulation
          setIsLoadingMerchants(false);

          // Update map to show user location if map is already loaded
          if (mapLoaded && googleMapRef.current) {
            updateUserLocationOnMap(userCoords);
          }
        }, 1000);
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPermission("denied");
        } else {
          // Handle other potential errors like position unavailable
          setLocationPermission("denied"); // Or a new 'error' state
        }
        setIsLoadingMerchants(false); // Stop loading on error
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  // Check geolocation support and permission on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationPermission("unsupported");
      setIsLoadingMerchants(false); // Stop loading if unsupported
      setNearbyMerchants(MERCHANTS); // Show all merchants if unsupported
      return;
    }

    // Use Permissions API if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          setLocationPermission(
            permissionStatus.state as LocationPermissionStatus,
          );

          // --- MODIFICATION START ---
          // If permission is granted or prompt, attempt to get location
          if (
            permissionStatus.state === "granted" ||
            permissionStatus.state === "prompt"
          ) {
            // We call getUserLocation here, which handles setting loading states internally
            getUserLocation();
          } else {
            // If permission is denied or any other state where we can't prompt automatically
            setIsLoadingMerchants(false); // Stop loading if we aren't requesting location
            // Optionally, load default merchants or based on a fallback location
            setNearbyMerchants(MERCHANTS); // Example: load all merchants
          }
          // --- MODIFICATION END ---

          // Listen for permission changes
          permissionStatus.onchange = () => {
            setLocationPermission(
              permissionStatus.state as LocationPermissionStatus,
            );
            if (permissionStatus.state === "granted") {
              getUserLocation(); // Get location if permission is granted later
            } else if (permissionStatus.state === "denied") {
              setIsLoadingMerchants(false); // Stop loading if permission becomes denied
              setNearbyMerchants(MERCHANTS); // Example: load all merchants
              setUserLocation(null); // Clear user location
            }
          };
        })
        .catch(() => {
          // If permissions API fails, fallback to direct call (which prompts)
          console.warn(
            "Permissions API failed, falling back to direct geolocation.",
          );
          getUserLocation();
        });
    } else {
      // Fallback for browsers that don't support permissions API - direct call will prompt
      getUserLocation();
    }
  }, []); // Empty dependency array means this runs once on mount

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      // Ensure YOUR_API_KEY is replaced or environment variable is set
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []); // Empty dependency array means this runs once on mount

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current) return;

    // Default to New York City coordinates or a placeholder
    const defaultCenter = { lat: 40.7128, lng: -74.006 };
    // Use user location as center if available, otherwise default
    const initialCenter = userLocation || defaultCenter;

    const mapOptions: google.maps.MapOptions = {
      center: initialCenter,
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
    };

    // Create new map
    if (window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      googleMapRef.current = map;

      // Clear existing markers (important if initializeMap is called multiple times)
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = []; // Clear the array

      // Add markers for each merchant
      // Use nearbyMerchants instead of static MERCHANTS if you implement location-based filtering later
      (userLocation ? nearbyMerchants : MERCHANTS).forEach((merchant) => {
        // Example: show nearby if location available, else all
        const marker = new window.google.maps.Marker({
          position: merchant.coordinates,
          map,
          title: merchant.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06044b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3" fill="#61e987"></circle>
                </svg>,
              ),
            scaledSize: new google.maps.Size(36, 36),
          },
        });

        // Add click event to marker
        marker.addListener("click", () => {
          setSelectedMerchant(merchant.id);

          // Scroll to the merchant in the list
          const element = document.getElementById(`merchant-${merchant.id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });

        markersRef.current.push(marker);
      });

      setMapLoaded(true);

      // If we already have user location, update the map
      if (userLocation) {
        updateUserLocationOnMap(userLocation);
      }
    }
  };

  // Update user location on map whenever userLocation state changes
  useEffect(() => {
    if (mapLoaded && googleMapRef.current && userLocation) {
      updateUserLocationOnMap(userLocation);
    } else if (
      mapLoaded &&
      googleMapRef.current &&
      !userLocation &&
      userMarkerRef.current
    ) {
      // Remove user marker if user location becomes null
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    // Center map on default if map is loaded and no user location
    if (mapLoaded && googleMapRef.current && !userLocation) {
      const defaultCenter = { lat: 40.7128, lng: -74.006 };
      googleMapRef.current.panTo(defaultCenter);
      googleMapRef.current.setZoom(12); // Maybe zoom out a bit for a wider view
    }
  }, [userLocation, mapLoaded]);

  // Update user location on map utility function
  const updateUserLocationOnMap = (location: { lat: number; lng: number }) => {
    if (!googleMapRef.current) return;

    // Center map on user location
    googleMapRef.current.panTo(location);
    // Only zoom in if zoom is less than 14, to avoid jarring jumps
    if (googleMapRef.current.getZoom() < 14) {
      googleMapRef.current.setZoom(14);
    }

    // Add or update user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(location);
      userMarkerRef.current.setMap(googleMapRef.current); // Ensure marker is visible
    } else {
      userMarkerRef.current = new window.google.maps.Marker({
        position: location,
        map: googleMapRef.current,
        title: "Your Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#06044b"
                stroke="#ffffff"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="#61e987"
                  stroke="#06044b"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="3" fill="#ffffff" />
              </svg>,
            ),
          scaledSize: new google.maps.Size(24, 24),
        },
        zIndex: 1000, // Ensure user marker is on top
      });
    }
  };

  // Update map when selected merchant changes
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded) return;

    // Center map on selected merchant if one is selected
    if (selectedMerchant) {
      const merchant = MERCHANTS.find((m) => m.id === selectedMerchant);
      if (merchant) {
        googleMapRef.current.panTo(merchant.coordinates);
        googleMapRef.current.setZoom(15);
      }
    } else {
      // If no merchant is selected, center back on user location or default
      const center = userLocation || { lat: 40.7128, lng: -74.006 };
      googleMapRef.current.panTo(center);
      googleMapRef.current.setZoom(userLocation ? 14 : 12);
    }
  }, [selectedMerchant, mapLoaded, userLocation]); // Added userLocation dependency

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? "text-yellow-400"
                : star - 0.5 <= rating // Handle half stars
                  ? "text-yellow-400"
                  : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-500">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Render location permission message
  const renderLocationPermissionMessage = () => {
    // Don't show message if permission is granted and we have a location
    if (locationPermission === "granted" && userLocation) return null;

    if (locationPermission === "denied") {
      return (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <MapPinOff className="h-5 w-5 text-yellow-600 mr-2" />
            <AlertDescription className="text-yellow-700">
              Location access denied. Please enable location services in your
              browser settings to see nearby merchants.
            </AlertDescription>
          </div>
          {/* This button is only shown if permission was denied */}
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            onClick={getUserLocation} // Use getUserLocation directly
          >
            Try Again
          </Button>
        </Alert>
      );
    }

    if (
      locationPermission === "loading" ||
      (locationPermission === "prompt" && isLoadingMerchants)
    ) {
      // Show loading when trying to get location, or when prompt state is active and we're loading
      return (
        <Alert className="mb-4 bg-[#f0fdf4] border-[#90f0ab]">
          <div className="flex items-center">
            {isLoadingMerchants ? (
              <Loader2 className="h-5 w-5 text-[#06044b] mr-2 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5 text-[#06044b] mr-2" />
            )}
            <AlertDescription>
              {isLoadingMerchants
                ? "Fetching your location..."
                : "Please allow location access to find printing locations near you."}
            </AlertDescription>
          </div>
          {/* No button needed here, as the prompt is triggered by getUserLocation already */}
        </Alert>
      );
    }

    if (locationPermission === "unsupported") {
      return (
        <Alert className="mb-4 bg-gray-50 border-gray-200">
          <AlertDescription>
            Your browser doesn't support geolocation. We're showing all
            available merchants.
          </AlertDescription>
        </Alert>
      );
    }

    // If permission is prompt but not loading, show a static message (optional, depends on UX)
    if (locationPermission === "prompt" && !isLoadingMerchants) {
      return (
        <Alert className="mb-4 bg-[#f0fdf4] border-[#90f0ab]">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-[#06044b] mr-2" />
            <AlertDescription>
              Awaiting your location permission. Please check your browser
              prompt.
            </AlertDescription>
          </div>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#dffbe7] flex flex-col">
      {/* Assuming NavBar is meant to be here */}
      {/* <NavBar /> */}
      <div className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="max-w-3xl w-full text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Print Your Documents with
            <span className="block text-[#61e987]">Printable</span>
          </h1>
          <p className="text-center max-w-xl mx-auto">
            Seamlessly upload your files, customize your print job, and have it
            delivered or ready for pickup
          </p>
        </div>

        {/* Process Steps */}
        <div className="flex justify-center items-center w-full max-w-2xl mb-12 overflow-x-auto py-4">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#61e987] flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">
              Upload Document
            </span>
          </div>
          <div className="h-[2px] w-16 bg-[#61e987] flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#61e987] flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">
              Print Options
            </span>
          </div>
          <div className="h-[2px] w-16 bg-[#61e987] flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <MapPin className="h-6 w-6 text-[#06044b]" />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">
              Select Location
            </span>
          </div>
          <div className="h-[2px] w-16 bg-[#e6e6ed] flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="18"
                  height="14"
                  x="3"
                  y="5"
                  rx="2"
                  stroke="#06044b"
                  strokeWidth="2"
                />
                <path d="M3 10H21" stroke="#06044b" strokeWidth="2" />
                <path
                  d="M7 15H13"
                  stroke="#06044b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">Review & Pay</span>
          </div>
        </div>

        {/* Location Selection Card */}
        <div className="bg-white rounded-xl p-8 w-full max-w-2xl border border-[#90f0ab] mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mr-4">
              <MapPin className="h-6 w-6 text-[#06044b]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Location Selection</h2>
              <p className="text-sm text-[#555555]">
                Choose a merchant and delivery option
              </p>
            </div>
          </div>

          {/* Location Permission Message */}
          {renderLocationPermissionMessage()}

          {/* Delivery Options Toggle */}
          <div className="bg-[#f0fdf4] rounded-full p-1 flex mb-6">
            <button
              className={cn(
                "flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-colors",
                deliveryOption === "pickup"
                  ? "bg-white text-[#06044b] shadow-sm"
                  : "text-[#555555] hover:text-[#06044b]",
              )}
              onClick={() => setDeliveryOption("pickup")}
            >
              <Store className="h-4 w-4" />
              <span>Store Pickup</span>
            </button>
            <button
              className={cn(
                "flex-1 py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-colors",
                deliveryOption === "delivery"
                  ? "bg-white text-[#06044b] shadow-sm"
                  : "text-[#555555] hover:text-[#06044b]",
              )}
              onClick={() => setDeliveryOption("delivery")}
            >
              <Home className="h-4 w-4" />
              <span>Home delivery</span>
            </button>
          </div>

          <h3 className="font-medium mb-3">Select Printing Location</h3>

          {/* Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, address or specialty"
              className="pl-10 pr-4 py-2 bg-[#f0fdf4] text-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#61e987] border-[#e0e0e0]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Map */}
          <div
            ref={mapRef}
            className="w-full h-[200px] rounded-lg mb-4 bg-gray-100 overflow-hidden"
          ></div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Merchant List */}
          <div className="space-y-4">
            {isLoadingMerchants &&
            !userLocation &&
            locationPermission !== "unsupported" ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-[#61e987] animate-spin mb-4" />
                <p className="text-[#06044b]">Finding merchants near you...</p>
                <p className="text-sm text-gray-500 mt-1">
                  This may take a moment
                </p>
              </div>
            ) : filteredMerchants.length > 0 ? (
              filteredMerchants.map((merchant) => (
                <div
                  key={merchant.id}
                  id={`merchant-${merchant.id}`}
                  className={cn(
                    "border rounded-lg overflow-hidden transition-all",
                    selectedMerchant === merchant.id
                      ? "border-[#61e987] bg-[#f0fdf4]"
                      : "border-gray-200 hover:border-[#90f0ab]",
                  )}
                >
                  <div
                    className="flex cursor-pointer p-4"
                    onClick={() => setSelectedMerchant(merchant.id)}
                  >
                    {/* Merchant Image */}
                    <div className="w-24 h-20 rounded overflow-hidden mr-4 flex-shrink-0">
                      <img
                        src={merchant.image || "/placeholder.svg"}
                        alt={merchant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Merchant Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-[#06044b]">
                          {merchant.name}
                        </h4>
                        <div className="w-5 h-5 rounded-full border-2 border-[#06044b] flex-shrink-0 flex items-center justify-center">
                          {selectedMerchant === merchant.id && (
                            <div className="w-3 h-3 rounded-full bg-[#06044b]"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {merchant.address}
                      </p>
                      <div className="flex items-center mb-1">
                        {renderStars(merchant.rating)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({merchant.reviews})
                        </span>
                        <div className="flex items-center ml-3 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{merchant.delivery}</span>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {merchant.services.map((service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MapPinOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  No merchants found matching your search.
                </p>
                {/* Optionally show all merchants if location failed/denied */}
                {locationPermission !== "granted" &&
                  !isLoadingMerchants &&
                  MERCHANTS.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Showing all available merchants instead.
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            className="w-full mt-6 bg-[#61e987] hover:bg-[#61e987]/90 text-[#06044b] font-medium"
            disabled={!selectedMerchant || isLoadingMerchants}
          >
            Confirm Selection
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full max-w-2xl">
          <Link href="/print-options">
            {" "}
            {/* Replace with actual previous page */}
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#d0d0d0] text-[#555555]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          {/* Replace with actual next page */}
          <Link
            href={
              selectedMerchant
                ? `/checkout?merchant=${selectedMerchant}&option=${deliveryOption}`
                : "#"
            }
          >
            <Button
              className="bg-[#06044b] hover:bg-[#06044b]/90 text-white px-6 uppercase text-xs font-semibold tracking-wider"
              disabled={!selectedMerchant || isLoadingMerchants}
            >
              Continue To Payment
            </Button>
          </Link>
        </div>
      </div>
      {/* Assuming NavBar is meant to be here or a footer */}
      {/* <NavBar /> */}
    </div>
  );
}
