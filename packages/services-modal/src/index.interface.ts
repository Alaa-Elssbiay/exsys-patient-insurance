/*
 *
 * Types: `@exsys-patient-insurance/services-modal`.
 *
 */
import { RecordTypeWithAnyValue } from "@exsys-patient-insurance/types";

export interface ServiceRequestItemType {
  total: number;
  service_id: string;
  service_name: string;
  price: number;
  price_disc_prc: number;
  copay: number;
  reimbursement_add_copay: number;
  approval: string;
  specialty_type: string;
}

export type OnSelectServiceType = (
  item: ServiceRequestItemType,
  inClinicService: boolean
) => void;

export interface ServicesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectService: OnSelectServiceType;
  searchParams?: RecordTypeWithAnyValue;
}
