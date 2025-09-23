// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Calendar, Clock, User, MapPin } from 'lucide-react';
// import { useCombinedContext } from '@/contexts/AuthContext';

// interface UpcomingLeaveItem {
//   id: string;
//   employeeName: string;
//   type: 'vacation' | 'sick' | 'personal' | 'maternity';
//   startDate: string;
//   endDate: string;
//   days: number;
//   status: 'approved' | 'pending';
//   isCurrentUser?: boolean;
// }

// const mockUpcomingLeave: UpcomingLeaveItem[] = [
//   {
//     id: '1',
//     employeeName: 'John Doe',
//     type: 'vacation',
//     startDate: '2024-01-25',
//     endDate: '2024-01-29',
//     days: 5,
//     status: 'approved',
//     isCurrentUser: true
//   },
//   {
//     id: '2',
//     employeeName: 'Jane Smith',
//     type: 'sick',
//     startDate: '2024-01-22',
//     endDate: '2024-01-22',
//     days: 1,
//     status: 'approved'
//   },
//   {
//     id: '3',
//     employeeName: 'Mike Wilson',
//     type: 'personal',
//     startDate: '2024-02-01',
//     endDate: '2024-02-02',
//     days: 2,
//     status: 'approved'
//   }
// ];

// const UpcomingLeave: React.FC = () => {
//   const { user: userContext } = useCombinedContext();
//   const { user } = userContext;

//   const getLeaveTypeColor = (type: string) => {
//     switch (type) {
//       case 'vacation': return 'bg-blue-100 text-blue-800';
//       case 'sick': return 'bg-red-100 text-red-800';
//       case 'personal': return 'bg-green-100 text-green-800';
//       case 'maternity': return 'bg-purple-100 text-purple-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const getDaysUntilLeave = (startDate: string) => {
//     const today = new Date();
//     const leave = new Date(startDate);
//     const diffTime = leave.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const userLeave = mockUpcomingLeave.filter(leave => leave.isCurrentUser);
//   const teamLeave = mockUpcomingLeave.filter(leave => !leave.isCurrentUser);

//   return (
//     <div className="space-y-6">
//       {/* User's Upcoming Leave */}
//       {userLeave.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Your Upcoming Leave
//             </CardTitle>
//             <CardDescription>Your approved leave requests</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {userLeave.map((leave) => (
//                 <div key={leave.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <Badge className={getLeaveTypeColor(leave.type)}>
//                           {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
//                         </Badge>
//                         <Badge variant="outline" className="text-green-600 border-green-200">
//                           {leave.status}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-4 w-4" />
//                           {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-4 w-4" />
//                           {leave.days} day{leave.days > 1 ? 's' : ''}
//                         </div>
//                       </div>
//                       <div className="text-sm font-medium text-blue-700">
//                         {getDaysUntilLeave(leave.startDate) > 0
//                           ? `Starts in ${getDaysUntilLeave(leave.startDate)} days`
//                           : 'Currently on leave'
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Team Upcoming Leave */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MapPin className="h-5 w-5" />
//             Team Upcoming Leave
//           </CardTitle>
//           <CardDescription>Your team members' approved leave</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {teamLeave.length > 0 ? (
//             <div className="space-y-3">
//               {teamLeave.map((leave) => (
//                 <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                       <User className="h-4 w-4 text-gray-600" />
//                     </div>
//                     <div>
//                       <div className="font-medium">{leave.employeeName}</div>
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Badge className={getLeaveTypeColor(leave.type)} variant="secondary">
//                           {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
//                         </Badge>
//                         <span>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-medium">{leave.days} day{leave.days > 1 ? 's' : ''}</div>
//                     <div className="text-xs text-gray-500">
//                       {getDaysUntilLeave(leave.startDate) > 0
//                         ? `In ${getDaysUntilLeave(leave.startDate)} days`
//                         : 'Currently away'
//                       }
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//               <p>No upcoming team leave</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UpcomingLeave;
