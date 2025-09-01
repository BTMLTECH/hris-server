import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { setFormData } from "@/store/slices/profile/profileSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppSelector } from "@/store/hooks";
import { IClassLevel } from "@/types/user";
import { NIGERIAN_BANKS, PFA_COMPANIES } from "@/data/constRaw";


interface AccountInfoSectionProps {
  formData: any;
  dispatch: Dispatch<any>;
}

export default function AccountInfoSection({ formData, dispatch }: AccountInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="classlevel">Class</Label>
          <Select
    value={formData.accountInfo?.classLevel || ""}
    onValueChange={(value: string) => {
      const allLevels = Object.values(formData.classlevels || {}).flat() as IClassLevel[];
      const selectedLevel = allLevels.find(
        (lvl) => lvl.payGrade.replace(/^\d{4}\s*/, "") === value
      );

 
      dispatch(
        setFormData({
          ...formData,
          accountInfo: {
            ...formData.accountInfo,
            classLevel: value,
            basicPay: selectedLevel ? Number(selectedLevel.basicSalary.toFixed(2)) : 0,
            allowances: selectedLevel ? Number(selectedLevel.totalAllowances?.toFixed(2) || "0") : 0,
          },
        })
      );
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Class" />
    </SelectTrigger>
    <SelectContent className="max-h-60 overflow-y-auto">
      {Object.values(formData.classlevels || {})
        .flat()
        .map((lvl: IClassLevel) => lvl.payGrade.replace(/^\d{4}\s*/, "")) 
        .filter((value, index, self) => self.indexOf(value) === index) 
        .sort((a, b) => {
          const [mainA, subA] = a.split(".").map(Number);
          const [mainB, subB] = b.split(".").map(Number);
          return mainA - mainB || (subA || 0) - (subB || 0);
        })
        .map((level) => (
          <SelectItem key={level} value={level}>
            Level {level}
          </SelectItem>
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
              dispatch(setFormData({ ...formData, accountInfo: { ...formData.accountInfo, bankAccountNumber: e.target.value } }))
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
              dispatch(setFormData({ ...formData, accountInfo: { ...formData.accountInfo, taxNumber: e.target.value } }))
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
              dispatch(setFormData({ ...formData, accountInfo: { ...formData.accountInfo, pensionNumber: e.target.value } }))
            }
          />
        </div>
      </div>
    </div>
  );
}
