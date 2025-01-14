import { PortTypes } from '@/features/services/components/ServiceForm/components/PortsFormSection/PortsFormSectionTypes';
import type { DialogFormProps } from '@/types/common';
import * as Yup from 'yup';

import {
  MAX_SERVICES_CPU,
  MAX_SERVICES_MEM,
  MAX_SERVICE_REPLICAS,
  MIN_SERVICES_CPU,
  MIN_SERVICES_MEM,
} from '@/features/projects/resources/settings/utils/resourceSettingsValidationSchema';

export const validationSchema = Yup.object({
  name: Yup.string().required('The name is required.'),
  image: Yup.string().label('Image to run'),
  command: Yup.string(),
  environment: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      value: Yup.string().required(),
    }),
  ),
  compute: Yup.object({
    cpu: Yup.number().min(MIN_SERVICES_CPU).max(MAX_SERVICES_CPU).required(),
    memory: Yup.number().min(MIN_SERVICES_MEM).max(MAX_SERVICES_MEM).required(),
  }),
  replicas: Yup.number().min(0).max(MAX_SERVICE_REPLICAS).required(),
  ports: Yup.array().of(
    Yup.object().shape({
      port: Yup.number().required(),
      type: Yup.mixed<PortTypes>().oneOf(Object.values(PortTypes)).required(),
      publish: Yup.boolean().default(false),
    }),
  ),
  storage: Yup.array().of(
    Yup.object()
      .shape({
        name: Yup.string().required(),
        path: Yup.string().required(),
        capacity: Yup.number().nonNullable().required(),
      })
      .required(),
  ),
});

export type ServiceFormValues = Yup.InferType<typeof validationSchema>;

export interface ServiceFormProps extends DialogFormProps {
  /**
   * To use in conjunction with initialData to allow for updating the service
   */
  serviceID?: string;

  /**
   * if there is initialData then it's an update operation
   */
  initialData?: ServiceFormValues & { subdomain?: string }; // subdomain is only set on the backend

  /**
   * Function to be called when the operation is cancelled.
   */
  onCancel?: VoidFunction;
  /**
   * Function to be called when the submit is successful.
   */
  onSubmit?: VoidFunction | ((args?: any) => Promise<any>);
}
