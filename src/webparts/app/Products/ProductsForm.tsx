import * as React from 'react';
import { useField, useFormikContext } from 'formik';
import TextBox from '../Controls/TextBox';
import { IProducts } from '../Models/IProducts';
import { Dropdown, Icon, Stack, TextField } from 'office-ui-fabric-react';
import { IFormData } from '../Models/IFormData';
import DropDownField from '../Controls/DropDown';
import { useAtom } from 'jotai';
import formSettingsAtom from '../Stores/FormStore';

export default function ProductsForm({ editItem }) {
  const { values, setValues } = useFormikContext<IProducts>();
  const [settings, setSettings] = useAtom(formSettingsAtom);
  const options1 = ([
    { text: "Mesačná", key: "Mesačná" },
    { text: "Štvrťročná", key: "Štvrťročná" },
    { text: "Ročná", key: "Ročná" },
  ])
  const options2 = ([
    { text: "Spracovaný", key: "Spracovaný" },
    { text: "Nespracovaný", key: "Nespracovaný" },
  ])
  React.useEffect(() => {
    if (editItem) {
      console.log('item', editItem);
      setValues(editItem);
    }
  }, [editItem]);


  return (
    <div>
      <TextBox id="productName" name="productName" label="Názov Produktu" value={values.productName} />
      <TextBox multiline id="productNote" name="productNote" label="Poznámka" value={values.productNote} />
      <DropDownField id="productPayment" name="productPayment" label="Platba" value={values.productPayment} options={options1} disabled={settings.view === "edit"} />
      { settings.view === "edit" ? <DropDownField id="productStatus" name="productStatus" label="Status" value={values.productStatus} options={options2} disabled={false}/> : null }
    </div>
  );
}
