// import { useSelector, useDispatch } from 'react-redux';
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { apiRequest, API_BASE_URL } from '../../utils/api';
// import ChangePasswordModal from '../ChangePasswordModal';
// import {
//   Users,
//   Activity,
//   Pill,
//   Bed,
//   RotateCcw,
//   Heart,
//   Stethoscope,
//   AlertCircle,
//   Clock,
//   TrendingUp,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   Grid,
//   List,
//   Printer,
//   Download,
//   Search,
//   Filter,
//   Edit,
//   Trash2,
//   X,
//   UserPlus,
//   Bell,
//   MessageSquare,
//   Settings,
//   LogOut,
//   Menu,
//   Home,
//   Briefcase,
//   Clipboard,
//   Syringe,
//   Thermometer,
//   Weight,
//   Ruler,
//   HeartPulse,
//   Brain,
//   CheckCircle,
//   AlertTriangle,
//   Info,
//   Plus,
//   Calendar,
//   FileText,
//   CheckCircle2,
//   ChevronDown,
//   ChevronUp,
//   MoreVertical,
//   RefreshCw,
//   Play,
//   Pause,
//   Square,
//   Zap,
//   Shield,
//   Star,
//   Award,
//   UserCircle,
//   IdCard,
//   Droplets,
//   Baby,
//   Phone,
//   MapPin,
//   Building2,
//   User as UserIcon,
//   Upload,
//   Loader2,
//   Calendar as CalendarIcon,
//   Clock as ClockIcon,
//   Stethoscope as StethoscopeIcon,
// } from 'lucide-react';

// // Tooltip Component
// const Tooltip = ({ children, text, position = 'top' }) => {
//   const [show, setShow] = useState(false);
  
//   const positionClasses = {
//     top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
//     bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
//     left: 'right-full top-1/2 -translate-y-1/2 mr-2',
//     right: 'left-full top-1/2 -translate-y-1/2 ml-2',
//   };

//   return (
//     <div 
//       className="relative inline-flex"
//       onMouseEnter={() => setShow(true)}
//       onMouseLeave={() => setShow(false)}
//       onTouchStart={() => setShow(!show)}
//     >
//       {children}
//       {show && (
//         <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap`}>
//           <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg">
//             {text}
//             <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
//               position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
//               position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
//               position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
//               'left-[-4px] top-1/2 -translate-y-1/2'
//             }`} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Icon Button with Tooltip
// const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
//   const variantClasses = {
//     default: 'text-gray-400 hover:text-gray-600',
//     primary: 'text-blue-600 hover:text-blue-700',
//     success: 'text-green-600 hover:text-green-700',
//     danger: 'text-red-600 hover:text-red-700',
//     warning: 'text-yellow-600 hover:text-yellow-700',
//     info: 'text-blue-600 hover:text-blue-700',
//   };

//   return (
//     <Tooltip text={tooltip}>
//       <button
//         onClick={onClick}
//         disabled={disabled}
//         className={`p-1.5 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className} ${
//           disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'
//         }`}
//       >
//         <Icon className="w-4 h-4" />
//       </button>
//     </Tooltip>
//   );
// };

// // Button with Tooltip
// const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '' }) => {
//   const variantClasses = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white',
//     secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
//     success: 'bg-green-600 hover:bg-green-700 text-white',
//     danger: 'bg-red-600 hover:bg-red-700 text-white',
//     warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
//   };

//   return (
//     <Tooltip text={tooltip}>
//       <button
//         onClick={onClick}
//         className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className}`}
//       >
//         {children}
//       </button>
//     </Tooltip>
//   );
// };

// // Profile Modal Component
// const ProfileModal = ({ isOpen, onClose, profileData, onChange, onSave, loading, saving, error, success, specializations, specializationsLoading, profilePicturePreview, onProfilePictureChange }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
//           <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold">My Profile</h2>
//                 <p className="text-sm text-blue-100 mt-1">View and update your personal information</p>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//             {(error || success) && (
//               <div className={`mb-4 p-3 rounded-lg text-sm whitespace-pre-line ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
//                 {error || success}
//               </div>
//             )}

//             {!loading && (
//               <div className="flex flex-col items-center mb-6">
//                 <div className="relative">
//                   <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
//                     {profilePicturePreview ? (
//                       <img
//                         key={profilePicturePreview}
//                         src={profilePicturePreview}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                           const fallback = e.target.parentElement?.querySelector('.profile-fallback');
//                           if (fallback) fallback.style.display = 'flex';
//                         }}
//                       />
//                     ) : null}
//                     <div className="w-full h-full items-center justify-center profile-fallback" style={{ display: profilePicturePreview ? 'none' : 'flex' }}>
//                       <UserIcon className="w-12 h-12 text-gray-400" />
//                     </div>
//                   </div>
//                 </div>
//                 <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
//                   <Upload className="w-4 h-4" />
//                   {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         if (file.size > 5 * 1024 * 1024) {
//                           onProfilePictureChange('profile_picture_file', null);
//                           alert('Image must be less than 5MB');
//                           return;
//                         }
//                         onProfilePictureChange('profile_picture_file', file);
//                       }
//                     }}
//                   />
//                 </label>
//                 {profilePicturePreview && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       onProfilePictureChange('profile_picture_file', null);
//                     }}
//                     className="mt-1 text-xs text-red-600 hover:text-red-700"
//                   >
//                     Remove photo
//                   </button>
//                 )}
//               </div>
//             )}

//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="text-gray-500 text-sm mt-2">Loading profile...</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
//                     <input
//                       type="text"
//                       value={profileData.first_name}
//                       onChange={(e) => onChange('first_name', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
//                     <input
//                       type="text"
//                       value={profileData.last_name}
//                       onChange={(e) => onChange('last_name', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
//                     <input
//                       type="email"
//                       value={profileData.email}
//                       onChange={(e) => onChange('email', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
//                     <input
//                       type="tel"
//                       value={profileData.phone}
//                       onChange={(e) => onChange('phone', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
//                     <input
//                       type="text"
//                       value={profileData.employee_id}
//                       disabled
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
//                     <input
//                       type="text"
//                       value={profileData.role}
//                       disabled
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
//                     <input
//                       type="text"
//                       value={profileData.department_name}
//                       disabled
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
//                     <input
//                       type="text"
//                       value={profileData.designation}
//                       onChange={(e) => onChange('designation', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">License Number</label>
//                     <input
//                       type="text"
//                       value={profileData.license_number}
//                       onChange={(e) => onChange('license_number', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">Specialization</label>
//                     <select
//                       value={profileData.specialization}
//                       onChange={(e) => onChange('specialization', e.target.value)}
//                       disabled={specializationsLoading}
//                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
//                     >
//                       <option value="">-- Select specialization --</option>
//                       {specializations.map(spec => (
//                         <option key={spec} value={spec}>{spec}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Qualification</label>
//                   <textarea
//                     value={profileData.qualification}
//                     onChange={(e) => onChange('qualification', e.target.value)}
//                     rows="2"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex flex-wrap justify-end gap-2">
//             <ButtonWithTooltip
//               onClick={onClose}
//               tooltip="Close profile editor"
//               variant="secondary"
//             >
//               <X className="w-3.5 h-3.5" />
//               Close
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               onClick={onSave}
//               tooltip="Save profile changes"
//               variant="primary"
//               disabled={saving}
//             >
//               <CheckCircle className="w-3.5 h-3.5" />
//               {saving ? 'Saving...' : 'Save Changes'}
//             </ButtonWithTooltip>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Patient Detail Modal Component
// const PatientDetailModal = ({ patient, onClose }) => {
//   if (!patient) return null;

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     try {
//       return new Date(date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'N/A';
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return '?';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const getStatusColor = (status) => {
//     const statusMap = {
//       'active': 'bg-green-100 text-green-800 border-green-200',
//       'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
//       'archived': 'bg-gray-100 text-gray-800 border-gray-200',
//       'critical': 'bg-red-100 text-red-800 border-red-200',
//       'stable': 'bg-green-100 text-green-800 border-green-200',
//       'monitoring': 'bg-blue-100 text-blue-800 border-blue-200',
//     };
//     return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getGenderIcon = (gender) => {
//     if (gender?.toLowerCase() === 'male') return <UserIcon className="w-4 h-4 text-blue-500" />;
//     if (gender?.toLowerCase() === 'female') return <UserIcon className="w-4 h-4 text-pink-500" />;
//     return <UserCircle className="w-4 h-4 text-gray-400" />;
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div 
//         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
//           <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
//             <div className="flex items-start justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
//                   {getInitials(patient.name)}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold">{patient.name}</h2>
//                   <div className="flex items-center gap-3 mt-1 text-sm text-blue-100">
//                     <span className="flex items-center gap-1">
//                       {getGenderIcon(patient.gender)}
//                       {patient.gender || 'Not specified'}
//                     </span>
//                     {patient.age && (
//                       <span className="flex items-center gap-1">
//                         <CalendarIcon className="w-3.5 h-3.5" />
//                         {patient.age} years
//                       </span>
//                     )}
//                     {patient.hospital_number && (
//                       <span className="flex items-center gap-1">
//                         <IdCard className="w-3.5 h-3.5" />
//                         HN: {patient.hospital_number}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="mt-3 flex flex-wrap items-center gap-2">
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
//                 {patient.status || 'Active'}
//               </span>
//               {patient.bloodType && (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
//                   <Droplets className="w-3 h-3 mr-1" />
//                   {patient.bloodType}
//                 </span>
//               )}
//               {patient.genotype && (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
//                   <Brain className="w-3 h-3 mr-1" />
//                   Genotype: {patient.genotype}
//                 </span>
//               )}
//               {patient.has_insurance && (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
//                   <Shield className="w-3 h-3 mr-1" />
//                   Insured
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <UserCircle className="w-4 h-4 text-blue-600" />
//                   Personal Information
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Full Name</span>
//                     <span className="font-medium text-gray-900">{patient.name}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Date of Birth</span>
//                     <span className="font-medium text-gray-900">{formatDate(patient.dateOfBirth)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Age</span>
//                     <span className="font-medium text-gray-900">{patient.age || 'N/A'} years</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Gender</span>
//                     <span className="font-medium text-gray-900">{patient.gender || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">NIN</span>
//                     <span className="font-medium text-gray-900">{patient.nin || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Marital Status</span>
//                     <span className="font-medium text-gray-900">{patient.maritalStatus || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Religion</span>
//                     <span className="font-medium text-gray-900">{patient.religion || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Ethnicity</span>
//                     <span className="font-medium text-gray-900">{patient.tribe || patient.ethnicity || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Occupation</span>
//                     <span className="font-medium text-gray-900">{patient.occupation || 'N/A'}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Phone className="w-4 h-4 text-green-600" />
//                   Contact Information
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Phone</span>
//                     <span className="font-medium text-gray-900">{patient.phone || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Email</span>
//                     <span className="font-medium text-gray-900">{patient.email || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Address</span>
//                     <span className="font-medium text-gray-900">{patient.address || 'N/A'}</span>
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
//                     <MapPin className="w-3.5 h-3.5 text-purple-600" />
//                     Location
//                   </h4>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Country</span>
//                       <span className="font-medium text-gray-900">{patient.country || 'Nigeria'}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">State</span>
//                       <span className="font-medium text-gray-900">{patient.state || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">LGA</span>
//                       <span className="font-medium text-gray-900">{patient.lga || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">City</span>
//                       <span className="font-medium text-gray-900">{patient.city || 'N/A'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <HeartPulse className="w-4 h-4 text-red-600" />
//                   Medical Information
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Blood Group</span>
//                     <span className="font-medium text-gray-900">{patient.bloodType || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Genotype</span>
//                     <span className="font-medium text-gray-900">{patient.genotype || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Known Allergies</span>
//                     <span className="font-medium text-gray-900">{patient.known_allergies || 'None'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Chronic Conditions</span>
//                     <span className="font-medium text-gray-900">{patient.chronic_conditions || 'None'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Current Medications</span>
//                     <span className="font-medium text-gray-900">{patient.current_medications || 'None'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Surgical History</span>
//                     <span className="font-medium text-gray-900">{patient.surgical_history || 'None'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Family History</span>
//                     <span className="font-medium text-gray-900">{patient.family_history || 'None'}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Shield className="w-4 h-4 text-yellow-600" />
//                   Emergency Contact
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Contact Name</span>
//                     <span className="font-medium text-gray-900">{patient.emergencyContact || patient.next_of_kin_name || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Contact Phone</span>
//                     <span className="font-medium text-gray-900">{patient.emergencyPhone || patient.next_of_kin_phone || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Relationship</span>
//                     <span className="font-medium text-gray-900">{patient.next_of_kin_relationship || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Address</span>
//                     <span className="font-medium text-gray-900">{patient.next_of_kin_address || 'N/A'}</span>
//                   </div>
//                 </div>
//                 {patient.has_insurance && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
//                       <IdCard className="w-3.5 h-3.5 text-blue-600" />
//                       Insurance Information
//                     </h4>
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Insurance Company</span>
//                         <span className="font-medium text-gray-900">{patient.insurance_company || 'N/A'}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Policy Number</span>
//                         <span className="font-medium text-gray-900">{patient.insurance_policy_number || 'N/A'}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">NHIS Number</span>
//                         <span className="font-medium text-gray-900">{patient.nhis_number || 'N/A'}</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Building2 className="w-4 h-4 text-blue-600" />
//                   Hospital Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Hospital Number</span>
//                     <span className="font-medium text-gray-900">{patient.hospital_number || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Login ID</span>
//                     <span className="font-medium text-gray-900">{patient.login_id || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Tenant/Hospital</span>
//                     <span className="font-medium text-gray-900">{patient.tenant_name || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Registration Date</span>
//                     <span className="font-medium text-gray-900">{formatDate(patient.registration_date || patient.createdAt)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Last Visit</span>
//                     <span className="font-medium text-gray-900">{formatDate(patient.last_visit)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Language Spoken</span>
//                     <span className="font-medium text-gray-900">{patient.language_spoken || 'N/A'}</span>
//                   </div>
//                 </div>
//                 {patient.notes && (
//                   <div className="mt-3 pt-3 border-t border-gray-200">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Notes</span>
//                       <span className="font-medium text-gray-900 text-right max-w-[60%]">{patient.notes}</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex flex-wrap justify-end gap-2">
//             <ButtonWithTooltip
//               onClick={onClose}
//               tooltip="Close patient details"
//               variant="secondary"
//             >
//               <X className="w-3.5 h-3.5" />
//               Close
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               onClick={() => window.open(`/patients/${patient.id}/vitals`, '_blank')}
//               tooltip="Record vitals"
//               variant="primary"
//             >
//               <Activity className="w-3.5 h-3.5" />
//               Record Vitals
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               onClick={() => window.open(`/patients/${patient.id}/emr`, '_blank')}
//               tooltip="View medical records"
//               variant="success"
//             >
//               <FileText className="w-3.5 h-3.5" />
//               View EMR
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               onClick={() => window.open(`/patients/edit/${patient.id}`, '_blank')}
//               tooltip="Edit patient"
//               variant="warning"
//             >
//               <Edit className="w-3.5 h-3.5" />
//               Edit
//             </ButtonWithTooltip>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const NurseDashboard = () => {
//   const { user: authUser, tenant: authTenant } = useAuth();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { patients } = useSelector(state => state.patient || { patients: [] });
//   const { admissions } = useSelector(state => state.admission || { admissions: [] });

// const displayTenantName = authTenant?.name || 'Hospital';
//    const displayUserName = authUser?.full_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
//    const displayRole = authUser?.role || 'nurse';

//   // Profile Modal State
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [profileSaving, setProfileSaving] = useState(false);
//   const [profileData, setProfileData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     role: '',
//     employee_id: '',
//     department_name: '',
//     designation: '',
//     license_number: '',
//     specialization: '',
//     qualification: '',
//   });
//   const [profileError, setProfileError] = useState(null);
//   const [profileSuccess, setProfileSuccess] = useState(null);
//   const [specializations, setSpecializations] = useState([]);
//   const [specializationsLoading, setSpecializationsLoading] = useState(false);
//   const [profilePictureFile, setProfilePictureFile] = useState(null);
//   const [profilePicturePreview, setProfilePicturePreview] = useState('');
//   const [dashboardProfilePicture, setDashboardProfilePicture] = useState(authUser?.profile_picture || '');

//   const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [passwordError, setPasswordError] = useState(null);
//   const [passwordSuccess, setPasswordSuccess] = useState(null);
//   const [passwordData, setPasswordData] = useState({
//     old_password: '',
//     new_password: '',
//     confirm_password: '',
//   });

//   // Appointment/Schedule State
//   const [todaysSchedule, setTodaysSchedule] = useState([]);
//   const [scheduleLoading, setScheduleLoading] = useState(false);
//   const [scheduleError, setScheduleError] = useState(null);
//   const [showStatusMenu, setShowStatusMenu] = useState(null);

//   // Patient Management State
//   const [patientsList, setPatientsList] = useState([]);
//   const [patientsCount, setPatientsCount] = useState(0);
//   const [patientsNextPage, setPatientsNextPage] = useState(null);
//   const [patientsPreviousPage, setPatientsPreviousPage] = useState(null);
//   const [patientsLoading, setPatientsLoading] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [showPatientModal, setShowPatientModal] = useState(false);

//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [viewMode, setViewMode] = useState('table');
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const itemsPerPage = 10;

//   const [stats, setStats] = useState({
//     assignedPatients: 0,
//     vitalsDue: 0,
//     medicationsDue: 0,
//     bedChecks: 0,
//   });

//   const [alerts, setAlerts] = useState([
//     { id: 1, type: 'warning', message: 'Medication due - Room 203, 2pm', time: '10 min ago', read: false },
//     { id: 2, type: 'info', message: 'Vital signs check completed - Room 105', time: '30 min ago', read: false },
//     { id: 3, type: 'critical', message: 'Patient alert - Room 301', time: '5 min ago', read: false }
//   ]);

//   const [assignedPatients, setAssignedPatients] = useState([
//     { id: 1, name: 'John Doe', room: '203', status: 'Stable', nextCheck: '14:00', vitals: 'Normal' },
//     { id: 2, name: 'Jane Smith', room: '105', status: 'Critical', nextCheck: '13:30', vitals: 'Abnormal' },
//     { id: 3, name: 'Bob Johnson', room: '301', status: 'Improving', nextCheck: '15:00', vitals: 'Stable' },
//     { id: 4, name: 'Alice Brown', room: '204', status: 'Stable', nextCheck: '16:00', vitals: 'Normal' }
//   ]);

//   const [tasks, setTasks] = useState([
//     { id: 1, patient: 'John Doe', room: '203', task: 'Administer medication', due: '14:00', status: 'pending', priority: 'high' },
//     { id: 2, patient: 'Jane Smith', room: '105', task: 'Vital signs check', due: '13:30', status: 'in-progress', priority: 'critical' },
//     { id: 3, patient: 'Bob Johnson', room: '301', task: 'Bed check', due: '15:00', status: 'completed', priority: 'medium' },
//     { id: 4, patient: 'Alice Brown', room: '204', task: 'Medication administration', due: '16:00', status: 'pending', priority: 'medium' }
//   ]);

//   const [taskForm, setTaskForm] = useState({
//     patient: '',
//     room: '',
//     task: '',
//     due: '',
//     priority: 'medium'
//   });

//   const [vitalsLoading, setVitalsLoading] = useState(false);
//   const [vitalsError, setVitalsError] = useState('');
//   const [dashboardVitals, setDashboardVitals] = useState([]);
//   const [vitalsCurrentPage, setVitalsCurrentPage] = useState(1);
//   const vitalsPerPage = 10;

//   useEffect(() => {
//     const loadVitals = async () => {
//       setVitalsLoading(true);
//       setVitalsError('');
//       try {
//         const data = await apiRequest('/api/v1/clinical/vital-signs/?page_size=50');
//         const list = Array.isArray(data) ? data : (data.results || []);
//         setDashboardVitals(list);
//       } catch (err) {
//         setVitalsError(err.message || 'Failed to load vital signs.');
//       } finally {
//         setVitalsLoading(false);
//       }
//     };
//     loadVitals();
//   }, []);

//   // Format time helper
//   const formatTime = (timeStr) => {
//     if (!timeStr) return '';
//     const parts = timeStr.split(':');
//     const hours = parseInt(parts[0], 10);
//     const minutes = parts[1];
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const hour12 = hours % 12 || 12;
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const normalizeAppointmentStatus = (status) => {
//     const statusMap = {
//       'scheduled': 'scheduled',
//       'confirmed': 'scheduled',
//       'checked_in': 'in-progress',
//       'in_progress': 'in-progress',
//       'completed': 'completed',
//       'cancelled': 'cancelled',
//       'no_show': 'cancelled',
//       'rescheduled': 'scheduled'
//     };
//     return statusMap[status] || status || 'scheduled';
//   };

//   // Load today's schedule
//   useEffect(() => {
//     const fetchTodaysSchedule = async () => {
//       try {
//         setScheduleLoading(true);
//         setScheduleError(null);
//         const data = await apiRequest('/api/v1/patients/appointments/');
//         const results = Array.isArray(data) ? data : (data.results || []);
//         const mapped = results.map(apt => ({
//           id: apt.id,
//           patientName: apt.patient_name || 'Unknown Patient',
//           patientId: apt.patient || '',
//           date: apt.scheduled_date || '',
//           time: formatTime(apt.scheduled_time),
//           timeRaw: apt.scheduled_time ? apt.scheduled_time.substring(0, 5) : '',
//           reason: apt.reason || '',
//           doctor: apt.doctor_name || '',
//           doctorId: apt.doctor || '',
//           status: normalizeAppointmentStatus(apt.status),
//           notes: apt.notes || '',
//           phone: apt.patient_phone || '',
//           email: apt.patient_email || '',
//           appointment_type: apt.appointment_type || 'consultation',
//         }));
//         setTodaysSchedule(mapped);
//       } catch (err) {
//         setScheduleError(err.message || 'Failed to load schedule');
//       } finally {
//         setScheduleLoading(false);
//       }
//     };
//     fetchTodaysSchedule();
//   }, []);

//   // Normalize patient for display
//   const normalizePatientForDisplay = (patient) => {
//     return {
//       id: patient.id,
//       name: patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient',
//       first_name: patient.first_name || '',
//       last_name: patient.last_name || '',
//       nin: patient.nin || '',
//       phone: patient.phone || '',
//       email: patient.email || '',
//       address: patient.address || '',
//       tribe: patient.ethnicity || patient.tribe || '',
//       country: patient.country || 'Nigeria',
//       lga: patient.lga || '',
//       state: patient.state || '',
//       city: patient.city || '',
//       dateOfBirth: patient.date_of_birth || '',
//       bloodType: patient.blood_group || patient.bloodType || '',
//       gender: patient.gender || '',
//       maritalStatus: patient.marital_status || patient.maritalStatus || '',
//       occupation: patient.occupation || '',
//       emergencyContact: patient.next_of_kin_name || '',
//       emergencyPhone: patient.next_of_kin_phone || '',
//       religion: patient.religion || '',
//       status: patient.patient_status || patient.status || 'active',
//       createdAt: patient.registration_date || patient.createdAt || new Date().toISOString(),
//       updatedAt: patient.updated_at || patient.updatedAt || new Date().toISOString(),
//       hospital_number: patient.hospital_number || '',
//       login_id: patient.login_id || '',
//       age: patient.age || '',
//       full_name: patient.full_name || '',
//       age_display: patient.age_display || '',
//       tenant_name: patient.tenant_name || '',
//       nhis_number: patient.nhis_number || '',
//       middle_name: patient.middle_name || '',
//       phone2: patient.phone2 || '',
//       next_of_kin_relationship: patient.next_of_kin_relationship || '',
//       next_of_kin_address: patient.next_of_kin_address || '',
//       known_allergies: patient.known_allergies || '',
//       chronic_conditions: patient.chronic_conditions || '',
//       current_medications: patient.current_medications || '',
//       surgical_history: patient.surgical_history || '',
//       family_history: patient.family_history || '',
//       has_insurance: patient.has_insurance || false,
//       insurance_company: patient.insurance_company || '',
//       insurance_policy_number: patient.insurance_policy_number || '',
//       insurance_expiry: patient.insurance_expiry || null,
//       ethnicity: patient.ethnicity || '',
//       language_spoken: patient.language_spoken || '',
//       patient_status: patient.patient_status || 'active',
//       photo: patient.photo || null,
//       notes: patient.notes || '',
//       registration_date: patient.registration_date || '',
//       last_visit: patient.last_visit || null,
//       registered_by: patient.registered_by || null,
//       is_active: patient.is_active !== undefined ? patient.is_active : true,
//       tenant: patient.tenant || null,
//       genotype: patient.genotype || '',
//     };
//   };

//   // Load patients from API
//   const loadPatients = async (url = '/api/v1/patients/patients/') => {
//     try {
//       setPatientsLoading(true);
//       const data = await apiRequest(url);
//       const results = Array.isArray(data) ? data : (data.results || []);
//       const normalized = results.map(normalizePatientForDisplay);
//       setPatientsList(normalized);
//       setPatientsCount(data.count || normalized.length);
//       setPatientsNextPage(data.next || null);
//       setPatientsPreviousPage(data.previous || null);
//     } catch (err) {
//       console.error('Failed to load patients:', err);
//       setPatientsList([]);
//       setPatientsCount(0);
//     } finally {
//       setPatientsLoading(false);
//     }
//   };

//   // Load patients when component mounts
//   useEffect(() => {
//     loadPatients('/api/v1/patients/patients/?status=all');
//   }, []);

//   // Update stats when patients or tasks change
//   useEffect(() => {
//     setStats({
//       assignedPatients: patientsList.length || assignedPatients.length,
//       vitalsDue: tasks.filter(t => t.task.includes('Vital') && t.status === 'pending').length,
//       medicationsDue: tasks.filter(t => t.task.includes('Medication') && t.status === 'pending').length,
//       bedChecks: tasks.filter(t => t.task.includes('Bed') && t.status === 'pending').length,
//     });
//   }, [patientsList, assignedPatients, tasks]);

//   // Refresh handler
//   const handleRefresh = () => {
//     switch(activeTab) {
//       case 'patients':
//         loadPatients('/api/v1/patients/patients/');
//         break;
//       case 'overview':
//         loadPatients('/api/v1/patients/patients/');
//         break;
//       default:
//         loadPatients('/api/v1/patients/patients/');
//     }
//   };

//   // Profile Handlers
//   const handleOpenProfile = async () => {
//     setShowProfileModal(true);
//     setProfileLoading(true);
//     setProfileError(null);
//     setProfileSuccess(null);
//     setSpecializationsLoading(true);
//     setProfilePictureFile(null);
//     setProfilePicturePreview('');
//     setDashboardProfilePicture(authUser?.profile_picture || '');
//     try {
//       const [profileRes, specsRes] = await Promise.all([
//         apiRequest('/api/v1/tenants/users/me/'),
//         apiRequest('/api/v1/core/specializations/'),
//       ]);
//       const specList = Array.isArray(specsRes) ? specsRes : (specsRes.results || []);
//       setSpecializations(specList.map(s => s.name));
//       setProfileData({
//         first_name: profileRes.first_name || '',
//         last_name: profileRes.last_name || '',
//         email: profileRes.email || '',
//         phone: profileRes.phone || '',
//         role: profileRes.role || '',
//         employee_id: profileRes.employee_id || '',
//         department_name: profileRes.department_name || '',
//         designation: profileRes.designation || '',
//         license_number: profileRes.license_number || '',
//         specialization: profileRes.specialization || '',
//         qualification: profileRes.qualification || '',
//       });
//       const pic = profileRes.profile_picture || '';
//       const cached = localStorage.getItem('userProfilePicture') || '';
//       const effectivePic = pic || cached;
//       if (effectivePic) {
//         const cacheBusted = effectivePic.includes('?') ? `${effectivePic}&t=${Date.now()}` : `${effectivePic}?t=${Date.now()}`;
//         setProfilePicturePreview(cacheBusted);
//         setDashboardProfilePicture(cacheBusted);
//         localStorage.setItem('userProfilePicture', effectivePic);
//       }
//     } catch (err) {
//       if (err.data && typeof err.data === 'object') {
//         const friendlyMessages = Object.entries(err.data)
//           .map(([field, errors]) => {
//             const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//             const msg = Array.isArray(errors) ? errors[0] : errors;
//             return `${fieldLabel}: ${msg}`;
//           })
//           .join('\n');
//         setProfileError(friendlyMessages);
//       } else {
//         setProfileError(err.message || 'Failed to load profile. Please try again.');
//       }
//     } finally {
//       setProfileLoading(false);
//       setSpecializationsLoading(false);
//     }
//   };

//   const handleProfileChange = (field, value) => {
//     if (field === 'profile_picture_file') {
//       setProfilePictureFile(value);
//       if (value) {
//         const reader = new FileReader();
//         reader.onload = (e) => setProfilePicturePreview(e.target.result);
//         reader.readAsDataURL(value);
//       } else {
//         setProfilePicturePreview('');
//       }
//     } else {
//       setProfileData(prev => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleSaveProfile = async () => {
//     setProfileSaving(true);
//     setProfileError(null);
//     setProfileSuccess(null);

//     if (!profileData.first_name.trim() || !profileData.last_name.trim()) {
//       setProfileError('First name and last name are required.');
//       setProfileSaving(false);
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(profileData.email)) {
//       setProfileError('Please enter a valid email address.');
//       setProfileSaving(false);
//       return;
//     }

//     const trimmedSpecialization = profileData.specialization.trim();

//     try {
//       if (profilePictureFile) {
//         const formData = new FormData();
//         formData.append('first_name', profileData.first_name.trim());
//         formData.append('last_name', profileData.last_name.trim());
//         formData.append('email', profileData.email.trim());
//         formData.append('phone', profileData.phone.trim());
//         formData.append('designation', profileData.designation.trim());
//         formData.append('license_number', profileData.license_number.trim());
//         formData.append('specialization', trimmedSpecialization);
//         formData.append('qualification', profileData.qualification.trim());
//         formData.append('profile_picture', profilePictureFile);

//         const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
//         const response = await fetch(`${API_BASE_URL}/api/v1/tenants/users/me/`, {
//           method: 'PATCH',
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//           body: formData,
//         });

//         if (!response.ok) {
//           const contentType = response.headers.get('content-type') || '';
//           const isJson = contentType.includes('application/json');
//           const data = isJson ? await response.json().catch(() => ({})) : await response.text();
//           const message = (data && (data.detail || data.error || data.message || data.non_field_errors?.[0])) || `Request failed with status ${response.status}`;
//           const error = new Error(message);
//           error.data = data;
//           error.status = response.status;
//           throw error;
//         }
//       } else {
//         const payload = {
//           first_name: profileData.first_name.trim(),
//           last_name: profileData.last_name.trim(),
//           email: profileData.email.trim(),
//           phone: profileData.phone.trim(),
//           designation: profileData.designation.trim(),
//           license_number: profileData.license_number.trim(),
//           specialization: trimmedSpecialization,
//           qualification: profileData.qualification.trim(),
//         };
//         await apiRequest('/api/v1/tenants/users/me/', {
//           method: 'PATCH',
//           body: JSON.stringify(payload),
//         });
//       }
//       setProfileSuccess('Profile updated successfully');
//       setProfilePictureFile(null);
//       const refreshed = await apiRequest('/api/v1/tenants/users/me/');
//       const pic = refreshed?.profile_picture || '';
//       if (pic) {
//         const cacheBusted = pic.includes('?') ? `${pic}&t=${Date.now()}` : `${pic}?t=${Date.now()}`;
//         localStorage.setItem('userProfilePicture', pic);
//         setDashboardProfilePicture(cacheBusted);
//         setProfilePicturePreview(cacheBusted);
//       } else {
//         localStorage.removeItem('userProfilePicture');
//         setDashboardProfilePicture('');
//         setProfilePicturePreview('');
//       }
//     } catch (err) {
//       if (err.data && typeof err.data === 'object') {
//         const friendlyMessages = Object.entries(err.data)
//           .map(([field, errors]) => {
//             const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//             const msg = Array.isArray(errors) ? errors[0] : errors;
//             if (field === 'email' && msg.includes('already exists')) {
//               return `${fieldLabel}: This email address is already in use. Please choose a different one.`;
//             }
//             if (field === 'specialization' && msg.includes('not found')) {
//               return `${fieldLabel}: "${trimmedSpecialization}" is not a recognized specialization.`;
//             }
//             return `${fieldLabel}: ${msg}`;
//           })
//           .join('\n');
//         setProfileError(friendlyMessages);
//       } else {
//         setProfileError(err.message || 'Failed to update profile. Please try again.');
//       }
//     } finally {
//       setProfileSaving(false);
//     }
//   };

//   // Password Change Handlers
//   const handleOpenChangePassword = () => {
//     setShowChangePasswordModal(true);
//     setPasswordError(null);
//     setPasswordSuccess(null);
//     setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
//   };

//   const handlePasswordChange = (field, value) => {
//     setPasswordData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleChangePassword = async () => {
//     setPasswordLoading(true);
//     setPasswordError(null);
//     setPasswordSuccess(null);

//     if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
//       setPasswordError('Please fill in all password fields.');
//       setPasswordLoading(false);
//       return;
//     }

//     if (passwordData.new_password !== passwordData.confirm_password) {
//       setPasswordError('New password and confirm password do not match.');
//       setPasswordLoading(false);
//       return;
//     }

//     if (passwordData.new_password.length < 8) {
//       setPasswordError('New password must be at least 8 characters long.');
//       setPasswordLoading(false);
//       return;
//     }

//     try {
//       await apiRequest('/api/v1/tenants/users/change_password/', {
//         method: 'POST',
//         body: JSON.stringify({
//           old_password: passwordData.old_password,
//           new_password: passwordData.new_password,
//           confirm_password: passwordData.confirm_password,
//         }),
//       });
//       setPasswordSuccess('Password changed successfully');
//       setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
//       setTimeout(() => {
//         setShowChangePasswordModal(false);
//         setPasswordSuccess(null);
//       }, 1500);
//     } catch (err) {
//       setPasswordError(err.message || 'Failed to change password. Please try again.');
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   // Status change handler for appointments
//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const updated = await apiRequest(`/api/v1/patients/appointments/${id}/`, {
//         method: 'PATCH',
//         body: JSON.stringify({ status: newStatus }),
//       });
//       const statusMap = {
//         'scheduled': 'scheduled',
//         'confirmed': 'scheduled',
//         'checked_in': 'in-progress',
//         'in_progress': 'in-progress',
//         'completed': 'completed',
//         'cancelled': 'cancelled',
//         'no_show': 'cancelled',
//         'rescheduled': 'scheduled'
//       };
//       const normalized = { ...updated, status: statusMap[updated.status] || updated.status || 'scheduled' };
//       setTodaysSchedule(prev => prev.map(apt => apt.id === id ? normalized : apt));
//     } catch (err) {
//       alert(err.message || 'Failed to update status');
//     }
//     setShowStatusMenu(null);
//   };

//   const handleMarkAlertRead = (id) => {
//     setAlerts(prev => prev.map(alert => 
//       alert.id === id ? { ...alert, read: true } : alert
//     ));
//   };

//   const handleDismissAlert = (id) => {
//     setAlerts(prev => prev.filter(alert => alert.id !== id));
//   };

//   const handleTaskStatusChange = (id, status) => {
//     setTasks(prev => prev.map(task => 
//       task.id === id ? { ...task, status } : task
//     ));
//   };

//   const handleDeleteTask = (id) => {
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       setTasks(prev => prev.filter(task => task.id !== id));
//     }
//   };

//   const handleSaveTask = () => {
//     if (!taskForm.patient || !taskForm.task) {
//       alert('Please fill in patient and task fields');
//       return;
//     }

//     const newTask = {
//       id: editingTaskId || Date.now(),
//       ...taskForm,
//       status: 'pending'
//     };

//     if (editingTaskId) {
//       setTasks(prev => prev.map(task => 
//         task.id === editingTaskId ? newTask : task
//       ));
//     } else {
//       setTasks(prev => [newTask, ...prev]);
//     }

//     resetTaskForm();
//     setShowTaskForm(false);
//   };

//   const resetTaskForm = () => {
//     setTaskForm({
//       patient: '',
//       room: '',
//       task: '',
//       due: '',
//       priority: 'medium'
//     });
//     setEditingTaskId(null);
//   };

//   const handleEditTask = (task) => {
//     setTaskForm({
//       patient: task.patient,
//       room: task.room,
//       task: task.task,
//       due: task.due,
//       priority: task.priority
//     });
//     setEditingTaskId(task.id);
//     setShowTaskForm(true);
//   };

//   const handleViewPatient = (patient) => {
//     setSelectedPatient(patient);
//     setShowPatientModal(true);
//   };

//   const handleCreateAdmissionForPatient = (patient) => {
//     const preselectedPatient = {
//       patientId: patient.hospital_number || patient.hospitalNumber || patient.patient_id || patient.id,
//       patientName: patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
//       name: patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
//       phone: patient.phone || patient.phone_number,
//       email: patient.email,
//       id: patient.id,
//     };

//     sessionStorage.setItem('admissionPrefillPatient', JSON.stringify(preselectedPatient));
//     navigate('/admissions', {
//       state: { preselectedPatient },
//     });
//   };

//   const handleRestorePatient = async (patient) => {
//     try {
//       await apiRequest(`/api/v1/patients/patients/${patient.id}/`, {
//         method: 'PATCH',
//         body: JSON.stringify({ patient_status: 'active', is_active: true }),
//       });
//       await loadPatients('/api/v1/patients/patients/');
//     } catch (err) {
//       console.error('Failed to restore patient:', err);
//       alert(err.message || 'Failed to restore patient');
//     }
//   };

//   const handleClosePatientModal = () => {
//     setShowPatientModal(false);
//     setSelectedPatient(null);
//   };

//   const getPatientCondition = (patient) => {
//     if (patient.chronic_conditions) {
//       const conditions = patient.chronic_conditions.split(',').map(c => c.trim());
//       return conditions[0] || 'Under observation';
//     }
//     if (patient.notes) {
//       const noteLines = patient.notes.split('\n').filter(line => line.trim());
//       if (noteLines.length > 0) {
//         return noteLines[0].substring(0, 30) + (noteLines[0].length > 30 ? '...' : '');
//       }
//     }
//     if (patient.known_allergies) {
//       return 'Allergy: ' + patient.known_allergies.split(',')[0].trim();
//     }
//     return 'Active patient';
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     try {
//       return new Date(date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch {
//       return 'N/A';
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       'Stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
//       'Critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
//       'Improving': { label: 'Improving', color: 'bg-blue-100 text-blue-800' },
//       'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
//       'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
//       'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
//       'Normal': { label: 'Normal', color: 'bg-green-100 text-green-800' },
//       'Abnormal': { label: 'Abnormal', color: 'bg-red-100 text-red-800' },
//       'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
//       'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
//       'archived': { label: 'Archived', color: 'bg-gray-100 text-gray-800' },
//       'scheduled': { label: 'Scheduled', color: 'bg-gray-100 text-gray-800' },
//       'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
//     };
//     return statusMap[status] || { label: status || 'Active', color: 'bg-green-100 text-green-800' };
//   };

//   const getPriorityBadge = (priority) => {
//     const priorityMap = {
//       'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
//       'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
//       'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
//       'low': { label: 'Low', color: 'bg-blue-100 text-blue-800' }
//     };
//     return priorityMap[priority] || { label: priority, color: 'bg-gray-100 text-gray-800' };
//   };

//   const quickActions = [
//     { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-blue-500' },
//     { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-green-500' },
//     { icon: Pill, label: 'Medications', action: '/pharmacy', color: 'bg-purple-500' },
//     { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-orange-500' },
//     { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-red-500' },
//     { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-pink-500' },
//   ];

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: Home },
//     { id: 'patients', label: 'Patients', icon: Users },
//     { id: 'tasks', label: 'Tasks', icon: Clipboard },
//     { id: 'vitals', label: 'Vital Signs', icon: Activity },
//     { id: 'schedule', label: 'Schedule', icon: Calendar },
//   ];

//   const totalItems = patientsCount || patientsList.length;
//   const totalPages = Math.ceil(totalItems / 20);
//   const startIndex = patientsList.length > 0 ? (totalItems - patientsList.length + 1) : 0;
//   const endIndex = startIndex + patientsList.length - 1;

//   // Render tab content
//   const renderTabContent = () => {
//     switch(activeTab) {
//       case 'overview':
//         return renderOverviewContent();
//       case 'patients':
//         return renderPatientsContent();
//       case 'tasks':
//         return renderTasksContent();
//       case 'vitals':
//         return renderVitalsContent();
//       case 'schedule':
//         return renderScheduleContent();
//       default:
//         return renderOverviewContent();
//     }
//   };

//   const renderOverviewContent = () => {
//     return (
//       <>
//         {/* Critical Alerts */}
//         {/* {alerts.filter(a => a.type === 'critical' && !a.read).length > 0 && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
//                 <div>
//                   <h3 className="text-sm font-semibold text-red-800">Critical Patient Alert</h3>
//                   <p className="text-sm text-red-700">
//                     {alerts.filter(a => a.type === 'critical' && !a.read).length} critical alert(s) require your attention
//                   </p>
//                 </div>
//               </div>
//               <ButtonWithTooltip
//                 onClick={() => alerts.filter(a => a.type === 'critical').forEach(a => handleMarkAlertRead(a.id))}
//                 tooltip="Mark all alerts as read"
//                 variant="secondary"
//               >
//                 Mark All Read
//               </ButtonWithTooltip>
//             </div>
//           </div>
//         )} */}

//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <Tooltip text="Total patients assigned to you">
//             <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 uppercase">Assigned Patients</p>
//                   <p className="mt-1 text-2xl font-bold text-gray-900">{stats.assignedPatients}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                   <Users className="w-5 h-5 text-blue-600" />
//                 </div>
//               </div>
//             </div>
//           </Tooltip>

//           <Tooltip text="Vital signs checks due">
//             <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 uppercase">Vitals Due</p>
//                   <p className="mt-1 text-2xl font-bold text-green-600">{stats.vitalsDue}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
//                   <Activity className="w-5 h-5 text-green-600" />
//                 </div>
//               </div>
//             </div>
//           </Tooltip>

//           <Tooltip text="Medication administration due">
//             <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 uppercase">Medications Due</p>
//                   <p className="mt-1 text-2xl font-bold text-purple-600">{stats.medicationsDue}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
//                   <Pill className="w-5 h-5 text-purple-600" />
//                 </div>
//               </div>
//             </div>
//           </Tooltip>

//           <Tooltip text="Bed checks due">
//             <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 uppercase">Bed Checks</p>
//                   <p className="mt-1 text-2xl font-bold text-orange-600">{stats.bedChecks}</p>
//                 </div>
//                 <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
//                   <Bed className="w-5 h-5 text-orange-600" />
//                 </div>
//               </div>
//             </div>
//           </Tooltip>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-6">
//           <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//             {quickActions.map((action, index) => {
//               const Icon = action.icon;
//               return (
//                 <Tooltip key={index} text={`Go to ${action.label}`}>
//                   <button
//                     onClick={() => navigate(action.action)}
//                     className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center h-16 sm:h-20`}
//                   >
//                     <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
//                     <span className="text-[10px] sm:text-xs font-medium text-center">{action.label}</span>
//                   </button>
//                 </Tooltip>
//               );
//             })}
//           </div>
//         </div>

//         {/* Recent Alerts */}
//         <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-gray-900">Recent Alerts</h2>
//             <div className="flex items-center gap-2">
//               <ButtonWithTooltip
//                 onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
//                 tooltip="Mark all alerts as read"
//                 variant="secondary"
//                 className="text-xs"
//               >
//                 <CheckCircle className="w-3.5 h-3.5" />
//                 Mark All Read
//               </ButtonWithTooltip>
//             </div>
//           </div>
//           <div className="space-y-2">
//             {alerts.length === 0 ? (
//               <div className="text-center py-8">
//                 <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                 <p className="text-gray-500 text-sm">No alerts</p>
//               </div>
//             ) : (
//               alerts.map((alert) => (
//                 <div key={alert.id} className={`flex items-center justify-between rounded-lg p-3 ${
//                   alert.type === 'critical' ? 'border-l-4 border-red-500 bg-red-50' :
//                   alert.type === 'warning' ? 'border-l-4 border-yellow-500 bg-yellow-50' :
//                   'border-l-4 border-blue-500 bg-blue-50'
//                 } ${alert.read ? 'opacity-60' : ''}`}>
//                   <div className="flex items-center flex-1">
//                     <AlertCircle className={`mr-3 h-5 w-5 flex-shrink-0 ${
//                       alert.type === 'critical' ? 'text-red-500' :
//                       alert.type === 'warning' ? 'text-yellow-500' :
//                       'text-blue-500'
//                     }`} />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{alert.message}</p>
//                       <p className="text-xs text-gray-500">{alert.time}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {!alert.read && (
//                       <IconButton
//                         icon={CheckCircle}
//                         onClick={() => handleMarkAlertRead(alert.id)}
//                         tooltip="Mark as read"
//                         variant="success"
//                       />
//                     )}
//                     <IconButton
//                       icon={X}
//                       onClick={() => handleDismissAlert(alert.id)}
//                       tooltip="Dismiss alert"
//                       variant="default"
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </>
//     );
//   };

//   const renderPatientsContent = () => {
//     if (patientsLoading) {
//       return (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="text-gray-500 text-sm mt-2">Loading patients...</p>
//         </div>
//       );
//     }

//     return (
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-semibold text-gray-900">Assigned Patients</h2>
//           <div className="flex items-center gap-2">
//             <ButtonWithTooltip
//               tooltip="Refresh patient list"
//               variant="secondary"
//               onClick={handleRefresh}
//             >
//               <RefreshCw className={`w-3.5 h-3.5 ${patientsLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               tooltip="View all patients"
//               variant="secondary"
//               onClick={() => navigate('/patients')}
//             >
//               <Users className="w-3.5 h-3.5" />
//               View All
//             </ButtonWithTooltip>
//           </div>
//         </div>

//         {patientsList.length === 0 ? (
//           <div className="text-center py-8">
//             <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//             <p className="text-gray-500 text-sm">No patients found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                   <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
//                   <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Condition</th>
//                   <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
//                   <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {patientsList.map((patient) => {
//                   const status = getStatusBadge(patient.status);
//                   const isInactive = (patient.patient_status || patient.status) !== 'active';
//                   return (
//                     <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
//                             {patient.name && patient.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <span className="text-sm font-medium text-gray-900">{patient.name || 'Unnamed Patient'}</span>
//                             {patient.age && (
//                               <span className="text-xs text-gray-500 ml-1">({patient.age}y)</span>
//                             )}
//                             {patient.hospital_number && (
//                               <div className="text-[10px] text-gray-400">HN: {patient.hospital_number}</div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 hidden sm:table-cell">
//                         <div className="text-xs text-gray-600">{patient.phone || 'No phone'}</div>
//                         <div className="text-[10px] text-gray-400">{patient.email || 'No email'}</div>
//                       </td>
//                       <td className="py-3 hidden md:table-cell">
//                         <span className="text-xs text-gray-600">{getPatientCondition(patient)}</span>
//                         {patient.bloodType && (
//                           <div className="text-[10px] text-gray-400">Blood: {patient.bloodType}</div>
//                         )}
//                       </td>
//                       <td className="py-3">
//                         <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
//                           {status.label}
//                         </span>
//                       </td>
//                       <td className="py-3 hidden lg:table-cell">
//                         <span className="text-xs text-gray-600">
//                           {formatDate(patient.last_visit || patient.lastVisit || patient.registration_date)}
//                         </span>
//                       </td>
//                       <td className="py-3">
//                         <div className="flex items-center gap-1 flex-wrap">
//                           <IconButton
//                             icon={Eye}
//                             onClick={() => handleViewPatient(patient)}
//                             tooltip="View patient details"
//                             variant="primary"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleCreateAdmissionForPatient(patient)}
//                             className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700 hover:bg-green-100"
//                           >
//                             <Plus className="w-3 h-3" />
//                             Admit
//                           </button>
//                           <IconButton
//                             icon={Activity}
//                             onClick={() => navigate(`/vital-signs/${patient.id}`)}
//                             tooltip="Record vitals"
//                             variant="success"
//                           />
//                           <IconButton
//                             icon={Pill}
//                             onClick={() => navigate(`/pharmacy/${patient.id}`)}
//                             tooltip="View medications"
//                             variant="info"
//                           />
//                           {isInactive && (
//                             <IconButton
//                               icon={RotateCcw}
//                               onClick={() => handleRestorePatient(patient)}
//                               tooltip="Restore patient"
//                               variant="success"
//                             />
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
//               <div className="text-[10px] sm:text-xs text-gray-500">
//                 Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
//               </div>
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <IconButton
//                   icon={ChevronLeft}
//                   onClick={() => patientsPreviousPage && loadPatients(patientsPreviousPage)}
//                   tooltip="Previous page"
//                   variant="default"
//                   disabled={!patientsPreviousPage || patientsLoading}
//                 />
//                 <span className="text-[10px] sm:text-xs text-gray-600">
//                   Page {patientsList.length > 0 ? Math.ceil((totalItems - patientsList.length + 1) / 20) : 0} of {totalPages || 1}
//                 </span>
//                 <IconButton
//                   icon={ChevronRight}
//                   onClick={() => patientsNextPage && loadPatients(patientsNextPage)}
//                   tooltip="Next page"
//                   variant="default"
//                   disabled={!patientsNextPage || patientsLoading}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Patient Detail Modal */}
//         {showPatientModal && selectedPatient && (
//           <PatientDetailModal 
//             patient={selectedPatient} 
//             onClose={handleClosePatientModal} 
//           />
//         )}
//       </div>
//     );
//   };

//   const renderTasksContent = () => {
//     return (
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-semibold text-gray-900">Today's Tasks</h2>
//           <ButtonWithTooltip
//             onClick={() => setShowTaskForm(true)}
//             tooltip="Add new task"
//             variant="primary"
//           >
//             <Plus className="w-3.5 h-3.5" />
//             Add Task
//           </ButtonWithTooltip>
//         </div>

//         {/* Task Form */}
//         {showTaskForm && (
//           <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-sm font-semibold text-gray-900">
//                 {editingTaskId ? 'Edit Task' : 'New Task'}
//               </h3>
//               <IconButton
//                 icon={X}
//                 onClick={() => {
//                   setShowTaskForm(false);
//                   resetTaskForm();
//                 }}
//                 tooltip="Close form"
//                 variant="default"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-700">Patient</label>
//                 <input
//                   type="text"
//                   value={taskForm.patient}
//                   onChange={(e) => setTaskForm({...taskForm, patient: e.target.value})}
//                   placeholder="Patient name"
//                   className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-700">Room</label>
//                 <input
//                   type="text"
//                   value={taskForm.room}
//                   onChange={(e) => setTaskForm({...taskForm, room: e.target.value})}
//                   placeholder="Room number"
//                   className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-700">Task</label>
//                 <input
//                   type="text"
//                   value={taskForm.task}
//                   onChange={(e) => setTaskForm({...taskForm, task: e.target.value})}
//                   placeholder="Task description"
//                   className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-700">Due Time</label>
//                 <input
//                   type="time"
//                   value={taskForm.due}
//                   onChange={(e) => setTaskForm({...taskForm, due: e.target.value})}
//                   className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-xs font-medium text-gray-700">Priority</label>
//                 <select
//                   value={taskForm.priority}
//                   onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
//                   className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
//                 >
//                   <option value="critical">Critical</option>
//                   <option value="high">High</option>
//                   <option value="medium">Medium</option>
//                   <option value="low">Low</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-4 flex justify-end gap-2">
//               <ButtonWithTooltip
//                 onClick={() => {
//                   setShowTaskForm(false);
//                   resetTaskForm();
//                 }}
//                 tooltip="Cancel and close"
//                 variant="secondary"
//               >
//                 Cancel
//               </ButtonWithTooltip>
//               <ButtonWithTooltip
//                 onClick={handleSaveTask}
//                 tooltip="Save task"
//                 variant="primary"
//               >
//                 <CheckCircle className="w-3.5 h-3.5" />
//                 Save Task
//               </ButtonWithTooltip>
//             </div>
//           </div>
//         )}

//         {/* Tasks List */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {tasks.map((task) => {
//                 const status = getStatusBadge(task.status);
//                 const priority = getPriorityBadge(task.priority);
//                 return (
//                   <tr key={task.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="py-3">
//                       <span className="text-sm font-medium text-gray-900">{task.patient}</span>
//                       <span className="text-xs text-gray-500 ml-2">Room {task.room}</span>
//                     </td>
//                     <td className="py-3 text-sm text-gray-600">{task.task}</td>
//                     <td className="py-3 text-sm text-gray-600">{task.due}</td>
//                     <td className="py-3">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priority.color}`}>
//                         {priority.label}
//                       </span>
//                     </td>
//                     <td className="py-3">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
//                         {status.label}
//                       </span>
//                     </td>
//                     <td className="py-3">
//                       <div className="flex items-center gap-1">
//                         {task.status === 'pending' && (
//                           <IconButton
//                             icon={Play}
//                             onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
//                             tooltip="Start task"
//                             variant="success"
//                           />
//                         )}
//                         {task.status === 'in-progress' && (
//                           <IconButton
//                             icon={CheckCircle}
//                             onClick={() => handleTaskStatusChange(task.id, 'completed')}
//                             tooltip="Complete task"
//                             variant="success"
//                           />
//                         )}
//                         <IconButton
//                           icon={Edit}
//                           onClick={() => handleEditTask(task)}
//                           tooltip="Edit task"
//                           variant="primary"
//                         />
//                         <IconButton
//                           icon={Trash2}
//                           onClick={() => handleDeleteTask(task.id)}
//                           tooltip="Delete task"
//                           variant="danger"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const renderVitalsContent = () => {
//     const totalPages = Math.ceil(dashboardVitals.length / vitalsPerPage);
//     const start = (vitalsCurrentPage - 1) * vitalsPerPage;
//     const pageVitals = dashboardVitals.slice(start, start + vitalsPerPage);

//     return (
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-semibold text-gray-900">Vital Signs Records</h2>
//           <div className="flex items-center gap-2">
//             <ButtonWithTooltip
//               tooltip="Go to full vital signs monitoring"
//               variant="secondary"
//               onClick={() => navigate('/vital-signs')}
//             >
//               <Activity className="w-3.5 h-3.5" />
//               Full Monitor
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               tooltip="Record new vitals"
//               variant="primary"
//               onClick={() => navigate('/vital-signs')}
//             >
//               <Plus className="w-3.5 h-3.5" />
//               Record Vitals
//             </ButtonWithTooltip>
//           </div>
//         </div>

//         {vitalsError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//             {vitalsError}
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO₂</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded</th>
//                 <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {vitalsLoading ? (
//                 <tr>
//                   <td colSpan={7} className="py-8 text-center text-gray-500">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//                     Loading vital signs...
//                   </td>
//                 </tr>
//               ) : pageVitals.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="py-8 text-center text-gray-500">
//                     No vital signs recorded yet.
//                   </td>
//                 </tr>
//               ) : (
//                 pageVitals.map((vital) => (
//                   <tr key={vital.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="py-3">
//                       <span className="text-sm font-medium text-gray-900">{vital.patient_name || `Patient ${vital.patient}`}</span>
//                     </td>
//                     <td className="py-3 text-sm text-gray-600">{vital.blood_pressure_display || `${vital.blood_pressure_systolic || '-'}/${vital.blood_pressure_diastolic || '-'}`}</td>
//                     <td className="py-3 text-sm text-gray-600">{vital.pulse || '-'} bpm</td>
//                     <td className="py-3 text-sm text-gray-600">{vital.temperature || '-'}°C</td>
//                     <td className="py-3 text-sm text-gray-600">{vital.oxygen_saturation || '-'}%</td>
//                     <td className="py-3 text-sm text-gray-600">
//                       {vital.recorded_at ? new Date(vital.recorded_at).toLocaleString('en-NG') : '-'}
//                     </td>
//                     <td className="py-3">
//                       <div className="flex items-center gap-1">
//                         <IconButton
//                           icon={Eye}
//                           onClick={() => navigate(`/vital-signs?highlight=${vital.id}`)}
//                           tooltip="View in monitor"
//                           variant="primary"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//             <div className="text-xs text-gray-500">
//               Showing {start + 1} to {Math.min(start + vitalsPerPage, dashboardVitals.length)} of {dashboardVitals.length}
//             </div>
//             <div className="flex items-center gap-2">
//               <IconButton
//                 icon={ChevronLeft}
//                 onClick={() => setVitalsCurrentPage(p => Math.max(1, p - 1))}
//                 tooltip="Previous page"
//                 variant="default"
//                 disabled={vitalsCurrentPage === 1}
//               />
//               <span className="text-xs text-gray-600">Page {vitalsCurrentPage} of {totalPages}</span>
//               <IconButton
//                 icon={ChevronRight}
//                 onClick={() => setVitalsCurrentPage(p => Math.min(totalPages, p + 1))}
//                 tooltip="Next page"
//                 variant="default"
//                 disabled={vitalsCurrentPage === totalPages}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderScheduleContent = () => {
//     return (
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm font-semibold text-gray-900">Appointments</h2>
//           <div className="flex items-center gap-2">
//             <ButtonWithTooltip
//               tooltip="View full schedule"
//               variant="secondary"
//               onClick={() => navigate('/appointments')}
//             >
//               <Calendar className="w-3.5 h-3.5" />
//               Full Schedule
//             </ButtonWithTooltip>
//           </div>
//         </div>

//         {scheduleLoading ? (
//           <div className="text-center py-8">
//             <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2 animate-pulse" />
//             <p className="text-gray-500 text-sm">Loading schedule...</p>
//           </div>
//         ) : scheduleError ? (
//           <div className="text-center py-8">
//             <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-2" />
//             <p className="text-red-600 text-sm font-medium">{scheduleError}</p>
//             <button
//               onClick={() => {
//                 apiRequest('/api/v1/patients/appointments/').then(data => {
//                   const results = Array.isArray(data) ? data : (data.results || []);
//                   const mapped = results.map(apt => ({
//                     id: apt.id,
//                     patientName: apt.patient_name || 'Unknown Patient',
//                     patientId: apt.patient || '',
//                     date: apt.scheduled_date || '',
//                     time: formatTime(apt.scheduled_time),
//                     timeRaw: apt.scheduled_time ? apt.scheduled_time.substring(0, 5) : '',
//                     reason: apt.reason || '',
//                     doctor: apt.doctor_name || '',
//                     doctorId: apt.doctor || '',
//                     status: normalizeAppointmentStatus(apt.status),
//                     notes: apt.notes || '',
//                     phone: apt.patient_phone || '',
//                     email: apt.patient_email || '',
//                     appointment_type: apt.appointment_type || 'consultation',
//                   }));
//                   setTodaysSchedule(mapped);
//                   setScheduleError(null);
//                 }).catch(err => setScheduleError(err.message));
//               }}
//               className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
//             >
//               Retry
//             </button>
//           </div>
//         ) : todaysSchedule.length === 0 ? (
//           <div className="text-center py-8">
//             <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
//             <p className="text-gray-500 text-sm">No appointments found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto -mx-3 sm:mx-0">
//             <table className="w-full min-w-[640px] lg:min-w-0">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                   <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
//                   <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Doctor</th>
//                   <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reason</th>
//                   <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {todaysSchedule.map((appointment) => (
//                   <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="py-2 sm:py-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-medium text-sm">
//                           {(appointment.patientName || '?').charAt(0).toUpperCase()}
//                         </div>
//                         <div className="min-w-0">
//                           <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">{appointment.patientName}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-2 sm:py-3 hidden sm:table-cell">
//                       <div className="text-xs sm:text-sm text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
//                           <span className="whitespace-nowrap">{new Date(appointment.date).toLocaleDateString('en-NG')}</span>
//                         </div>
//                         <div className="flex items-center gap-1 text-gray-500">
//                           <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
//                           <span className="whitespace-nowrap">{appointment.time}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-2 sm:py-3 hidden md:table-cell">
//                       <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] block">{appointment.doctor || 'N/A'}</span>
//                     </td>
//                     <td className="py-2 sm:py-3 hidden lg:table-cell">
//                       <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] block">{appointment.reason || 'N/A'}</span>
//                     </td>
//                     <td className="py-2 sm:py-3">
//                       <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                         appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
//                         appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
//                         appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {appointment.status === 'in-progress' ? 'In Progress' : 
//                          appointment.status === 'completed' ? 'Completed' : 
//                          appointment.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
//                       </span>
//                     </td>
//                     <td className="py-2 sm:py-3">
//                       <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
//                         <IconButton
//                           icon={Eye}
//                           onClick={() => navigate('/appointments')}
//                           tooltip="View appointment"
//                           variant="primary"
//                         />
//                         <IconButton
//                           icon={Edit}
//                           onClick={() => navigate('/appointments')}
//                           tooltip="Edit appointment"
//                           variant="primary"
//                         />
//                         <div className="relative">
//                           <IconButton
//                             icon={MoreVertical}
//                             onClick={() => setShowStatusMenu(showStatusMenu === appointment.id ? null : appointment.id)}
//                             tooltip="Change status"
//                             variant="default"
//                           />
//                           {showStatusMenu === appointment.id && (
//                             <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
//                               <button
//                                 onClick={() => handleStatusChange(appointment.id, 'scheduled')}
//                                 className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
//                               >
//                                 <Clock className="w-3 h-3 text-blue-500" />
//                                 Scheduled
//                               </button>
//                               <button
//                                 onClick={() => handleStatusChange(appointment.id, 'completed')}
//                                 className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
//                               >
//                                 <CheckCircle className="w-3 h-3 text-green-500" />
//                                 Completed
//                               </button>
//                               <button
//                                 onClick={() => handleStatusChange(appointment.id, 'cancelled')}
//                                 className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
//                               >
//                                 <X className="w-3 h-3 text-red-500" />
//                                 Cancelled
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                         <IconButton
//                           icon={Trash2}
//                           onClick={() => navigate('/appointments')}
//                           tooltip="Delete appointment"
//                           variant="danger"
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="dashboard min-h-screen bg-gray-50 p-4 sm:p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
//               {dashboardProfilePicture ? (
//                 <img
//                   key={dashboardProfilePicture}
//                   src={dashboardProfilePicture}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     const fallback = e.target.parentElement?.querySelector('.profile-fallback');
//                     if (fallback) fallback.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
//               <div className="w-full h-full items-center justify-center profile-fallback" style={{ display: dashboardProfilePicture ? 'none' : 'flex' }}>
//                 <UserIcon className="w-5 h-5 text-gray-400" />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Welcome back, {displayUserName}
//               </h1>
//               <p className="text-sm text-gray-500">
//                 {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <ButtonWithTooltip
//               onClick={handleRefresh}
//               tooltip="Refresh dashboard"
//               variant="secondary"
//             >
//               <RefreshCw className={`w-4 h-4 ${patientsLoading ? 'animate-spin' : ''}`} />
//               <span className="hidden sm:inline">Refresh</span>
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               tooltip="View notifications"
//               variant="secondary"
//               className="relative"
//             >
//               <Bell className="w-4 h-4" />
//               {alerts.filter(a => !a.read).length > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
//                   {alerts.filter(a => !a.read).length}
//                 </span>
//               )}
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               tooltip="My Profile"
//               variant="secondary"
//               onClick={handleOpenProfile}
//             >
//               <UserIcon className="w-4 h-4" />
//               <span className="hidden sm:inline">Profile</span>
//             </ButtonWithTooltip>
//             <ButtonWithTooltip
//               onClick={handleOpenChangePassword}
//               tooltip="Change Password"
//               variant="secondary"
//             >
//               <Settings className="w-4 h-4" />
//               <span className="hidden sm:inline">Change Password</span>
//             </ButtonWithTooltip>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200 mb-6 overflow-x-auto">
//         <nav className="flex gap-4 min-w-max" aria-label="Tabs">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <Tooltip key={tab.id} text={`View ${tab.label}`}>
//                 <button
//                   onClick={() => {
//                     setActiveTab(tab.id);
//                     setCurrentPage(1);
//                   }}
//                   className={`flex items-center gap-1.5 px-1 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                     activeTab === tab.id
//                       ? 'border-blue-600 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   {tab.label}
//                 </button>
//               </Tooltip>
//             );
//           })}
//         </nav>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
//         {renderTabContent()}
//       </div>

//       {/* Profile Modal */}
//       {showProfileModal && (
//         <ProfileModal
//           isOpen={showProfileModal}
//           onClose={() => setShowProfileModal(false)}
//           profileData={profileData}
//           onChange={handleProfileChange}
//           onSave={handleSaveProfile}
//           loading={profileLoading}
//           saving={profileSaving}
//           error={profileError}
//           success={profileSuccess}
//           specializations={specializations}
//           specializationsLoading={specializationsLoading}
//           profilePicturePreview={profilePicturePreview}
//           onProfilePictureChange={handleProfileChange}
//         />
//       )}

//       {/* Patient Detail Modal */}
//       {showPatientModal && selectedPatient && (
//         <PatientDetailModal 
//           patient={selectedPatient} 
//           onClose={handleClosePatientModal} 
//         />
//       )}

//       <ChangePasswordModal
//         isOpen={showChangePasswordModal}
//         onClose={() => setShowChangePasswordModal(false)}
//         saving={passwordLoading}
//         error={passwordError}
//         success={passwordSuccess}
//         onChange={handlePasswordChange}
//         onSave={handleChangePassword}
//       />
//     </div>
//   );
// };

// export default NurseDashboard;

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import ChangePasswordModal from '../ChangePasswordModal';
import MyRosterTab from './MyRosterTab';
import {
  Users,
  Activity,
  Pill,
  Bed,
  RotateCcw,
  Heart,
  Stethoscope,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  UserPlus,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Home,
  Briefcase,
  Clipboard,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Calendar,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  RefreshCw,
  Play,
  Pause,
  Square,
  Zap,
  Shield,
  Star,
  Award,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  Phone,
  MapPin,
  Building2,
  User as UserIcon,
  Upload,
  Loader2,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Stethoscope as StethoscopeIcon,
} from 'lucide-react';

// ==================== TOOLTIP COMPONENT ====================
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(!show)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap`}>
          <div className="bg-[#1A1A1A] text-white text-[10px] px-2 py-1 shadow-lg">
            {text}
            <div className={`absolute w-1.5 h-1.5 bg-[#1A1A1A] transform rotate-45 ${
              position === 'top' ? 'bottom-[-3px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-3px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-3px] top-1/2 -translate-y-1/2' :
              'left-[-3px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== ICON BUTTON ====================
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false, size = 'sm' }) => {
  const variantClasses = {
    default: 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]',
    primary: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
    success: 'text-[#2D7D46] hover:text-[#1E5F33] hover:bg-[#EAF3EE]',
    danger: 'text-[#C8553D] hover:text-[#A8442E] hover:bg-[#F5EDEA]',
    warning: 'text-[#C87D3D] hover:text-[#A8662E] hover:bg-[#F5F0EA]',
    info: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`rounded transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    </Tooltip>
  );
};

// ==================== BUTTON WITH TOOLTIP ====================
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false, size = 'sm', type = 'button' }) => {
  const variantClasses = {
    primary: 'bg-[#008751] hover:bg-[#006B40] text-white',
    secondary: 'bg-white border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    success: 'bg-[#2D7D46] hover:bg-[#1E5F33] text-white',
    danger: 'bg-[#C8553D] hover:bg-[#A8442E] text-white',
    warning: 'bg-[#C87D3D] hover:bg-[#A8662E] text-white',
    outline: 'border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded transition-all duration-200 flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, icon: Icon, color, tooltip, onClick }) => {
  const colorMap = {
    green: 'bg-[#008751]',
    gold: 'bg-[#FFC107]',
    terracotta: 'bg-[#C8553D]',
    warm: 'bg-[#C87D3D]',
    slate: 'bg-[#4A5A5A]',
    blue: 'bg-[#0D6B6B]',
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white border border-[#E8E3DC] p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
          </div>
          <div className={`w-10 h-10 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// ==================== PROFILE MODAL ====================
const ProfileModal = ({ isOpen, onClose, profileData, onChange, onSave, loading, saving, error, success, specializations, specializationsLoading, profilePicturePreview, onProfilePictureChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div className="border-b border-[#E8E3DC] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-[#1A1A1A]">My Profile</h2>
                <p className="text-sm text-[#5A5A5A] mt-0.5">View and update your personal information</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#E8E3DC] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {(error || success) && (
              <div className={`mb-4 p-3 text-sm whitespace-pre-line ${error ? 'bg-[#F5EDEA] text-[#C8553D] border border-[#E8D6D0]' : 'bg-[#EAF3EE] text-[#2D7D46] border border-[#D0E3D8]'}`}>
                {error || success}
              </div>
            )}

            {!loading && (
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#E8E3DC] border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden">
                    {profilePicturePreview ? (
                      <img
                        key={profilePicturePreview}
                        src={profilePicturePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement?.querySelector('.profile-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full items-center justify-center profile-fallback" style={{ display: profilePicturePreview ? 'none' : 'flex' }}>
                      <UserIcon className="w-12 h-12 text-[#5A5A5A]" />
                    </div>
                  </div>
                </div>
                <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D8D4CD] text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors">
                  <Upload className="w-4 h-4" />
                  {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          onProfilePictureChange('profile_picture_file', null);
                          setErrorMessage('Image must be less than 5MB');
                          return;
                        }
                        onProfilePictureChange('profile_picture_file', file);
                      }
                    }}
                  />
                </label>
                {profilePicturePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      onProfilePictureChange('profile_picture_file', null);
                    }}
                    className="mt-1 text-xs text-[#C8553D] hover:text-[#A8442E]"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[#5A5A5A] text-sm mt-2">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">First Name *</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => onChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => onChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => onChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={profileData.employee_id}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Department</label>
                    <input
                      type="text"
                      value={profileData.department_name}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Designation</label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) => onChange('designation', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">License Number</label>
                    <input
                      type="text"
                      value={profileData.license_number}
                      onChange={(e) => onChange('license_number', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Specialization</label>
                    <select
                      value={profileData.specialization}
                      onChange={(e) => onChange('specialization', e.target.value)}
                      disabled={specializationsLoading}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors disabled:bg-[#F0EDE8] disabled:text-[#5A5A5A]"
                    >
                      <option value="">-- Select specialization --</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Qualification</label>
                  <textarea
                    value={profileData.qualification}
                    onChange={(e) => onChange('qualification', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8E3DC] p-4 flex flex-wrap justify-end gap-2 bg-white">
            <ButtonWithTooltip
              onClick={onClose}
              tooltip="Close profile editor"
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={onSave}
              tooltip="Save profile changes"
              variant="primary"
              disabled={saving}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PATIENT DETAIL MODAL ====================
const PatientDetailModal = ({ patient, onClose, onJourney }) => {
  if (!patient) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'active': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'inactive': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'archived': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'critical': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      'stable': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'monitoring': 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
    };
    return statusMap[status?.toLowerCase()] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === 'male') return <UserIcon className="w-4 h-4 text-[#008751]" />;
    if (gender?.toLowerCase() === 'female') return <UserIcon className="w-4 h-4 text-[#C8553D]" />;
    return <UserCircle className="w-4 h-4 text-[#5A5A5A]" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div className="border-b border-[#E8E3DC] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F5EF] flex items-center justify-center text-2xl font-display font-bold text-[#008751] border-2 border-[#C8E0D5]">
                  {getInitials(patient.name)}
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-[#1A1A1A]">{patient.name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-[#5A5A5A]">
                    <span className="flex items-center gap-1">
                      {getGenderIcon(patient.gender)}
                      {patient.gender || 'Not specified'}
                    </span>
                    {patient.age && (
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {patient.age} years
                      </span>
                    )}
                    {patient.mrn && (
                      <span className="flex items-center gap-1">
                        <IdCard className="w-3.5 h-3.5" />
                        MRN: {patient.mrn}
                      </span>
                    )}
                    {patient.hospital_number && (
                      <span className="flex items-center gap-1">
                        <IdCard className="w-3.5 h-3.5" />
                        HN: {patient.hospital_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#E8E3DC] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(patient.status)}`}>
                {patient.status || 'Active'}
              </span>
              {patient.bloodType && (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium border border-[#E8D6D0] bg-[#F5EDEA] text-[#C8553D]">
                  <Droplets className="w-3 h-3 mr-1" />
                  {patient.bloodType}
                </span>
              )}
              {patient.genotype && (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium border border-[#E8E3DC] bg-[#F0EDE8] text-[#5A5A5A]">
                  <Brain className="w-3 h-3 mr-1" />
                  Genotype: {patient.genotype}
                </span>
              )}
              {patient.has_insurance && (
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium border border-[#D0E3D8] bg-[#EAF3EE] text-[#2D7D46]">
                  <Shield className="w-3 h-3 mr-1" />
                  Insured
                </span>
              )}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E8E3DC] p-4">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-[#008751]" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Full Name</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Date of Birth</span>
                    <span className="font-medium text-[#1A1A1A]">{formatDate(patient.dateOfBirth)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Age</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.age || 'N/A'} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Gender</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">NIN</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.nin || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Marital Status</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.maritalStatus || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Religion</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.religion || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Ethnicity</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.tribe || patient.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Occupation</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.occupation || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E3DC] p-4">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#2D7D46]" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Phone</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Email</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Address</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.address || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F0EDE8]">
                  <h4 className="text-xs font-semibold text-[#5A5A5A] mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C87D3D]" />
                    Location
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A5A5A]">Country</span>
                      <span className="font-medium text-[#1A1A1A]">{patient.country || 'Nigeria'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A5A5A]">State</span>
                      <span className="font-medium text-[#1A1A1A]">{patient.state || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A5A5A]">LGA</span>
                      <span className="font-medium text-[#1A1A1A]">{patient.lga || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A5A5A]">City</span>
                      <span className="font-medium text-[#1A1A1A]">{patient.city || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E3DC] p-4">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#C8553D]" />
                  Medical Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Blood Group</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.bloodType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Genotype</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.genotype || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Known Allergies</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.known_allergies || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Chronic Conditions</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.chronic_conditions || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Current Medications</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.current_medications || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Surgical History</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.surgical_history || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Family History</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.family_history || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E3DC] p-4">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C87D3D]" />
                  Emergency Contact
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Contact Name</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.emergencyContact || patient.next_of_kin_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Contact Phone</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.emergencyPhone || patient.next_of_kin_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Relationship</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.next_of_kin_relationship || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Address</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.next_of_kin_address || 'N/A'}</span>
                  </div>
                </div>
                {patient.has_insurance && (
                  <div className="mt-4 pt-4 border-t border-[#F0EDE8]">
                    <h4 className="text-xs font-semibold text-[#5A5A5A] mb-2 flex items-center gap-2">
                      <IdCard className="w-3.5 h-3.5 text-[#008751]" />
                      Insurance Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5A5A5A]">Insurance Company</span>
                        <span className="font-medium text-[#1A1A1A]">{patient.insurance_company || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5A5A5A]">Policy Number</span>
                        <span className="font-medium text-[#1A1A1A]">{patient.insurance_policy_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5A5A5A]">NHIS Number</span>
                        <span className="font-medium text-[#1A1A1A]">{patient.nhis_number || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E8E3DC] p-4 md:col-span-2">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#008751]" />
                  Hospital Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Hospital Number</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.hospital_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Login ID</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.login_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Tenant/Hospital</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.tenant_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Registration Date</span>
                    <span className="font-medium text-[#1A1A1A]">{formatDate(patient.registration_date || patient.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Last Visit</span>
                    <span className="font-medium text-[#1A1A1A]">{formatDate(patient.last_visit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A5A5A]">Language Spoken</span>
                    <span className="font-medium text-[#1A1A1A]">{patient.language_spoken || 'N/A'}</span>
                  </div>
                </div>
                {patient.notes && (
                  <div className="mt-3 pt-3 border-t border-[#F0EDE8]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A5A5A]">Notes</span>
                      <span className="font-medium text-[#1A1A1A] text-right max-w-[60%]">{patient.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E8E3DC] p-4 flex flex-wrap justify-end gap-2 bg-white">
            <ButtonWithTooltip
              onClick={onJourney}
              tooltip="View patient journey and bill"
              variant="outline"
            >
              <Map className="w-3.5 h-3.5" />
              Journey & Bill
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={onClose}
              tooltip="Close patient details"
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => window.open(`/patients/${patient.id}/vitals`, '_blank')}
              tooltip="Record vitals"
              variant="primary"
            >
              <Activity className="w-3.5 h-3.5" />
              Record Vitals
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => window.open(`/patients/${patient.id}/emr`, '_blank')}
              tooltip="View medical records"
              variant="success"
            >
              <FileText className="w-3.5 h-3.5" />
              View EMR
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => window.open(`/patients/edit/${patient.id}`, '_blank')}
              tooltip="Edit patient"
              variant="warning"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN NURSE DASHBOARD COMPONENT ====================
const NurseDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const displayTenantName = authTenant?.name || 'Hospital';
  const displayUserName = authUser?.full_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'nurse';

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    employee_id: '',
    department_name: '',
    designation: '',
    license_number: '',
    specialization: '',
    qualification: '',
  });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [specializationsLoading, setSpecializationsLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [dashboardProfilePicture, setDashboardProfilePicture] = useState(authUser?.profile_picture || '');

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Appointment/Schedule State
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);

  // Patient Management State
  const [patientsList, setPatientsList] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [patientsNextPage, setPatientsNextPage] = useState(null);
  const [patientsPreviousPage, setPatientsPreviousPage] = useState(null);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    assignedPatients: 0,
    vitalsDue: 0,
    medicationsDue: 0,
    bedChecks: 0,
  });

  const [alerts, setAlerts] = useState([]);

  const [assignedPatients, setAssignedPatients] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [taskForm, setTaskForm] = useState({
    patient: '',
    room: '',
    task: '',
    due: '',
    priority: 'medium'
  });

  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitalsError, setVitalsError] = useState('');
  const [dashboardVitals, setDashboardVitals] = useState([]);
  const [vitalsCurrentPage, setVitalsCurrentPage] = useState(1);
  const vitalsPerPage = 10;

  useEffect(() => {
    const loadVitals = async () => {
      setVitalsLoading(true);
      setVitalsError('');
      try {
        const data = await apiRequest('/api/v1/clinical/vital-signs/?page_size=50');
        const list = Array.isArray(data) ? data : (data.results || []);
        setDashboardVitals(list);
      } catch (err) {
        setVitalsError(err.message || 'Failed to load vital signs.');
      } finally {
        setVitalsLoading(false);
      }
    };
    loadVitals();
  }, []);

  // Format time helper
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const normalizeAppointmentStatus = (status) => {
    const statusMap = {
      'scheduled': 'scheduled',
      'confirmed': 'scheduled',
      'checked_in': 'in-progress',
      'in_progress': 'in-progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'no_show': 'cancelled',
      'rescheduled': 'scheduled'
    };
    return statusMap[status] || status || 'scheduled';
  };

  // Load today's schedule
  useEffect(() => {
    const fetchTodaysSchedule = async () => {
      try {
        setScheduleLoading(true);
        setScheduleError(null);
        const data = await apiRequest('/api/v1/patients/appointments/');
        const results = Array.isArray(data) ? data : (data.results || []);
        const mapped = results.map(apt => ({
          id: apt.id,
          patientName: apt.patient_name || 'Unknown Patient',
          patientId: apt.patient || '',
          date: apt.scheduled_date || '',
          time: formatTime(apt.scheduled_time),
          timeRaw: apt.scheduled_time ? apt.scheduled_time.substring(0, 5) : '',
          reason: apt.reason || '',
          doctor: apt.doctor_name || '',
          doctorId: apt.doctor || '',
          status: normalizeAppointmentStatus(apt.status),
          notes: apt.notes || '',
          phone: apt.patient_phone || '',
          email: apt.patient_email || '',
          appointment_type: apt.appointment_type || 'consultation',
        }));
        setTodaysSchedule(mapped);
      } catch (err) {
        setScheduleError(err.message || 'Failed to load schedule');
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchTodaysSchedule();
  }, []);

  // Normalize patient for display
  const normalizePatientForDisplay = (patient) => {
    return {
      id: patient.id,
      name: patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient',
      first_name: patient.first_name || '',
      last_name: patient.last_name || '',
      nin: patient.nin || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      tribe: patient.ethnicity || patient.tribe || '',
      country: patient.country || 'Nigeria',
      lga: patient.lga || '',
      state: patient.state || '',
      city: patient.city || '',
      dateOfBirth: patient.date_of_birth || '',
      bloodType: patient.blood_group || patient.bloodType || '',
      gender: patient.gender || '',
      maritalStatus: patient.marital_status || patient.maritalStatus || '',
      occupation: patient.occupation || '',
      emergencyContact: patient.next_of_kin_name || '',
      emergencyPhone: patient.next_of_kin_phone || '',
      religion: patient.religion || '',
      status: patient.patient_status || patient.status || 'active',
      createdAt: patient.registration_date || patient.createdAt || new Date().toISOString(),
      updatedAt: patient.updated_at || patient.updatedAt || new Date().toISOString(),
      hospital_number: patient.hospital_number || '',
      mrn: patient.mrn || patient.mrn_number || patient.medical_record_number || '',
      login_id: patient.login_id || '',
      age: patient.age || '',
      full_name: patient.full_name || '',
      age_display: patient.age_display || '',
      tenant_name: patient.tenant_name || '',
      nhis_number: patient.nhis_number || '',
      middle_name: patient.middle_name || '',
      phone2: patient.phone2 || '',
      next_of_kin_relationship: patient.next_of_kin_relationship || '',
      next_of_kin_address: patient.next_of_kin_address || '',
      known_allergies: patient.known_allergies || '',
      chronic_conditions: patient.chronic_conditions || '',
      current_medications: patient.current_medications || '',
      surgical_history: patient.surgical_history || '',
      family_history: patient.family_history || '',
      has_insurance: patient.has_insurance || false,
      insurance_company: patient.insurance_company || '',
      insurance_policy_number: patient.insurance_policy_number || '',
      insurance_expiry: patient.insurance_expiry || null,
      ethnicity: patient.ethnicity || '',
      language_spoken: patient.language_spoken || '',
      patient_status: patient.patient_status || 'active',
      photo: patient.photo || null,
      notes: patient.notes || '',
      registration_date: patient.registration_date || '',
      last_visit: patient.last_visit || null,
      registered_by: patient.registered_by || null,
      is_active: patient.is_active !== undefined ? patient.is_active : true,
      tenant: patient.tenant || null,
      genotype: patient.genotype || '',
    };
  };

  // Load patients from API
  const loadPatients = async (url = '/api/v1/patients/patients/') => {
    try {
      setPatientsLoading(true);
      const data = await apiRequest(url);
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(normalizePatientForDisplay);
      setPatientsList(normalized);
      setPatientsCount(data.count || normalized.length);
      setPatientsNextPage(data.next || null);
      setPatientsPreviousPage(data.previous || null);
    } catch (err) {
      console.error('Failed to load patients:', err);
      setPatientsList([]);
      setPatientsCount(0);
    } finally {
      setPatientsLoading(false);
    }
  };

  const loadDashboardInsights = async () => {
    try {
      const data = await apiRequest('/api/v1/core/dashboard-insights/');
      if (data?.alerts) {
        const normalizedAlerts = (Array.isArray(data.alerts) ? data.alerts : []).map(alert => ({
          id: alert.id || Math.random(),
          type: alert.type || (alert.priority === 'high' ? 'critical' : 'info'),
          message: alert.title || alert.message || '',
          time: alert.time || '',
          read: false,
        }));
        setAlerts(normalizedAlerts);
      }
      if (data?.tasks) {
        const normalizedTasks = (Array.isArray(data.tasks) ? data.tasks : []).map(task => ({
          id: task.id || Math.random(),
          patient: task.description || '',
          room: '',
          task: task.title || '',
          due: '',
          status: 'pending',
          priority: task.priority || 'medium',
        }));
        setTasks(normalizedTasks.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load dashboard insights:', err);
    }
  };

  // Load patients when component mounts
  useEffect(() => {
    loadPatients('/api/v1/patients/patients/?status=all&page_size=20');
    loadDashboardInsights();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    loadDashboardInsights();
     loadPatients('/api/v1/patients/patients/?page_size=20');
  };

  // Update stats when patients or tasks change
  useEffect(() => {
    setStats({
      assignedPatients: patientsList.length || assignedPatients.length,
      vitalsDue: tasks.filter(t => t.task.includes('Vital') && t.status === 'pending').length,
      medicationsDue: tasks.filter(t => t.task.includes('Medication') && t.status === 'pending').length,
      bedChecks: tasks.filter(t => t.task.includes('Bed') && t.status === 'pending').length,
    });
  }, [patientsList, assignedPatients, tasks]);

  // Profile Handlers
  const handleOpenProfile = async () => {
    setShowProfileModal(true);
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    setSpecializationsLoading(true);
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setDashboardProfilePicture(authUser?.profile_picture || '');
    try {
      const [profileRes, specsRes] = await Promise.all([
        apiRequest('/api/v1/tenants/users/me/'),
        apiRequest('/api/v1/core/specializations/'),
      ]);
      const specList = Array.isArray(specsRes) ? specsRes : (specsRes.results || []);
      setSpecializations(specList.map(s => s.name));
      setProfileData({
        first_name: profileRes.first_name || '',
        last_name: profileRes.last_name || '',
        email: profileRes.email || '',
        phone: profileRes.phone || '',
        role: profileRes.role || '',
        employee_id: profileRes.employee_id || '',
        department_name: profileRes.department_name || '',
        designation: profileRes.designation || '',
        license_number: profileRes.license_number || '',
        specialization: profileRes.specialization || '',
        qualification: profileRes.qualification || '',
      });
      const pic = profileRes.profile_picture || '';
      const cached = localStorage.getItem('userProfilePicture') || '';
      const effectivePic = pic || cached;
      if (effectivePic) {
        const cacheBusted = effectivePic.includes('?') ? `${effectivePic}&t=${Date.now()}` : `${effectivePic}?t=${Date.now()}`;
        setProfilePicturePreview(cacheBusted);
        setDashboardProfilePicture(cacheBusted);
        localStorage.setItem('userProfilePicture', effectivePic);
      }
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        const friendlyMessages = Object.entries(err.data)
          .map(([field, errors]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const msg = Array.isArray(errors) ? errors[0] : errors;
            return `${fieldLabel}: ${msg}`;
          })
          .join('\n');
        setProfileError(friendlyMessages);
      } else {
        setProfileError(err.message || 'Failed to load profile. Please try again.');
      }
    } finally {
      setProfileLoading(false);
      setSpecializationsLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    if (field === 'profile_picture_file') {
      setProfilePictureFile(value);
      if (value) {
        const reader = new FileReader();
        reader.onload = (e) => setProfilePicturePreview(e.target.result);
        reader.readAsDataURL(value);
      } else {
        setProfilePicturePreview('');
      }
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileData.first_name.trim() || !profileData.last_name.trim()) {
      setProfileError('First name and last name are required.');
      setProfileSaving(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setProfileError('Please enter a valid email address.');
      setProfileSaving(false);
      return;
    }

    const trimmedSpecialization = profileData.specialization.trim();

    try {
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('first_name', profileData.first_name.trim());
        formData.append('last_name', profileData.last_name.trim());
        formData.append('email', profileData.email.trim());
        formData.append('phone', profileData.phone.trim());
        formData.append('designation', profileData.designation.trim());
        formData.append('license_number', profileData.license_number.trim());
        formData.append('specialization', trimmedSpecialization);
        formData.append('qualification', profileData.qualification.trim());
        formData.append('profile_picture', profilePictureFile);

        await apiRequest('/api/v1/tenants/users/me/', {
          method: 'PATCH',
          body: formData,
        });
      } else {
        const payload = {
          first_name: profileData.first_name.trim(),
          last_name: profileData.last_name.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone.trim(),
          designation: profileData.designation.trim(),
          license_number: profileData.license_number.trim(),
          specialization: trimmedSpecialization,
          qualification: profileData.qualification.trim(),
        };
        await apiRequest('/api/v1/tenants/users/me/', {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      }
      setProfileSuccess('Profile updated successfully');
      setProfilePictureFile(null);
      const refreshed = await apiRequest('/api/v1/tenants/users/me/');
      const pic = refreshed?.profile_picture || '';
      if (pic) {
        const cacheBusted = pic.includes('?') ? `${pic}&t=${Date.now()}` : `${pic}?t=${Date.now()}`;
        localStorage.setItem('userProfilePicture', pic);
        setDashboardProfilePicture(cacheBusted);
        setProfilePicturePreview(cacheBusted);
      } else {
        localStorage.removeItem('userProfilePicture');
        setDashboardProfilePicture('');
        setProfilePicturePreview('');
      }
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        const friendlyMessages = Object.entries(err.data)
          .map(([field, errors]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const msg = Array.isArray(errors) ? errors[0] : errors;
            if (field === 'email' && msg.includes('already exists')) {
              return `${fieldLabel}: This email address is already in use. Please choose a different one.`;
            }
            if (field === 'specialization' && msg.includes('not found')) {
              return `${fieldLabel}: "${trimmedSpecialization}" is not a recognized specialization.`;
            }
            return `${fieldLabel}: ${msg}`;
          })
          .join('\n');
        setProfileError(friendlyMessages);
      } else {
        setProfileError(err.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  // Password Change Handlers
  const handleOpenChangePassword = () => {
    setShowChangePasswordModal(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
      setPasswordError('Please fill in all password fields.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New password and confirm password do not match.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      setPasswordLoading(false);
      return;
    }

    try {
      await apiRequest('/api/v1/tenants/users/change_password/', {
        method: 'POST',
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });
      setPasswordSuccess('Password changed successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Status change handler for appointments
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await apiRequest(`/api/v1/patients/appointments/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      const statusMap = {
        'scheduled': 'scheduled',
        'confirmed': 'scheduled',
        'checked_in': 'in-progress',
        'in_progress': 'in-progress',
        'completed': 'completed',
        'cancelled': 'cancelled',
        'no_show': 'cancelled',
        'rescheduled': 'scheduled'
      };
      const normalized = { ...updated, status: statusMap[updated.status] || updated.status || 'scheduled' };
      setTodaysSchedule(prev => prev.map(apt => apt.id === id ? normalized : apt));
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update status');
    }
    setShowStatusMenu(null);
  };

  const handleMarkAlertRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleTaskStatusChange = (id, status) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleSaveTask = () => {
    if (!taskForm.patient || !taskForm.task) {
      setErrorMessage('Please fill in patient and task fields');
      return;
    }

    const newTask = {
      id: editingTaskId || Date.now(),
      ...taskForm,
      status: 'pending'
    };

    if (editingTaskId) {
      setTasks(prev => prev.map(task => 
        task.id === editingTaskId ? newTask : task
      ));
    } else {
      setTasks(prev => [newTask, ...prev]);
    }

    resetTaskForm();
    setShowTaskForm(false);
  };

  const resetTaskForm = () => {
    setTaskForm({
      patient: '',
      room: '',
      task: '',
      due: '',
      priority: 'medium'
    });
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setTaskForm({
      patient: task.patient,
      room: task.room,
      task: task.task,
      due: task.due,
      priority: task.priority
    });
    setEditingTaskId(task.id);
    setShowTaskForm(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handleCreateAdmissionForPatient = (patient) => {
    const preselectedPatient = {
      patientId: patient.hospital_number || patient.hospitalNumber || patient.patient_id || patient.id,
      patientName: patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      name: patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      phone: patient.phone || patient.phone_number,
      email: patient.email,
      id: patient.id,
    };

    sessionStorage.setItem('admissionPrefillPatient', JSON.stringify(preselectedPatient));
    navigate('/admissions', {
      state: { preselectedPatient },
    });
  };

  const handleRestorePatient = async (patient) => {
    try {
      await apiRequest(`/api/v1/patients/patients/${patient.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ patient_status: 'active', is_active: true }),
      });
      await loadPatients('/api/v1/patients/patients/');
    } catch (err) {
      console.error('Failed to restore patient:', err);
      setErrorMessage(err.message || 'Failed to restore patient');
    }
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const getPatientCondition = (patient) => {
    if (patient.chronic_conditions) {
      const conditions = patient.chronic_conditions.split(',').map(c => c.trim());
      return conditions[0] || 'Under observation';
    }
    if (patient.notes) {
      const noteLines = patient.notes.split('\n').filter(line => line.trim());
      if (noteLines.length > 0) {
        return noteLines[0].substring(0, 30) + (noteLines[0].length > 30 ? '...' : '');
      }
    }
    if (patient.known_allergies) {
      return 'Allergy: ' + patient.known_allergies.split(',')[0].trim();
    }
    return 'Active patient';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Stable': { label: 'Stable', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'Critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
      'Improving': { label: 'Improving', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
      'in-progress': { label: 'In Progress', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'Normal': { label: 'Normal', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'Abnormal': { label: 'Abnormal', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
      'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'inactive': { label: 'Inactive', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'archived': { label: 'Archived', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'scheduled': { label: 'Scheduled', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'cancelled': { label: 'Cancelled', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    };
    return statusMap[status] || { label: status || 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' };
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
      'high': { label: 'High', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
      'medium': { label: 'Medium', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
      'low': { label: 'Low', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' }
    };
    return priorityMap[priority] || { label: priority, color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
  };

  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-[#008751]' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-[#006B40]' },
    { icon: Pill, label: 'Medications', action: '/pharmacy', color: 'bg-[#004D2E]' },
    { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-[#C87D3D]' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-[#C8553D]' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-[#0D6B6B]' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: Clipboard },
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'my-roster', label: 'My Roster', icon: Calendar },
  ];

  const totalItems = patientsCount || patientsList.length;
  const totalPages = Math.ceil(totalItems / 20);
  const startIndex = patientsList.length > 0 ? (totalItems - patientsList.length + 1) : 0;
  const endIndex = startIndex + patientsList.length - 1;

  // ==================== RENDER OVERVIEW CONTENT ====================
  const renderOverviewContent = () => {
    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Assigned Patients"
            value={stats.assignedPatients}
            icon={Users}
            color="green"
            tooltip="Total patients assigned to you"
            onClick={() => setActiveTab('patients')}
          />
          <StatsCard
            title="Vitals Due"
            value={stats.vitalsDue}
            icon={Activity}
            color="blue"
            tooltip="Vital signs checks due"
            onClick={() => setActiveTab('tasks')}
          />
          <StatsCard
            title="Medications Due"
            value={stats.medicationsDue}
            icon={Pill}
            color="gold"
            tooltip="Medication administration due"
            onClick={() => setActiveTab('tasks')}
          />
          <StatsCard
            title="Bed Checks"
            value={stats.bedChecks}
            icon={Bed}
            color="warm"
            tooltip="Bed checks due"
            onClick={() => setActiveTab('tasks')}
          />
        </div>

        {/* Waveform divider — signature motif */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-[#D8D4CD]"></div>
          <svg width="40" height="12" viewBox="0 0 40 12" className="text-[#008751]">
            <path d="M2 6 L8 6 L10 2 L14 10 L18 4 L22 10 L26 4 L30 8 L32 6 L38 6" 
                  stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="h-px flex-1 bg-[#D8D4CD]"></div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index} text={`Go to ${action.label}`}>
                  <button
                    onClick={() => navigate(action.action)}
                    className={`${action.color} text-white p-4 text-left transition-opacity hover:opacity-85 flex flex-col items-start`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white border border-[#E8E3DC] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Recent Alerts</h2>
            <div className="flex items-center gap-2">
              <ButtonWithTooltip
                onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
                tooltip="Mark all alerts as read"
                variant="secondary"
                className="text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark All Read
              </ButtonWithTooltip>
            </div>
          </div>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
                <p className="text-[#5A5A5A] text-sm">No alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between border p-3 ${
                  alert.type === 'critical' ? 'border-[#E8D6D0] bg-[#F5EDEA]' :
                  alert.type === 'warning' ? 'border-[#F0E8DC] bg-[#F5F0EA]' :
                  'border-[#C8E0D5] bg-[#E8F5EF]'
                } ${alert.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    <AlertCircle className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      alert.type === 'critical' ? 'text-[#C8553D]' :
                      alert.type === 'warning' ? 'text-[#C87D3D]' :
                      'text-[#008751]'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{alert.message}</p>
                      <p className="text-xs text-[#5A5A5A]">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!alert.read && (
                      <IconButton
                        icon={CheckCircle}
                        onClick={() => handleMarkAlertRead(alert.id)}
                        tooltip="Mark as read"
                        variant="success"
                        size="sm"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
                      tooltip="Dismiss alert"
                      variant="default"
                      size="sm"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER PATIENTS CONTENT ====================
  const renderPatientsContent = () => {
    if (patientsLoading) {
      return (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#5A5A5A] text-sm mt-2">Loading patients...</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Assigned Patients</h2>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              tooltip="Refresh patient list"
              variant="secondary"
              onClick={handleRefresh}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${patientsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="View all patients"
              variant="secondary"
              onClick={() => navigate('/patients')}
            >
              <Users className="w-3.5 h-3.5" />
              View All
            </ButtonWithTooltip>
          </div>
        </div>

        {patientsList.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">No patients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                  <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Condition</th>
                  <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
                  <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {patientsList.map((patient) => {
                  const status = getStatusBadge(patient.status);
                  const isInactive = (patient.patient_status || patient.status) !== 'active';
                  return (
                    <tr key={patient.id} className="hover:bg-[#F7F5F2] transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#008751] font-display font-medium text-sm flex-shrink-0">
                            {patient.name && patient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#1A1A1A]">{patient.name || 'Unnamed Patient'}</span>
                            {patient.age && (
                              <span className="text-xs text-[#5A5A5A] ml-1">({patient.age}y)</span>
                            )}
                            {(patient.mrn || patient.hospital_number) && (
                              <div className="text-[10px] text-[#B0A89E]">
                                {patient.mrn ? `MRN: ${patient.mrn}` : ''}
                                {patient.mrn && patient.hospital_number ? ' • ' : ''}
                                {patient.hospital_number ? `HN: ${patient.hospital_number}` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <div className="text-xs text-[#5A5A5A]">{patient.phone || 'No phone'}</div>
                        <div className="text-[10px] text-[#B0A89E]">{patient.email || 'No email'}</div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className="text-xs text-[#5A5A5A]">{getPatientCondition(patient)}</span>
                        {patient.bloodType && (
                          <div className="text-[10px] text-[#B0A89E]">Blood: {patient.bloodType}</div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#5A5A5A]">
                          {formatDate(patient.last_visit || patient.lastVisit || patient.registration_date)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <IconButton
                            icon={Eye}
                            onClick={() => handleViewPatient(patient)}
                            tooltip="View patient details"
                            variant="primary"
                            size="sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleCreateAdmissionForPatient(patient)}
                            className="inline-flex items-center gap-1 border border-[#D0E3D8] bg-[#EAF3EE] px-2 py-1 text-[10px] font-medium text-[#2D7D46] hover:bg-[#D0E3D8]"
                          >
                            <Plus className="w-3 h-3" />
                            Admit
                          </button>
                          <IconButton
                            icon={Activity}
                            onClick={() => navigate(`/vital-signs/${patient.id}`)}
                            tooltip="Record vitals"
                            variant="success"
                            size="sm"
                          />
                          <IconButton
                            icon={Pill}
                            onClick={() => navigate(`/pharmacy/${patient.id}`)}
                            tooltip="View medications"
                            variant="info"
                            size="sm"
                          />
                          {isInactive && (
                            <IconButton
                              icon={RotateCcw}
                              onClick={() => handleRestorePatient(patient)}
                              tooltip="Restore patient"
                              variant="success"
                              size="sm"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
              <div className="text-[10px] sm:text-xs text-[#5A5A5A]">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <IconButton
                  icon={ChevronLeft}
                  onClick={() => patientsPreviousPage && loadPatients(patientsPreviousPage)}
                  tooltip="Previous page"
                  variant="default"
                  disabled={!patientsPreviousPage || patientsLoading}
                  size="sm"
                />
                <span className="text-[10px] sm:text-xs text-[#5A5A5A]">
                  Page {patientsList.length > 0 ? Math.ceil((totalItems - patientsList.length + 1) / 20) : 0} of {totalPages || 1}
                </span>
                <IconButton
                  icon={ChevronRight}
                  onClick={() => patientsNextPage && loadPatients(patientsNextPage)}
                  tooltip="Next page"
                  variant="default"
                  disabled={!patientsNextPage || patientsLoading}
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Patient Detail Modal */}
        {showPatientModal && selectedPatient && (
          <PatientDetailModal 
            patient={selectedPatient} 
            onClose={handleClosePatientModal} 
            onJourney={() => navigate(`/patients/${selectedPatient.id}/journey`)}
          />
        )}
      </div>
    );
  };

  // ==================== RENDER TASKS CONTENT ====================
  const renderTasksContent = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Today's Tasks</h2>
          <ButtonWithTooltip
            onClick={() => setShowTaskForm(true)}
            tooltip="Add new task"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </ButtonWithTooltip>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="mb-6 bg-[#F7F5F2] border border-[#E8E3DC] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">
                {editingTaskId ? 'Edit Task' : 'New Task'}
              </h3>
              <IconButton
                icon={X}
                onClick={() => {
                  setShowTaskForm(false);
                  resetTaskForm();
                }}
                tooltip="Close form"
                variant="default"
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Patient</label>
                <input
                  type="text"
                  value={taskForm.patient}
                  onChange={(e) => setTaskForm({...taskForm, patient: e.target.value})}
                  placeholder="Patient name"
                  className="w-full border border-[#D8D4CD] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Room</label>
                <input
                  type="text"
                  value={taskForm.room}
                  onChange={(e) => setTaskForm({...taskForm, room: e.target.value})}
                  placeholder="Room number"
                  className="w-full border border-[#D8D4CD] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Task</label>
                <input
                  type="text"
                  value={taskForm.task}
                  onChange={(e) => setTaskForm({...taskForm, task: e.target.value})}
                  placeholder="Task description"
                  className="w-full border border-[#D8D4CD] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Due Time</label>
                <input
                  type="time"
                  value={taskForm.due}
                  onChange={(e) => setTaskForm({...taskForm, due: e.target.value})}
                  className="w-full border border-[#D8D4CD] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="w-full border border-[#D8D4CD] bg-white px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <ButtonWithTooltip
                onClick={() => {
                  setShowTaskForm(false);
                  resetTaskForm();
                }}
                tooltip="Cancel and close"
                variant="secondary"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                onClick={handleSaveTask}
                tooltip="Save task"
                variant="primary"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Save Task
              </ButtonWithTooltip>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E8E3DC]">
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Task</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Due</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Priority</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {tasks.map((task) => {
                const status = getStatusBadge(task.status);
                const priority = getPriorityBadge(task.priority);
                return (
                  <tr key={task.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-[#1A1A1A]">{task.patient}</span>
                      <span className="text-xs text-[#5A5A5A] ml-2">Room {task.room}</span>
                    </td>
                    <td className="py-3 text-sm text-[#5A5A5A]">{task.task}</td>
                    <td className="py-3 text-sm text-[#5A5A5A]">{task.due}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {task.status === 'pending' && (
                          <IconButton
                            icon={Play}
                            onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                            tooltip="Start task"
                            variant="success"
                            size="sm"
                          />
                        )}
                        {task.status === 'in-progress' && (
                          <IconButton
                            icon={CheckCircle}
                            onClick={() => handleTaskStatusChange(task.id, 'completed')}
                            tooltip="Complete task"
                            variant="success"
                            size="sm"
                          />
                        )}
                        <IconButton
                          icon={Edit}
                          onClick={() => handleEditTask(task)}
                          tooltip="Edit task"
                          variant="primary"
                          size="sm"
                        />
                        <IconButton
                          icon={Trash2}
                          onClick={() => handleDeleteTask(task.id)}
                          tooltip="Delete task"
                          variant="danger"
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==================== RENDER VITALS CONTENT ====================
  const renderVitalsContent = () => {
    const totalVitalsPages = Math.ceil(dashboardVitals.length / vitalsPerPage);
    const start = (vitalsCurrentPage - 1) * vitalsPerPage;
    const pageVitals = dashboardVitals.slice(start, start + vitalsPerPage);

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Vital Signs Records</h2>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              tooltip="Go to full vital signs monitoring"
              variant="secondary"
              onClick={() => navigate('/vital-signs')}
            >
              <Activity className="w-3.5 h-3.5" />
              Full Monitor
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Record new vitals"
              variant="primary"
              onClick={() => navigate('/vital-signs')}
            >
              <Plus className="w-3.5 h-3.5" />
              Record Vitals
            </ButtonWithTooltip>
          </div>
        </div>

        {vitalsError && (
          <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D]">
            {vitalsError}
          </div>
        )}

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E8E3DC]">
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">BP</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">HR</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Temp</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">SpO₂</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Recorded</th>
                <th className="pb-2 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {vitalsLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#5A5A5A]">
                    <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading vital signs...
                  </td>
                </tr>
              ) : pageVitals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#5A5A5A]">
                    No vital signs recorded yet.
                  </td>
                </tr>
              ) : (
                pageVitals.map((vital) => (
                  <tr key={vital.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-[#1A1A1A]">{vital.patient_name || `Patient ${vital.patient}`}</span>
                    </td>
                    <td className="py-3 text-sm text-[#5A5A5A]">{vital.blood_pressure_display || `${vital.blood_pressure_systolic || '-'}/${vital.blood_pressure_diastolic || '-'}`}</td>
                    <td className="py-3 text-sm text-[#5A5A5A]">{vital.pulse || '-'} bpm</td>
                    <td className="py-3 text-sm text-[#5A5A5A]">{vital.temperature || '-'}°C</td>
                    <td className="py-3 text-sm text-[#5A5A5A]">{vital.oxygen_saturation || '-'}%</td>
                    <td className="py-3 text-sm text-[#5A5A5A]">
                      {vital.recorded_at ? new Date(vital.recorded_at).toLocaleString('en-NG') : '-'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Eye}
                          onClick={() => navigate(`/vital-signs?highlight=${vital.id}`)}
                          tooltip="View in monitor"
                          variant="primary"
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalVitalsPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
            <div className="text-xs text-[#5A5A5A]">
              Showing {start + 1} to {Math.min(start + vitalsPerPage, dashboardVitals.length)} of {dashboardVitals.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setVitalsCurrentPage(p => Math.max(1, p - 1))}
                tooltip="Previous page"
                variant="default"
                disabled={vitalsCurrentPage === 1}
                size="sm"
              />
              <span className="text-xs text-[#5A5A5A]">Page {vitalsCurrentPage} of {totalVitalsPages}</span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setVitalsCurrentPage(p => Math.min(totalVitalsPages, p + 1))}
                tooltip="Next page"
                variant="default"
                disabled={vitalsCurrentPage === totalVitalsPages}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER SCHEDULE CONTENT ====================
  const renderScheduleContent = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Appointments</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="View full schedule"
              variant="secondary"
              onClick={() => navigate('/appointments')}
            >
              <Calendar className="w-3.5 h-3.5" />
              Full Schedule
            </ButtonWithTooltip>
          </div>
        </div>

        {scheduleLoading ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">Loading schedule...</p>
          </div>
        ) : scheduleError ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-[#C8553D] mx-auto mb-2" />
            <p className="text-[#C8553D] text-sm font-medium">{scheduleError}</p>
            <button
              onClick={() => {
                apiRequest('/api/v1/patients/appointments/').then(data => {
                  const results = Array.isArray(data) ? data : (data.results || []);
                  const mapped = results.map(apt => ({
                    id: apt.id,
                    patientName: apt.patient_name || 'Unknown Patient',
                    patientId: apt.patient || '',
                    date: apt.scheduled_date || '',
                    time: formatTime(apt.scheduled_time),
                    timeRaw: apt.scheduled_time ? apt.scheduled_time.substring(0, 5) : '',
                    reason: apt.reason || '',
                    doctor: apt.doctor_name || '',
                    doctorId: apt.doctor || '',
                    status: normalizeAppointmentStatus(apt.status),
                    notes: apt.notes || '',
                    phone: apt.patient_phone || '',
                    email: apt.patient_email || '',
                    appointment_type: apt.appointment_type || 'consultation',
                  }));
                  setTodaysSchedule(mapped);
                  setScheduleError(null);
                }).catch(err => setScheduleError(err.message));
              }}
              className="mt-2 text-sm text-[#008751] hover:text-[#006B40] font-medium"
            >
              Retry
            </button>
          </div>
        ) : todaysSchedule.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] lg:min-w-0">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Doctor</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Reason</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {todaysSchedule.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="py-2 sm:py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center flex-shrink-0 text-[#008751] font-display font-medium text-sm">
                          {(appointment.patientName || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-[#1A1A1A] text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">{appointment.patientName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 hidden sm:table-cell">
                      <div className="text-xs sm:text-sm text-[#5A5A5A]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#B0A89E] flex-shrink-0" />
                          <span className="whitespace-nowrap">{new Date(appointment.date).toLocaleDateString('en-NG')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#5A5A5A]">
                          <Clock className="w-3 h-3 text-[#B0A89E] flex-shrink-0" />
                          <span className="whitespace-nowrap">{appointment.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 hidden md:table-cell">
                      <span className="text-xs sm:text-sm text-[#5A5A5A] truncate max-w-[120px] block">{appointment.doctor || 'N/A'}</span>
                    </td>
                    <td className="py-2 sm:py-3 hidden lg:table-cell">
                      <span className="text-xs sm:text-sm text-[#5A5A5A] truncate max-w-[150px] block">{appointment.reason || 'N/A'}</span>
                    </td>
                    <td className="py-2 sm:py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${
                        appointment.status === 'completed' ? 'border-[#D0E3D8] bg-[#EAF3EE] text-[#2D7D46]' :
                        appointment.status === 'in-progress' ? 'border-[#C8E0D5] bg-[#E8F5EF] text-[#008751]' :
                        appointment.status === 'cancelled' ? 'border-[#E8D6D0] bg-[#F5EDEA] text-[#C8553D]' :
                        'border-[#E8E3DC] bg-[#F0EDE8] text-[#5A5A5A]'
                      }`}>
                        {appointment.status === 'in-progress' ? 'In Progress' : 
                         appointment.status === 'completed' ? 'Completed' : 
                         appointment.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3">
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                        <IconButton
                          icon={Eye}
                          onClick={() => navigate('/appointments')}
                          tooltip="View appointment"
                          variant="primary"
                          size="sm"
                        />
                        <IconButton
                          icon={Edit}
                          onClick={() => navigate('/appointments')}
                          tooltip="Edit appointment"
                          variant="primary"
                          size="sm"
                        />
                        <div className="relative">
                          <IconButton
                            icon={MoreVertical}
                            onClick={() => setShowStatusMenu(showStatusMenu === appointment.id ? null : appointment.id)}
                            tooltip="Change status"
                            variant="default"
                            size="sm"
                          />
                          {showStatusMenu === appointment.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-[#E8E3DC] z-10 py-1">
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F7F5F2] flex items-center gap-2 text-[#1A1A1A]"
                              >
                                <Clock className="w-3 h-3 text-[#008751]" />
                                Scheduled
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F7F5F2] flex items-center gap-2 text-[#1A1A1A]"
                              >
                                <CheckCircle className="w-3 h-3 text-[#2D7D46]" />
                                Completed
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#F7F5F2] flex items-center gap-2 text-[#1A1A1A]"
                              >
                                <X className="w-3 h-3 text-[#C8553D]" />
                                Cancelled
                              </button>
                            </div>
                          )}
                        </div>
                        <IconButton
                          icon={Trash2}
                          onClick={() => navigate('/appointments')}
                          tooltip="Delete appointment"
                          variant="danger"
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'patients':
        return renderPatientsContent();
      case 'tasks':
        return renderTasksContent();
      case 'vitals':
        return renderVitalsContent();
      case 'schedule':
        return renderScheduleContent();
      case 'my-roster':
        return <MyRosterTab />;
      default:
        return renderOverviewContent();
    }
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8E3DC] border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden flex-shrink-0">
              {dashboardProfilePicture ? (
                <img
                  key={dashboardProfilePicture}
                  src={dashboardProfilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement?.querySelector('.profile-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full items-center justify-center profile-fallback" style={{ display: dashboardProfilePicture ? 'none' : 'flex' }}>
                <UserIcon className="w-6 h-6 text-[#5A5A5A]" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Welcome back, {displayUserName}
              </h1>
              <p className="text-sm text-[#5A5A5A]">
                {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh dashboard"
              variant="secondary"
              className="text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${patientsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="View notifications"
              variant="secondary"
              className="text-xs relative"
            >
              <Bell className="w-4 h-4" />
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8553D] text-white text-[10px] flex items-center justify-center">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="My Profile"
              variant="secondary"
              onClick={handleOpenProfile}
              className="text-xs"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenChangePassword}
              tooltip="Change Password"
              variant="secondary"
              className="text-xs"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Change Password</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Tabs with Nigerian green active state */}
      <div className="border-b border-[#E8E3DC] mb-8 overflow-x-auto">
        <nav className="flex gap-6 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-[#E8E3DC] p-5 sm:p-8">
        {renderTabContent()}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profileData={profileData}
          onChange={handleProfileChange}
          onSave={handleSaveProfile}
          loading={profileLoading}
          saving={profileSaving}
          error={profileError}
          success={profileSuccess}
          specializations={specializations}
          specializationsLoading={specializationsLoading}
          profilePicturePreview={profilePicturePreview}
          onProfilePictureChange={handleProfileChange}
        />
      )}

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <PatientDetailModal 
          patient={selectedPatient} 
          onClose={handleClosePatientModal} 
        />
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        saving={passwordLoading}
        error={passwordError}
        success={passwordSuccess}
        onChange={handlePasswordChange}
        onSave={handleChangePassword}
      />
    </div>
  );
};

export default NurseDashboard;