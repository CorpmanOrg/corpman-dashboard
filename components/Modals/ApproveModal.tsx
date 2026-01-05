import React from "react";
import BaseModal from "./BaseModal";
import TestFileUpload from "@/components/reuseable/FileUpload";
import { Formik, FormikHelpers } from "formik";

interface ApproveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (file: File | string | null) => void;
  message: string;
  loading?: boolean;
  error?: string;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ open, onClose, onConfirm, message, loading = false, error }) => {
  const initialValues = { transferReceipt: null as File | string | null };

  const validate = (values: typeof initialValues) => {
    const errors: Record<string, string> = {};
    if (!values.transferReceipt) {
      errors.transferReceipt = "Transfer receipt is required";
    }
    return errors;
  };

  const handleSubmit = (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    // Validate file exists
    if (!values.transferReceipt) {
      helpers.setFieldError("transferReceipt", "Transfer receipt is required");
      helpers.setSubmitting(false);
      return;
    }

    // Call the onConfirm callback with the file and close modal
    onConfirm?.(values.transferReceipt);
    helpers.setSubmitting(false);
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Approve Withdrawal">
      <p className="mb-4">{message}</p>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnMount
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Transfer Receipt</label>
              <TestFileUpload name="transferReceipt" formik={formik} />
            </div>

            {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-60"
                onClick={() => onClose()}
                disabled={loading || formik.isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white flex items-center justify-center min-w-[90px] disabled:opacity-60"
                disabled={loading || !formik.values.transferReceipt || formik.isSubmitting}
              >
                {loading || formik.isSubmitting ? "Approving..." : "Approve"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </BaseModal>
  );
};

export default ApproveModal;
