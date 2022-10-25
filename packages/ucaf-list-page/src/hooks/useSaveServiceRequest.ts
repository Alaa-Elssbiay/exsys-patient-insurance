/*
 *
 * Hook: `useSaveServiceRequest`.
 *
 */
import { useCallback } from "react";
import {
  useGlobalProviderNo,
  useAppConfigStore,
  useCurrentUserType,
} from "@exsys-patient-insurance/app-config-store";
import { useBasicMutation } from "@exsys-patient-insurance/network-hooks";
import { CapitalBooleanStringType } from "@exsys-patient-insurance/types";
import {
  RequestDetailsType,
  ServiceItemValuesForPostApiType,
} from "../index.interface";

type BaseRequestValuesType = Omit<
  RequestDetailsType,
  "doctor_department_name"
> & {
  patient_card_no?: string;
  insurance_company_no?: number;
  paper_serial: string;
  is_chronic?: CapitalBooleanStringType;
};

const useSaveServiceRequest = (
  baseDetailsValues: BaseRequestValuesType,
  onSuccess: () => void
) => {
  const providerNo = useGlobalProviderNo();
  const { isDoctorUser } = useCurrentUserType();
  const { addNotification } = useAppConfigStore();

  const { loading, mutate } = useBasicMutation({
    apiId: "POST_SERVICES_REQUESTS_ITEM",
  });

  const handleSaveServiceRequest = useCallback(
    ({
      ucaf_dtl_pk,
      service_code,
      qty,
      price,
      delivery_qty,
      delivery_date,
      delivery_doc_no,
      record_status,
      inClinicService,
    }: ServiceItemValuesForPostApiType) => {
      const {
        root_organization_no,
        doctor_provider_no,
        doctor_provider_name,
        ucafe_type,
        ucafe_date,
        claim_flag,
        ucaf_id,
        doctor_department_id,
        complain,
        signs,
        primary_diag_code,
        primary_diagnosis,
        is_chronic,
        patient_card_no,
        insurance_company_no,
        provider_notes,
        paper_serial,
        stamped,
        agreed,
        expected_days,
        expected_amount,
      } = baseDetailsValues;

      if (!service_code) {
        addNotification({
          type: "error",
          message: "plsslctprodct",
        });
        return;
      }

      if (!primary_diag_code || !primary_diagnosis) {
        addNotification({
          type: "error",
          message: "plsslctdiag",
        });
        return;
      }

      let provider_no = `${providerNo}`;

      if (isDoctorUser) {
        provider_no = inClinicService ? `${doctor_provider_no}` : "";
      }

      const data = {
        root_organization_no,
        patient_card_no,
        insurance_company_no,
        ucafe_date,
        claim_flag,
        ucaf_id,
        doctor_provider_no,
        doctor_provider_name,
        doctor_department_id,
        complain,
        signs,
        primary_diag_code,
        primary_diagnosis,
        ucafe_type,
        is_chronic,
        paper_serial,
        stamped,
        agreed,
        ...(ucafe_type === "I"
          ? {
              expected_days,
              expected_amount,
            }
          : null),
        data: [
          {
            ucaf_dtl_pk: record_status === "n" ? "" : ucaf_dtl_pk,
            service_code,
            delivery_qty,
            qty,
            price,
            delivery_date,
            delivery_doc_no,
            record_status,
            provider_no: provider_no,
            provider_notes: inClinicService ? provider_notes : "",
          },
        ],
      };

      mutate({
        body: data,
        cb: ({ apiValues, error }) => {
          const isError = !!error || apiValues?.status !== "success";
          if (!isError) {
            onSuccess();
          }

          addNotification({
            type: isError ? "error" : "success",
            message: isError ? error || "flssve" : "succmsg",
          });
        },
      });
    },
    [mutate, providerNo, baseDetailsValues, onSuccess, addNotification]
  );

  return {
    loading,
    handleSaveServiceRequest,
  };
};

export default useSaveServiceRequest;
