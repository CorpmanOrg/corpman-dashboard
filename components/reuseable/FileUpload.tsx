import { useRef, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";
import { FormikProps } from "formik";

type UploadedFile = {
  name: string;
  size: string;
};

type UploadProgress = {
  name: string;
  loading: number;
};

interface TestFileUploadProps {
  labelText?: string;
  onFileUploadProgress?: (progress: UploadProgress) => void;
  setUploadedFiles?: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  formik: FormikProps<any>; // If you know your form values shape, replace `any` with your form type
  name: string;
  error?: string;
  touched?: boolean;
  existingFile?: string;
  fileClassName?: string;
}

const TestFileUpload: React.FC<TestFileUploadProps> = ({
  labelText = "",
  onFileUploadProgress,
  setUploadedFiles,
  formik,
  name,
  error,
  touched,
  existingFile,
  fileClassName,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileNames, setFileNames] = useState<string>(existingFile || "");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const checkFileName = (filePath: string | undefined): string => {
    if (!filePath) return "";
    const parts = filePath.split("/");
    return parts[parts.length - 1] || "";
  };

  const filename = checkFileName(fileNames);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    const displayName =
      file.name.length > 20 ? `${file.name.substring(0, 17)}...${file.name.split(".").pop()}` : file.name;

    setUploading(true);
    setUploadProgress(0);
    onFileUploadProgress?.({ name: displayName, loading: 0 });

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      onFileUploadProgress?.({ name: displayName, loading: progress });

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);

        const size = file.size < 1024 ? `${file.size} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

        setUploadedFiles?.((prev) => [...prev, { name: displayName, size }]);
      }
    }, 150);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      setFileNames(file.name);
      formik.setFieldValue(name, file);
      formik.setFieldTouched(name, true);
    }
  };

  const handleBlur = () => {
    formik.setFieldTouched(name, true); // triggers validation
  };

  const handleDelete = () => {
    setFileNames("");
    setUploadProgress(0);
    setUploading(false);
    formik.setFieldValue(name, "");
  };

  return (
    <div className="relative w-full h-10 flex items-center">
      <div
        className={`w-full h-10 flex items-center justify-between px-4 border border-input rounded-md bg-black dark:bg-[#22223b] transition duration-150 shadow-sm cursor-pointer hover:bg-black dark:hover:bg-[#22223b]`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <UploadCloud className="w-5 h-5 text-[#FDB815]" />
          <span className="text-sm text-white dark:text-gray-300 truncate max-w-[160px]">
            {filename ? filename : "Click to upload file"}
          </span>
        </div>

        {filename && (
          <Trash2
            className="w-4 h-4 text-red-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          />
        )}
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="w-full max-w-xs h-2 bg-black rounded-lg overflow-hidden mt-1">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${uploadProgress}%`,
              backgroundColor: "#FDB815",
            }}
          ></div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleChange}
        onBlur={handleBlur}
        accept="image/*,application/pdf"
      />

      {/* Error */}
      {formik && formik.touched[name] && typeof formik.errors[name] === "string" && (
        <span className="text-xs text-red-500 absolute left-0 top-full mt-1">{formik.errors[name]}</span>
      )}
    </div>
  );
};

export default TestFileUpload;
