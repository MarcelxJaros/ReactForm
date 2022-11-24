import { atom } from 'jotai';
import { productDefaultData0, clientDefaultData, productDefaultData1, productDefaultData2 } from '../Constants/FormDefaultValue';
import { IProducts } from '../Models/IProducts';
import { IClient } from '../Models/IClient';

const productsAtom = atom<IProducts[]>(productDefaultData2);


export default productsAtom;
