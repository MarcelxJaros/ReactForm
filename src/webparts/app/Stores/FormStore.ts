import { atom } from 'jotai';
import { IFormSettings } from '../Models/IFormSettings';

const formSettingsAtom = atom<IFormSettings>({
  view: "new",
  itemId: 0,
});

export default formSettingsAtom;
