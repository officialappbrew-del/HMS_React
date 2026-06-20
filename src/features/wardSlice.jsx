import { createSlice } from '@reduxjs/toolkit';

// Ward types for Nigerian context
const WARD_TYPES = {
  GENERAL_MALE: 'General Ward - Male',
  GENERAL_FEMALE: 'General Ward - Female',
  PRIVATE_VIP: 'Private/VIP Suite',
  SEMI_PRIVATE: 'Semi-Private Room',
  ISOLATION: 'Isolation Ward',
  ICU: 'ICU/HDU',
  MATERNITY: 'Maternity Ward',
  PEDIATRIC: 'Pediatric Ward',
  NYSC_STUDENT: 'NYSC/Student Ward'
};

// Bed status types
const BED_STATUS = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  RESERVED: 'Reserved',
  UNDER_CLEANING: 'Under Cleaning',
  MAINTENANCE: 'Maintenance'
};

// Initial ward structure
const initialWards = [
  {
    wardId: 'W001',
    wardName: 'Male General Ward',
    wardType: WARD_TYPES.GENERAL_MALE,
    totalBeds: 30,
    floor: 1,
    supervisor: 'Nurse Chioma Okafor',
    staffCount: 5,
    beds: Array.from({ length: 30 }, (_, i) => ({
      bedId: `W001-B${String(i + 1).padStart(3, '0')}`,
      wardId: 'W001',
      bedNumber: i + 1,
      status: i < 15 ? BED_STATUS.OCCUPIED : BED_STATUS.AVAILABLE,
      patientId: i < 15 ? `PAT${String(i + 1).padStart(5, '0')}` : null,
      bedType: 'Standard',
      isPrivate: false,
      cleaningStatus: 'Clean',
      lastCleaned: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      lastTurnover: new Date(Date.now() - Math.random() * 172800000).toISOString()
    }))
  },
  {
    wardId: 'W002',
    wardName: 'Female General Ward',
    wardType: WARD_TYPES.GENERAL_FEMALE,
    totalBeds: 30,
    floor: 1,
    supervisor: 'Nurse Amara Nwankwo',
    staffCount: 5,
    beds: Array.from({ length: 30 }, (_, i) => ({
      bedId: `W002-B${String(i + 1).padStart(3, '0')}`,
      wardId: 'W002',
      bedNumber: i + 1,
      status: i < 18 ? BED_STATUS.OCCUPIED : i === 18 ? BED_STATUS.RESERVED : BED_STATUS.AVAILABLE,
      patientId: i < 18 ? `PAT${String(100 + i).padStart(5, '0')}` : null,
      bedType: 'Standard',
      isPrivate: false,
      cleaningStatus: i === 18 ? 'Under Cleaning' : 'Clean',
      lastCleaned: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      lastTurnover: new Date(Date.now() - Math.random() * 172800000).toISOString()
    }))
  },
  {
    wardId: 'W003',
    wardName: 'Private/VIP Suite',
    wardType: WARD_TYPES.PRIVATE_VIP,
    totalBeds: 10,
    floor: 2,
    supervisor: 'Nurse Olu Adeyemi',
    staffCount: 3,
    beds: Array.from({ length: 10 }, (_, i) => ({
      bedId: `W003-B${String(i + 1).padStart(3, '0')}`,
      wardId: 'W003',
      bedNumber: i + 1,
      status: i < 6 ? BED_STATUS.OCCUPIED : BED_STATUS.AVAILABLE,
      patientId: i < 6 ? `PAT${String(200 + i).padStart(5, '0')}` : null,
      bedType: 'Deluxe',
      isPrivate: true,
      cleaningStatus: 'Clean',
      lastCleaned: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      lastTurnover: new Date(Date.now() - Math.random() * 172800000).toISOString()
    }))
  },
  {
    wardId: 'W004',
    wardName: 'ICU/HDU',
    wardType: WARD_TYPES.ICU,
    totalBeds: 8,
    floor: 3,
    supervisor: 'Nurse Abimbola Osidele',
    staffCount: 8,
    beds: Array.from({ length: 8 }, (_, i) => ({
      bedId: `W004-B${String(i + 1).padStart(3, '0')}`,
      wardId: 'W004',
      bedNumber: i + 1,
      status: i < 7 ? BED_STATUS.OCCUPIED : BED_STATUS.AVAILABLE,
      patientId: i < 7 ? `PAT${String(300 + i).padStart(5, '0')}` : null,
      bedType: 'ICU',
      isPrivate: false,
      cleaningStatus: 'Clean',
      lastCleaned: new Date(Date.now() - Math.random() * 43200000).toISOString(),
      lastTurnover: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }))
  },
  {
    wardId: 'W005',
    wardName: 'Maternity Ward',
    wardType: WARD_TYPES.MATERNITY,
    totalBeds: 12,
    floor: 2,
    supervisor: 'Midwife Bukola Adeoye',
    staffCount: 4,
    beds: Array.from({ length: 12 }, (_, i) => ({
      bedId: `W005-B${String(i + 1).padStart(3, '0')}`,
      wardId: 'W005',
      bedNumber: i + 1,
      status: i < 8 ? BED_STATUS.OCCUPIED : BED_STATUS.AVAILABLE,
      patientId: i < 8 ? `PAT${String(400 + i).padStart(5, '0')}` : null,
      bedType: 'Maternity',
      isPrivate: false,
      cleaningStatus: 'Clean',
      lastCleaned: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      lastTurnover: new Date(Date.now() - Math.random() * 172800000).toISOString()
    }))
  },
  {
    wardId: 'W006',
    wardName: 'Pediatric Ward',
    wardType: WARD_TYPES.PEDIATRIC,
    totalBeds: 15,
    floor: 1,
    supervisor: 'Nurse Zainab Musa',
    staffCount: 4,
    beds: Array.from({ length: 15 }, (_, i) => ({
      bedId: `W006-B${String(i + 1).padStart(3, '0')}`,
      wardId: 'W006',
      bedNumber: i + 1,
      status: i < 10 ? BED_STATUS.OCCUPIED : BED_STATUS.AVAILABLE,
      patientId: i < 10 ? `PAT${String(500 + i).padStart(5, '0')}` : null,
      bedType: 'Pediatric',
      isPrivate: false,
      cleaningStatus: 'Clean',
      lastCleaned: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      lastTurnover: new Date(Date.now() - Math.random() * 172800000).toISOString()
    }))
  }
];

const initialState = {
  wards: initialWards,
  selectedWard: initialWards[0],
  beds: initialWards.flatMap(w => w.beds),
  wardTypes: WARD_TYPES,
  bedStatus: BED_STATUS,
  stats: {
    totalBeds: initialWards.reduce((sum, w) => sum + w.totalBeds, 0),
    occupiedBeds: initialWards.reduce((sum, w) => sum + w.beds.filter(b => b.status === BED_STATUS.OCCUPIED).length, 0),
    availableBeds: initialWards.reduce((sum, w) => sum + w.beds.filter(b => b.status === BED_STATUS.AVAILABLE).length, 0),
    reservedBeds: initialWards.reduce((sum, w) => sum + w.beds.filter(b => b.status === BED_STATUS.RESERVED).length, 0)
  }
};

const wardSlice = createSlice({
  name: 'ward',
  initialState,
  reducers: {
    selectWard: (state, action) => {
      state.selectedWard = state.wards.find(w => w.wardId === action.payload);
    },
    occupyBed: (state, action) => {
      const { bedId, patientId } = action.payload;
      const bed = state.beds.find(b => b.bedId === bedId);
      const ward = state.wards.find(w => w.wardId === bed.wardId);
      
      if (bed && bed.status === BED_STATUS.AVAILABLE) {
        bed.status = BED_STATUS.OCCUPIED;
        bed.patientId = patientId;
        
        // Update ward stats
        state.stats.occupiedBeds += 1;
        state.stats.availableBeds -= 1;
        
        // Update ward bed
        const wardBed = ward.beds.find(b => b.bedId === bedId);
        if (wardBed) {
          wardBed.status = BED_STATUS.OCCUPIED;
          wardBed.patientId = patientId;
        }
      }
    },
    releaseBed: (state, action) => {
      const bedId = action.payload;
      const bed = state.beds.find(b => b.bedId === bedId);
      const ward = state.wards.find(w => w.wardId === bed.wardId);
      
      if (bed && bed.status === BED_STATUS.OCCUPIED) {
        bed.status = BED_STATUS.UNDER_CLEANING;
        bed.patientId = null;
        
        // Update ward stats
        state.stats.occupiedBeds -= 1;
        
        // Update ward bed
        const wardBed = ward.beds.find(b => b.bedId === bedId);
        if (wardBed) {
          wardBed.status = BED_STATUS.UNDER_CLEANING;
          wardBed.patientId = null;
        }
      }
    },
    reserveBed: (state, action) => {
      const { bedId, patientId } = action.payload;
      const bed = state.beds.find(b => b.bedId === bedId);
      const ward = state.wards.find(w => w.wardId === bed.wardId);
      
      if (bed && bed.status === BED_STATUS.AVAILABLE) {
        bed.status = BED_STATUS.RESERVED;
        bed.patientId = patientId;
        
        // Update ward stats
        state.stats.availableBeds -= 1;
        state.stats.reservedBeds += 1;
        
        // Update ward bed
        const wardBed = ward.beds.find(b => b.bedId === bedId);
        if (wardBed) {
          wardBed.status = BED_STATUS.RESERVED;
          wardBed.patientId = patientId;
        }
      }
    },
    markBedCleaning: (state, action) => {
      const bedId = action.payload;
      const bed = state.beds.find(b => b.bedId === bedId);
      const ward = state.wards.find(w => w.wardId === bed.wardId);
      
      if (bed) {
        bed.cleaningStatus = 'Under Cleaning';
        
        // Update ward bed
        const wardBed = ward.beds.find(b => b.bedId === bedId);
        if (wardBed) {
          wardBed.cleaningStatus = 'Under Cleaning';
        }
      }
    },
    markBedAvailable: (state, action) => {
      const bedId = action.payload;
      const bed = state.beds.find(b => b.bedId === bedId);
      const ward = state.wards.find(w => w.wardId === bed.wardId);
      
      if (bed) {
        bed.status = BED_STATUS.AVAILABLE;
        bed.cleaningStatus = 'Clean';
        bed.lastCleaned = new Date().toISOString();
        
        // Update stats if needed
        if (bed.patientId) {
          state.stats.occupiedBeds -= 1;
        }
        state.stats.availableBeds += 1;
        
        // Update ward bed
        const wardBed = ward.beds.find(b => b.bedId === bedId);
        if (wardBed) {
          wardBed.status = BED_STATUS.AVAILABLE;
          wardBed.cleaningStatus = 'Clean';
          wardBed.lastCleaned = new Date().toISOString();
        }
      }
    },
    addWard: (state, action) => {
      const newWard = action.payload;
      state.wards.push(newWard);
      state.beds.push(...newWard.beds);
      state.stats.totalBeds += newWard.totalBeds;
    },
    updateWardSupervisor: (state, action) => {
      const { wardId, supervisor } = action.payload;
      const ward = state.wards.find(w => w.wardId === wardId);
      if (ward) {
        ward.supervisor = supervisor;
      }
    },
    transferPatient: (state, action) => {
      const { fromBedId, toBedId, patientId } = action.payload;
      const fromBed = state.beds.find(b => b.bedId === fromBedId);
      const toBed = state.beds.find(b => b.bedId === toBedId);
      
      if (fromBed && toBed && toBed.status === BED_STATUS.AVAILABLE) {
        // Release from bed
        fromBed.status = BED_STATUS.AVAILABLE;
        fromBed.patientId = null;
        
        // Occupy to bed
        toBed.status = BED_STATUS.OCCUPIED;
        toBed.patientId = patientId;
      }
    }
  }
});

export const {
  selectWard,
  occupyBed,
  releaseBed,
  reserveBed,
  markBedCleaning,
  markBedAvailable,
  addWard,
  updateWardSupervisor,
  transferPatient
} = wardSlice.actions;

export default wardSlice.reducer;
