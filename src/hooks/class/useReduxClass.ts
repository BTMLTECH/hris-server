/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/hooks/use-toast";
import {
  useCreateClassLevelMutation,
  useBulkCreateClassLevelsMutation,
  useUpdateClassLevelMutation,
  useCalculateClassMutation,
  useBulkDeleteClassLevelsByYearMutation,
} from "@/store/slices/class/classApi";
import { setIsLoading } from "@/store/slices/class/classSlice";
import { extractErrorMessage } from "@/utils/errorHandler"; 
import { ClassContextType, IClassLevelInput } from "@/types/class";

export const useReduxClass = (): ClassContextType => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.report);

  const [createClassLevel] = useCreateClassLevelMutation();
  const [bulkCreateClassLevels] = useBulkCreateClassLevelsMutation();
  const [updateClassLevel] = useUpdateClassLevelMutation();
  const [calculateClass] = useCalculateClassMutation();
  const [bulkDeleteClassLevelsByYear] = useBulkDeleteClassLevelsByYearMutation()
  


const handleCreateClassLevel = async (
  input: IClassLevelInput
): Promise<boolean> => {
  try {
    dispatch(setIsLoading(true));
    await createClassLevel(input).unwrap();
    toast({ title: "Class Level created successfully!" });
    return true;
  } catch (err: any) {
    const errorMessage = extractErrorMessage(err, "Class Level creation failed");
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};

const bulkUploadClass = async (formData: FormData): Promise<boolean> => {
  dispatch(setIsLoading(true));

  try {
    const response = await bulkCreateClassLevels(formData).unwrap();

    const created = response?.data?.created || [];
    const errors = response?.data?.errors || [];
    const backendMessage = response?.message || '';

    if (backendMessage && errors.length === 0) {
      toast({ title: 'Bulk Upload', description: backendMessage });
    }

    if (created.length > 0) {
      toast({
        title: 'Bulk Upload Successful',
        description: `${created.length} class level(s) created successfully.`,
      });
    }

    if (errors.length > 0) {
      const errorCount = errors.length;

      const detailedErrors = errors.slice(0, 5).map((err: string) => `• ${err}`);
      const extraCount = errorCount > 5 ? `\n…and ${errorCount - 5} more` : '';

      toast({
        title: 'Some Records Failed',
        description: `${errorCount} record(s) could not be processed:\n${detailedErrors.join('\n')}${extraCount}`,
        variant: 'destructive',
        duration: 12000,
      });
    }

    return created.length > 0;
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error, 'Bulk upload failed.');
    toast({
      title: 'Bulk Upload Failed',
      description: errorMessage,
      variant: 'destructive',
    });
    return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};


const handleUpdateClassLevel = async (id: string): Promise<boolean> => {
  try {
    dispatch(setIsLoading(true));
    await updateClassLevel({ id }).unwrap();
    toast({ title: "Class Level updated successfully!" });
    return true;
  } catch (err: any) {
    const errorMessage = extractErrorMessage(err, "Update failed");
    toast({
      title: "Update Error",
      description: errorMessage,
      variant: "destructive",
    });
    return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};

const handleCalculateClass = async (
  band: string
): Promise<any | null> => {
  try {
    dispatch(setIsLoading(true));
    const result = await calculateClass({ band }).unwrap();
    toast({ title: "Class calculation completed!" });
    return result; 
  } catch (err: any) {
    const errorMessage = extractErrorMessage(err, "Class calculation failed");
    toast({
      title: "Calculation Error",
      description: errorMessage,
      variant: "destructive",
    });
    return null;
  } finally {
    dispatch(setIsLoading(false));
  }
};

const bulkDeleteClass = async (year: string): Promise<boolean> => {
  dispatch(setIsLoading(true));

  try {
    const response = await bulkDeleteClassLevelsByYear({ year }).unwrap();
    const deleted = response?.data?.deleted || 0;
    const backendMessage = response?.message || "";

    if (deleted > 0) {
      toast({
        title: "Bulk Delete Successful",
        description: `${deleted} class level(s) deleted for year ${year}.`,
      });
      return true;
    }

    toast({
      title: "No Records Found",
      description: backendMessage || `No class levels found for year ${year}.`,
      variant: "destructive",
    });
    return false;
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error, "Bulk delete failed.");
    toast({
      title: "Bulk Delete Failed",
      description: errorMessage,
      variant: "destructive",
    });
    return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};



  return {
    isLoading,
    error,
    handleCreateClassLevel,
    bulkUploadClass,
    handleUpdateClassLevel,
    handleCalculateClass,
    bulkDeleteClass
  };
};
