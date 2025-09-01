import { GenerateReportDTO } from "@/types/report";
import { apiSlice } from "../auth/apiSlice";


export const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateEmploymentSummary: builder.mutation<void, GenerateReportDTO>({
      query: (reportData) => ({
        url: 'reports/get-employee-summary',
        method: 'POST',
        body: reportData,
        responseHandler: async (response) => {
          if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
              const errorData = await response.json();
              if (errorData?.message) errorMessage = errorData.message;
            } catch {}
            throw new Error(errorMessage);
          }

          const blob = await response.blob();
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName = '';

          // Extract from Content-Disposition if present
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match?.[1]) {
              fileName = match[1];
            }
          }

          // If no filename in headers, generate dynamically
          if (!fileName) {
            const now = new Date();
            const monthYear = now.toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric'
            }).replace(/ /g, '_');

            // Detect file extension based on backend response Content-Type
            const contentType = response.headers.get('Content-Type') || '';
            let ext = '';
            if (contentType.includes('pdf')) ext = '.pdf';
            else if (contentType.includes('spreadsheet')) ext = '.xlsx';
            else if (contentType.includes('csv')) ext = '.csv';
            else ext = '';

            fileName = `Employment_Summary_${monthYear}${ext}`;
          }

          // Download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        },
      }),
    }),
  }),
});


export const { useGenerateEmploymentSummaryMutation } = reportApi;
