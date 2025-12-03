
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchTerm } from "@/store/slices/profile/profileSlice";
import {
  setActiveTab,
  setCreateReportLink,
  setReportType,
  setSelectedDate,
} from "@/store/slices/report/reportSlice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { PaginationNav } from "../ui/paginationNav";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2,  ClipboardCopy as ClipboardCopyIcon  } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "../ui/use-toast";


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
    generateLinkReport
  } = useReduxReportContext();

  const { searchTerm, activeTab, selectedDate, reportType, createLinkReport, isLoading } = useAppSelector(
    (state) => state.report
  );
 

  console.log("Generated Link:", createLinkReport);


  const handleConsultantLink = async () => {
    
    await generateLinkReport(reportType);
  }

  return (
    <Card className="p-4 sm:p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">

    <CardHeader className="pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      {/* Left Section: Title */}
      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
        Consultant Reports
      </CardTitle>

      {/* Right Section: Select + Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <Select
          value={reportType}
          onValueChange={(val) =>
            dispatch(setReportType(val as "quality" | "operations" | "comms" | "it"))
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quality">Quality</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="comms">Comms</SelectItem>
            <SelectItem value="it">IT Report</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleConsultantLink}
          className="bg-[#646cffaa] text-white hover:bg-[#4e52d1] w-full sm:w-auto"
          disabled={isLoading}
        >

          {
            isLoading && (

              <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
            )
          }
          Generate Link
        </Button>
      </div>

      

    </CardHeader>

    <CardContent className="flex flex-col gap-2">
      {createLinkReport && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
          {/* Link */}
          <a
            href={createLinkReport}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline truncate"
          >
            {createLinkReport}
          </a>

          {/* Copy Button */}
        <button
        onClick={() => {
          navigator.clipboard.writeText(createLinkReport);
          toast({ title: "Copied!", description: "Link copied to clipboard." });
            dispatch(setCreateReportLink(""));
        }}
        className="ml-2 p-1 rounded hover:bg-gray-200"
        title="Copy link"
      >
        <ClipboardCopyIcon className="h-5 w-5 text-gray-600" />
      </button>

        </div>
      )}
    </CardContent>


      <CardContent>
        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={(val) =>
            dispatch(setActiveTab(val as "quality" | "operations" | "comms" | "it"))
          }
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6 border rounded-lg bg-gray-50 overflow-hidden">
            {["quality", "operations", "comms", "it"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "text-sm sm:text-base py-2 font-medium transition-all text-center",
                  activeTab === tab
                    ? "bg-white text-blue-600 border-b-2 border-blue-600 font-semibold shadow-sm"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                )}
              >
                {tab === "quality" && "Quality"}
                {tab === "operations" && "Operations"}
                {tab === "comms" && "Comms"}
                {tab === "it" && "IT Reports"}
              </TabsTrigger>
            ))}
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
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 border-b pb-3">
                  {/* Left: Date Picker */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm font-medium text-gray-600">
                      Select Date:
                    </span>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-full sm:w-[200px]",
                            !selectedDate && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 w-auto bg-white shadow-lg border rounded-lg z-[9999]"
                        align="start"
                        side="bottom"
                        sideOffset={5}
                      >
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => dispatch(setSelectedDate(date))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Right: Search & Export */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
                    <Input
                      placeholder="Search by consultant name..."
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      className="w-full sm:w-56"
                    />
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Export Excel
                      </Button>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Export PDF
                      </Button>
                    </div>
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
                  <div className="overflow-x-auto w-full">
                    {/* Desktop Table */}
                    <div className="hidden md:block w-full">
                      <Table className="min-w-full border rounded-lg">
                        <TableHeader className="bg-gray-100">
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
                              <TableRow
                                key={item._id}
                                className="hover:bg-gray-50 transition-colors"
                              >
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
                                className="text-center text-gray-500 py-4"
                              >
                                No results found for your search.
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center text-gray-500 py-4"
                              >
                                No data available for {tab} reports.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-3">
                      {data.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                        >
                          {Object.entries(item).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1">
                              <span className="font-medium text-gray-600 text-sm">
                                {key}
                              </span>
                              <span className="text-gray-800 text-sm text-right truncate max-w-[150px]">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
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
