import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { IFormData } from '../Models/IFormData';
import { IProducts } from '../Models/IProducts';
import * as strings from 'AppWebPartStrings';

function isEmptyValue(val: unknown) {
  if (isEmpty(val)) return true;
  return false;
}

export const ProductDataSchema = Yup.object().shape<
  Record<keyof IProducts, Yup.AnySchema>
>(
  {
    productId: Yup.string()
      .uuid(),
    productName: Yup.string()
      .required(strings.RequiredField),
    productNote: Yup.string()
      .min(5, strings.NoteAtLeast5)
      .required(strings.RequiredField),
    productPayment: Yup.string()
    .required(strings.ChooseOne),
    productStatus: Yup.string(
      
    )
  }
);
