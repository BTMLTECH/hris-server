/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { setFormData } from "@/store/slices/profile/profileSlice";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAppSelector } from "@/store/hooks";
import { IClassLevel, ProfileFormData } from "@/types/user";
import { NIGERIAN_BANKS, PFA_COMPANIES } from "@/data/constRaw";

interface AccountInfoSectionProps {
  formData: ProfileFormData;
  dispatch: Dispatch<any>;
}

export default function AccountInfoSection({
  formData,
  dispatch,
}: AccountInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="classlevel">Class</Label>
          <Select
            value={
              formData.accountInfo?.classLevel?.includes("-")
                ? formData.accountInfo.classLevel
                : (() => {
                    const allLevels = Object.values(
                      formData.classlevels || {}
                    ).flat() as IClassLevel[];
                    const found = allLevels.find(
                      (lvl) =>
                        lvl.payGrade.replace(/^\d{4}\s*/, "") ===
                        formData.accountInfo?.classLevel
                    );
                    return found
                      ? `${found.year}-${formData.accountInfo?.classLevel}`
                      : "";
                  })()
            }
            onValueChange={(value: string) => {
              const [year, shortPayGrade] = value.split("-");
              const allLevels = Object.values(
                formData.classlevels || {}
              ).flat() as IClassLevel[];

              const selectedLevel = allLevels.find(
                (lvl) =>
                  lvl.year === Number(year) &&
                  lvl.payGrade.replace(/^\d{4}\s*/, "") === shortPayGrade
              );

              dispatch(
                setFormData({
                  ...formData,
                  accountInfo: {
                    ...formData.accountInfo,
                    classLevel: value, // Always store as "year-payGrade"
                    basicPay: selectedLevel
                      ? Number(selectedLevel.basicSalary.toFixed(2))
                      : 0,
                    allowances: selectedLevel
                      ? Number(selectedLevel.totalAllowances?.toFixed(2) || "0")
                      : 0,
                  },
                })
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {Object.entries(
                Object.values(formData.classlevels || {})
                  .flat()
                  .reduce(
                    (acc: Record<number, IClassLevel[]>, lvl: IClassLevel) => {
                      acc[lvl.year] = acc[lvl.year] || [];
                      acc[lvl.year].push(lvl);
                      return acc;
                    },
                    {}
                  )
              ).map(([year, levels]) => (
                <div key={year}>
                  {/* Year header */}
                  <div className="px-2 py-1 text-sm font-semibold text-gray-500">
                    {year}
                  </div>
                  {levels
                    .sort((a, b) => a.level - b.level)
                    .map((lvl) => {
                      const shortPayGrade = lvl.payGrade.replace(
                        /^\d{4}\s*/,
                        ""
                      );
                      const value = `${lvl.year}-${shortPayGrade}`;
                      return (
                        <SelectItem key={value} value={value}>
                          {`Level ${shortPayGrade}`}
                        </SelectItem>
                      );
                    })}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="basicPay">Basic Pay</Label>
          <Input
            id="basicPay"
            type="number"
            value={formData.accountInfo?.basicPay || ""}
            readOnly
            className="bg-gray-100 text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="allowances">Total Allowance</Label>
          <Input
            id="allowances"
            type="number"
            value={formData.accountInfo?.allowances || ""}
            readOnly
            className="bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
          <Input
            id="bankAccountNumber"
            value={formData.accountInfo?.bankAccountNumber || ""}
            onChange={(e) =>
              dispatch(
                setFormData({
                  ...formData,
                  accountInfo: {
                    ...formData.accountInfo,
                    bankAccountNumber: e.target.value,
                  },
                })
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Select
            value={formData.accountInfo?.bankName ?? undefined}
            onValueChange={(val) =>
              dispatch(
                setFormData({
                  ...formData,
                  accountInfo: { ...formData.accountInfo, bankName: val },
                })
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {NIGERIAN_BANKS.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="taxNumber">Tax Number</Label>
          <Input
            id="taxNumber"
            value={formData.accountInfo?.taxNumber || ""}
            onChange={(e) =>
              dispatch(
                setFormData({
                  ...formData,
                  accountInfo: {
                    ...formData.accountInfo,
                    taxNumber: e.target.value,
                  },
                })
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pensionCompany">Pension Company</Label>
          <Select
            value={formData.accountInfo?.pensionCompany ?? undefined}
            onValueChange={(val) =>
              dispatch(
                setFormData({
                  ...formData,
                  accountInfo: { ...formData.accountInfo, pensionCompany: val },
                })
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select PFA company" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {PFA_COMPANIES.map((pfa) => (
                <SelectItem key={pfa} value={pfa}>
                  {pfa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="pensionNumber">Pension Number</Label>
          <Input
            id="pensionNumber"
            value={formData.accountInfo?.pensionNumber || ""}
            onChange={(e) =>
              dispatch(
                setFormData({
                  ...formData,
                  accountInfo: {
                    ...formData.accountInfo,
                    pensionNumber: e.target.value,
                  },
                })
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
