'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  ClockIcon, 
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  LocationMarkerIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/LanguageProvider';
import { 
  branches, 
  getCurrentLocation, 
  findNearestBranch, 
  getBranchesByDistance,
  formatDistance,
  isBranchOpen,
  type Branch,
  type UserLocation
} from '../utils/geolocation';

interface BranchSelectorProps {
  selectedBranch?: string;
  onBranchSelect: (branchId: string) => void;
  showNearest?: boolean;
  className?: string;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  selectedBranch,
  onBranchSelect,
  showNearest = true,
  className = ''
}) => {
  const { t, isRTL } = useLanguage();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [sortedBranches, setSortedBranches] = useState<Branch[]>(branches);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user location and find nearest branch
  useEffect(() => {
    if (showNearest) {
      getLocationAndFindNearest();
    }
  }, [showNearest]);

  const getLocationAndFindNearest = async () => {
    setIsLoading(true);
    setLocationError(null);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      const nearest = findNearestBranch(location);
      setNearestBranch(nearest);

      const sorted = getBranchesByDistance(location);
      setSortedBranches(sorted);

      // Auto-select nearest branch if no branch is selected
      if (!selectedBranch && nearest) {
        onBranchSelect(nearest.id);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('فشل في الحصول على الموقع');
      setSortedBranches(branches);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBranchSelect = (branchId: string) => {
    onBranchSelect(branchId);
  };

  const getBranchStatus = (branch: Branch) => {
    const isOpen = isBranchOpen(branch);
    return {
      isOpen,
      statusText: isOpen ? 'مفتوح الآن' : 'مغلق',
      statusColor: isOpen ? 'text-green-600' : 'text-red-600',
      statusIcon: isOpen ? CheckCircleIcon : XCircleIcon
    };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-arabic">
          {t('branches.title')}
        </h3>
        {showNearest && (
          <button
            onClick={getLocationAndFindNearest}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-sakura-50 text-white rounded-lg hover:bg-sakura-100 transition-colors disabled:opacity-50"
          >
            <LocationMarkerIcon className="w-4 h-4" />
            {isLoading ? 'جاري البحث...' : 'البحث عن أقرب فرع'}
          </button>
        )}
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-arabic">
            {locationError}
          </p>
        </div>
      )}

      {/* Nearest Branch Highlight */}
      {nearestBranch && showNearest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-sakura-50/10 to-deep-50/10 border border-sakura-50/20 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-sakura-50 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sakura-50 font-arabic">
                أقرب فرع لك
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDistance(
                  calculateDistance(
                    userLocation!.lat,
                    userLocation!.lng,
                    nearestBranch.coordinates.lat,
                    nearestBranch.coordinates.lng
                  )
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Branches List */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedBranches.map((branch, index) => {
            const status = getBranchStatus(branch);
            const StatusIcon = status.statusIcon;
            const isSelected = selectedBranch === branch.id;
            const distance = userLocation ? 
              formatDistance(
                calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  branch.coordinates.lat,
                  branch.coordinates.lng
                )
              ) : null;

            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected
                    ? 'border-sakura-50 bg-sakura-50/10 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-sakura-50/50'
                }`}
                onClick={() => handleBranchSelect(branch.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-white font-arabic">
                        {isRTL ? branch.nameAr : branch.name}
                      </h4>
                      {isSelected && (
                        <div className="w-5 h-5 bg-sakura-50 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="font-arabic">{branch.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{branch.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span className="font-arabic">
                          {branch.workingHours.open} - {branch.workingHours.close}
                        </span>
                        <StatusIcon className={`w-4 h-4 ${status.statusColor}`} />
                        <span className={`font-arabic ${status.statusColor}`}>
                          {status.statusText}
                        </span>
                      </div>

                      {distance && (
                        <div className="flex items-center gap-2">
                          <LocationMarkerIcon className="w-4 h-4" />
                          <span className="font-arabic">{distance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No branches message */}
      {sortedBranches.length === 0 && (
        <div className="text-center py-8">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            لا توجد فروع متاحة حالياً
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate distance (duplicated from utils for component use)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

export default BranchSelector;
