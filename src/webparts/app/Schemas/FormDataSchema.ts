import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { IFormData } from '../Models/IFormData';
import * as strings from 'AppWebPartStrings';

function isEmptyValue(val: unknown) {
  if (isEmpty(val)) return true;
  return false;
}

export const FormDataSchema = Yup.object().shape<
  Record<keyof IFormData, Yup.AnySchema>
>(
  {
    id: Yup.string().uuid()
      .required(),
    Title: Yup.string()
      .required(strings.RequiredField),
    priezvisko: Yup.string()
      .required(strings.RequiredField),
    rodneCislo: Yup.string()
      .required(strings.RequiredField),
    telCislo: Yup.string()
      .required(strings.RequiredField),
    datumNarodenia: Yup.string()
      .required(strings.RequiredField),
    mesto: Yup.string()
      .required(strings.RequiredField),
    ulica: Yup.string()
      .required(strings.RequiredField),
    psc: Yup.string()
      .required(strings.RequiredField),
    okres: Yup.string()
      .required(strings.RequiredField),
    // telCislo: Yup.string()
    //   .required(strings.RequiredField)
    //   .matches(
    //     /^\+(?:[0-9]●?){10,14}[0-9]$/,
    //     strings.BadForm
    //   ),
    // rodneCislo: Yup.string()
    // .required(strings.RequiredField)
    //   .matches(
    //     /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/,
    //     strings.BadForm
    //   ),
    // datumNarodenia: Yup.string()
    // .required(strings.RequiredField)
    //   .matches(
    //     /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/,
    //     strings.BadForm
    //   ),
  },
);
