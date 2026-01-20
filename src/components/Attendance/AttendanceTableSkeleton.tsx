import { TableRow, TableCell } from "../ui/table";

export const AttendanceTableSkeleton = ({ rows = 6 }: { rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 9 }).map((__, j) => (
            <TableCell key={j}>
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};




interface LeaveActivityTableSkeletonProps {
  rows?: number;
}

export const LeaveActivityTableSkeleton: React.FC<LeaveActivityTableSkeletonProps> = ({
  rows = 6,
}) => {
  // Number of columns in your Leave Activity table
  const columns = 11;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="p-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};


interface TrainingTableSkeletonProps {
  rows?: number;
}

export const TrainingTableSkeleton: React.FC<TrainingTableSkeletonProps> = ({
  rows = 6,
}) => {
  // Number of columns in Training table
  const columns = 6;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="p-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
