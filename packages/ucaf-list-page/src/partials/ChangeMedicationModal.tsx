/*
 *
 * Component: `ChangeMedicationModal`.
 *
 */
import { memo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Flex from "@exsys-patient-insurance/flex";
import Button from "@exsys-patient-insurance/button";
import InputNumber from "@exsys-patient-insurance/input-number";
import LabeledViewLikeInput from "@exsys-patient-insurance/labeled-view-like-input";
import useFormManager from "@exsys-patient-insurance/form-manager";
import Modal from "@exsys-patient-insurance/modal";
import { useCurrentUserType } from "@exsys-patient-insurance/app-config-store";
import ServicesModal, {
  OnSelectServiceType,
} from "@exsys-patient-insurance/services-modal";
import { useOpenCloseActionsWithState } from "@exsys-patient-insurance/hooks";
import {
  RequestTableRecordType,
  ServiceItemValuesForPostApiType,
} from "../index.interface";

const changeMedicationDataInitialState = {
  new_request_price: undefined,
  newServiceData: {} as ServiceItemValuesForPostApiType,
};

interface ChangeMedicationModalProps {
  selectedRecord: RequestTableRecordType;
  rootOrganizationNo: string;
  patientCardNo: string;
  ucafDate?: string;
  claimFlag?: string;
  ucafType?: string;
  changeMedicationModalVisible: boolean;
  closeChangeMedicationModalVisible: () => void;
  isSavingRequest?: boolean;
  handleSaveServiceRequest: (
    values: ServiceItemValuesForPostApiType,
    showNotificationAndRefetchData?: boolean
  ) => Promise<void>;
}

const ChangeMedicationModal = ({
  rootOrganizationNo,
  patientCardNo,
  ucafDate,
  claimFlag,
  ucafType,
  changeMedicationModalVisible,
  closeChangeMedicationModalVisible,
  isSavingRequest,
  handleSaveServiceRequest,
  selectedRecord: {
    provider_no,
    price: oldPrice,
    service_name,
    service_code,
    ucaf_dtl_pk,
    qty: oldQty,
    delivery_qty,
    delivery_date,
    delivery_doc_no,
    status,
    reply_notes,
    is_system_approved,
    approval_reply,
    approved_quantity,
    specialty_type: oldSpecialtyType,
    patient_share_prc: oldPatientShare,
    price_disc_prc: oldPriceDiscount,
  },
}: ChangeMedicationModalProps) => {
  const { pageType } = useParams();
  const { isDoctorUser } = useCurrentUserType();
  const { visible, handleClose, handleOpen } = useOpenCloseActionsWithState();

  const {
    values: { new_request_price, newServiceData },
    handleChange,
  } = useFormManager({
    initialValues: changeMedicationDataInitialState,
  });

  const isDoctorView = pageType === "D";

  const servicesRequestParams = {
    root_organization_no: rootOrganizationNo,
    patient_card_no: patientCardNo,
    ucaf_date: ucafDate,
    claim_flag: claimFlag,
    attendance_type: ucafType,
  };

  const shouldRenderServiceModal = !!(
    rootOrganizationNo &&
    patientCardNo &&
    ucafDate &&
    claimFlag &&
    ucafType
  );

  const isInPatientUcafType = ucafType === "I";

  const handleSelectService: OnSelectServiceType = useCallback(
    (
      {
        price,
        service_name,
        service_id,
        price_disc_prc,
        copay,
        specialty_type,
        approval,
      },
      inClinicService
    ) =>
      handleChange({
        name: "newServiceData",
        value: {
          service_code: service_id,
          service_name,
          qty: oldQty,
          price,
          inClinicService,
          specialty_type,
          price_disc_prc,
          patient_share_prc: copay,
          approval,
          ...(inClinicService ? null : { delivery_doc_no: undefined }),
        },
      }),
    [oldQty, handleChange]
  );

  const {
    service_code: newServiceCode,
    service_name: newServiceName,
    qty: newQty,
  } = newServiceData;

  const initialInClinicService =
    isInPatientUcafType || !!provider_no || !isDoctorUser;

  const handleSaveData = useCallback(async () => {
    const {
      service_code: newServiceCode,
      inClinicService,
      specialty_type,
      patient_share_prc,
      price_disc_prc,
      approval,
      price: newPrice,
      qty,
      status: newStatus,
    } = newServiceData;

    const data = {
      new_request_price,
      ucaf_dtl_pk,
      service_code: newServiceCode || service_code,
      price: newServiceCode ? newPrice : oldPrice,
      approved_quantity: newServiceCode ? qty : approved_quantity,
      qty: newServiceCode ? qty : oldQty,
      specialty_type: specialty_type || oldSpecialtyType,
      inClinicService: newServiceCode
        ? inClinicService
        : initialInClinicService,
      delivery_qty,
      delivery_date,
      delivery_doc_no,
      record_status: "u",
      patient_share_prc: newServiceCode ? patient_share_prc : oldPatientShare,
      price_disc_prc: newServiceCode ? price_disc_prc : oldPriceDiscount,
      status: newStatus || status,
      approval,
      reply_notes,
      is_system_approved,
      approval_reply,
    };

    await Promise.all([
      // @ts-ignore
      handleSaveServiceRequest(data, true),
      setTimeout(closeChangeMedicationModalVisible, 150),
    ]);
  }, [
    newServiceData,
    handleClose,
    handleSaveServiceRequest,
    oldPrice,
    service_code,
    ucaf_dtl_pk,
    delivery_qty,
    delivery_date,
    delivery_doc_no,
    oldQty,
    status,
    reply_notes,
    is_system_approved,
    approval_reply,
    oldPatientShare,
    oldPriceDiscount,
  ]);

  const saveDisabled = !(newServiceName || new_request_price);

  return (
    <Modal
      width="900px"
      bodyMaxHeight="95%"
      title="chngsrvce"
      destroyOnClose
      visible={changeMedicationModalVisible}
      onClose={closeChangeMedicationModalVisible}
      onOk={handleSaveData}
      disabled={isSavingRequest || saveDisabled}
      loading={isSavingRequest}
      okText="save"
      maskClosable={false}
    >
      <Flex width="100%" column="true" gap="12px">
        <Flex width="100%" gap="12px" align="center">
          <LabeledViewLikeInput
            value={oldPrice}
            label="prc"
            width="150px"
            justify="center"
          />

          <InputNumber
            name="new_request_price"
            value={new_request_price}
            width="150px"
            label="newprc"
            onChange={handleChange}
          />
        </Flex>

        <Flex
          width="100%"
          gap="12px"
          align="center"
          wrap="true"
          bordered
          padding="12px 4px"
        >
          <LabeledViewLikeInput
            value={`${service_code} - ${service_name}`}
            label="prodctnam"
            width="45%"
            justify="center"
            ellipsis="true"
          />

          <LabeledViewLikeInput
            value={`${newServiceCode || ""} - ${newServiceName || ""}`}
            label="newprodctnam"
            width="45%"
            justify="center"
            ellipsis="true"
          />

          <LabeledViewLikeInput
            value={oldQty}
            label="qty"
            width="150px"
            justify="center"
          />

          <InputNumber
            name="newServiceData.qty"
            value={newQty}
            width="150px"
            label="newqty"
            onChange={handleChange}
            disabled={!newServiceName}
          />

          <Button label="chngsrvce" type="primary" onClick={handleOpen} />
        </Flex>

        {shouldRenderServiceModal && (
          <ServicesModal
            visible={visible}
            searchParams={servicesRequestParams}
            onClose={handleClose}
            onSelectService={handleSelectService}
            showInClinicServiceCheckbox={isDoctorView}
            showAdmissionButton={isInPatientUcafType}
            initialInClinicService={initialInClinicService}
          />
        )}
      </Flex>
    </Modal>
  );
};

export default memo(ChangeMedicationModal);