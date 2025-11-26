/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchTerm } from "@/store/slices/profile/profileSlice";

import {
  setActiveTab,
  setSelectedDate,
} from "@/store/slices/report/reportSlice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { format } from "date-fns";
import { Table } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { PaginationNav } from "../ui/paginationNav";
import { Skeleton } from "../ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { Button } from "../ui/button";

export const ConsultantReport = () => {
  const dispatch = useAppDispatch();

  const {
    dataMap,
    loadingMap,
    paginationMap,
    paginationSetterMap,
    totalPagesMap,
    skeletonMap,
    shouldSearchMap,
  } = useReduxReportContext();
  const { searchTerm, activeTab, selectedDate } = useAppSelector(
    (state) => state.report
  );

  return (
    <Card className="p-4 sm:p-6 border border-gray-200 rounded-2xl bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Consultant Reports
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(val) =>
            dispatch(
              setActiveTab(val as "quality" | "operations" | "comms" | "it")
            )
          }
        >
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-gray-50 border rounded-lg">
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="comms">Comms</TabsTrigger>
            <TabsTrigger value="it">IT Reports</TabsTrigger>
          </TabsList>

          {["quality", "operations", "comms", "it"].map((tab) => {
            const data = dataMap[tab] || [];
            const pagination = paginationMap[tab];
            const totalPages = totalPagesMap[tab] || 1;
            const isSkeleton = skeletonMap[tab];
            const shouldSearch = shouldSearchMap[tab];
            const isLoading = loadingMap[tab];

            return (
              <TabsContent key={tab} value={tab}>
                {/* Header Section */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">
                      Select Date:
                    </span>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => dispatch(setSelectedDate(date))}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search by consultant name..."
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      className="w-48"
                    />
                    <Button variant="outline">Excel</Button>
                    <Button variant="outline">PDF</Button>
                  </div>
                </div>

                {/* Table Section */}
                {isSkeleton ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-full h-10 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tab === "operations" && (
                          <>
                            <TableHead>Consultant Name</TableHead>
                            <TableHead>Shift</TableHead>
                            <TableHead>Client Name</TableHead>
                            <TableHead>PNR</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Date</TableHead>
                          </>
                        )}
                        {tab === "quality" && (
                          <>
                            <TableHead>Agent</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead>Evaluated By</TableHead>
                            <TableHead>Date</TableHead>
                          </>
                        )}
                        {tab === "comms" && (
                          <>
                            <TableHead>Sender</TableHead>
                            <TableHead>Receiver</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Sent</TableHead>
                          </>
                        )}
                        {tab === "it" && (
                          <>
                            <TableHead>Name</TableHead>
                            <TableHead>Week</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Date</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {isLoading ? (
                        [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={6}>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : data.length > 0 ? (
                        data.map((item: any) => (
                          <TableRow key={item._id}>
                            {tab === "operations" && (
                              <>
                                <TableCell>{item.consultantName}</TableCell>
                                <TableCell>{item.shift}</TableCell>
                                <TableCell>{item.clientName}</TableCell>
                                <TableCell>{item.PNR}</TableCell>
                                <TableCell>{item.details}</TableCell>
                                <TableCell>
                                  {format(new Date(item.createdAt), "PP")}
                                </TableCell>
                              </>
                            )}
                            {tab === "quality" && (
                              <>
                                <TableCell>{item.agentName}</TableCell>
                                <TableCell>{item.week}</TableCell>
                                <TableCell>{item.score}</TableCell>
                                <TableCell>{item.remarks ?? "-"}</TableCell>
                                <TableCell>{item.evaluatedBy ?? "-"}</TableCell>
                                <TableCell>
                                  {format(new Date(item.createdAt), "PP")}
                                </TableCell>
                              </>
                            )}
                            {tab === "comms" && (
                              <>
                                <TableCell>{item.sender}</TableCell>
                                <TableCell>{item.receiver}</TableCell>
                                <TableCell>{item.subject}</TableCell>
                                <TableCell className="capitalize">
                                  {item.status}
                                </TableCell>
                                <TableCell>
                                  {format(new Date(item.dateSent), "PP")}
                                </TableCell>
                              </>
                            )}
                            {tab === "it" && (
                              <>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.week}</TableCell>
                                <TableCell>{item.task}</TableCell>
                                <TableCell>
                                  {format(new Date(item.createdAt), "PP")}
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))
                      ) : shouldSearch ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-500"
                          >
                            No results found for your search.
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-500"
                          >
                            No data available for {tab} reports.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}

                {/* Pagination */}
                <PaginationNav
                  page={pagination?.page}
                  totalPages={totalPages}
                  pageSize={pagination?.limit || 20}
                  onPageChange={(newPage) =>
                    dispatch(
                      paginationSetterMap[tab]({
                        ...pagination,
                        page: newPage,
                      })
                    )
                  }
                  onPageSizeChange={(newSize) =>
                    dispatch(
                      paginationSetterMap[tab]({
                        ...pagination,
                        page: 1,
                        limit: newSize,
                      })
                    )
                  }
                  className="mt-6"
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
