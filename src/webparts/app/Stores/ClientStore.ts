import { atom } from 'jotai';
import { clientDefaultData } from '../Constants/FormDefaultValue';

import { IClient } from '../Models/IClient';

const clientAtom = atom<IClient>(clientDefaultData);
export default clientAtom;
