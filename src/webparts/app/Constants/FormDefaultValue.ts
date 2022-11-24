import { v4 as uuidv4 } from 'uuid';
import { IClient } from '../Models/IClient';
import { IProducts } from '../Models/IProducts';

export const clientDefaultData: IClient = {
  id: uuidv4(),
  Title: '',
  priezvisko: '',
  rodneCislo: '',
  datumNarodenia: '',
  ulica: '',
  mesto: '',
  psc: '',
  okres: '',
  telCislo: '',
  produkty: '',
  status: '',
};
// export const clientDefaultData1: IClient = {
//   id: uuidv4(),
//   Title: '',
//   meno: 'Mar',
//   priezvisko: 'Jar',
//   rodneCislo: '1111111',
//   datumNarodenia: '10.10.1991',
//   ulica: 'Ul',
//   mesto: 'Me',
//   psc: 'PSC',
//   okres: 'Ok',
//   telCislo: '+42111111111111',
//   status: 'naKontrolu',
// };

export const productDefaultData0 = {}

export const productDefaultData1: IProducts[] = [{
  productId: uuidv4(),
  productNote: '',
  productName: '',
  productPayment: ''
}]
export const productDefaultData: IProducts = {
  productId: uuidv4(),
  productName: '',
  productNote: '',
  productPayment: ''
}  

export const productDefaultData2: IProducts[] = [
  {
    productId: uuidv4(),
    productName: "nazov",
    productNote: "poznámka",
    productPayment: "mesacne",
  },
  {
    productId: uuidv4(),
    productName: "naz",
    productNote: "ppppppppp",
    productPayment: "stvrtrocne",
  },
]
