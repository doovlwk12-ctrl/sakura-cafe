// Geolocation utilities for branch detection
export interface Branch {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  workingHours: {
    open: string;
    close: string;
  };
  isOpen: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Branch data with coordinates
export const branches: Branch[] = [
  {
    id: 'branch-001',
    name: 'Sadiyan Branch',
    nameAr: 'فرع صديان',
    address: 'طريق الملك فهد الدائري المنتزه الشرقي، حائل 55428',
    phone: '+966501234567',
    coordinates: {
      lat: 27.5114,
      lng: 41.6901
    },
    workingHours: {
      open: '06:00',
      close: '24:00'
    },
    isOpen: true
  },
  {
    id: 'branch-002',
    name: 'Al-Nuqrah Branch',
    nameAr: 'فرع النقرة',
    address: 'فهد العلى العريفي النقرة، حائل 55431',
    phone: '+966501234568',
    coordinates: {
      lat: 27.5200,
      lng: 41.7000
    },
    workingHours: {
      open: '06:00',
      close: '24:00'
    },
    isOpen: true
  },
  {
    id: 'branch-003',
    name: 'Al-Jameen Branch',
    nameAr: 'فرع الجامعيين',
    address: 'المطار حائل 55421',
    phone: '+966501234569',
    coordinates: {
      lat: 27.5300,
      lng: 41.7100
    },
    workingHours: {
      open: '06:00',
      close: '24:00'
    },
    isOpen: true
  },
  {
    id: 'branch-004',
    name: 'Al-Madina Road Branch',
    nameAr: 'فرع طريق المدينة',
    address: 'طريق المدينة، النقرة، حائل 55433',
    phone: '+966501234570',
    coordinates: {
      lat: 27.5400,
      lng: 41.7200
    },
    workingHours: {
      open: '06:00',
      close: '24:00'
    },
    isOpen: true
  },
  {
    id: 'branch-005',
    name: 'Al-Rajihi Street Branch',
    nameAr: 'فرع شارع الراجحي',
    address: '3335 خليفة رسول الله ابو بكر الصديق، حي النقرة، حائل 55433',
    phone: '+966501234571',
    coordinates: {
      lat: 27.5500,
      lng: 41.7300
    },
    workingHours: {
      open: '06:00',
      close: '24:00'
    },
    isOpen: true
  },
  {
    id: 'branch-006',
    name: 'Fajr Branch',
    nameAr: 'فرع فجر',
    address: 'حائل GJ4P+QW9',
    phone: '+966501234572',
    coordinates: {
      lat: 27.5600,
      lng: 41.7400
    },
    workingHours: {
      open: '06:00',
      close: '24:00'
    },
    isOpen: true
  }
];

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
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

// Find the nearest branch to user's location
export function findNearestBranch(userLocation: UserLocation): Branch | null {
  if (!userLocation.lat || !userLocation.lng) {
    return null;
  }

  let nearestBranch: Branch | null = null;
  let shortestDistance = Infinity;

  branches.forEach(branch => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      branch.coordinates.lat,
      branch.coordinates.lng
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestBranch = branch;
    }
  });

  return nearestBranch;
}

// Get user's current location
export function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Get all branches sorted by distance from user location
export function getBranchesByDistance(userLocation: UserLocation): Branch[] {
  if (!userLocation.lat || !userLocation.lng) {
    return branches;
  }

  return branches
    .map(branch => ({
      ...branch,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        branch.coordinates.lat,
        branch.coordinates.lng
      )
    }))
    .sort((a, b) => a.distance - b.distance);
}

// Check if a branch is currently open
export function isBranchOpen(branch: Branch): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [openHour, openMinute] = branch.workingHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = branch.workingHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  
  return currentTime >= openTime && currentTime <= closeTime;
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} م`;
  }
  return `${distance.toFixed(1)} كم`;
}

// Get branch by ID
export function getBranchById(id: string): Branch | undefined {
  return branches.find(branch => branch.id === id);
}

// Get all open branches
export function getOpenBranches(): Branch[] {
  return branches.filter(branch => isBranchOpen(branch));
}

// Get all branches
export function getAllBranches(): Branch[] {
  return branches;
}
