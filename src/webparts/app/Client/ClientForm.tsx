import * as React from 'react';
import { useFormikContext } from 'formik';
import TextBox from '../Controls/TextBox';
import { IClient } from '../Models/IClient';
import { useAtom } from 'jotai';
import formSettingsAtom from '../Stores/FormStore';
import DropDownField from '../Controls/DropDown';

export default function ClientForm({props}) {
  const { values, setValues } = useFormikContext<IClient>();
  const [settings, setSettings] = useAtom(formSettingsAtom);
  //console.log("settings:", settings.view);
  //console.log("props", props);
  React.useEffect(() => {
    if (props) {
      //console.log('item', props);
      setValues(props);
    }
  }, [props]);
  
  return (
    <div>
      <TextBox id="Title" name="Title" label="Meno"value={values.Title} />
      <TextBox id="priezvisko" name="priezvisko" label="Priezvisko" value={values.priezvisko} />
      <TextBox id="rodneCislo" name="rodneCislo" label="Rodné Číslo" value={values.rodneCislo} />
      <TextBox id="datumNarodenia" name="datumNarodenia" label="Dátum Narodenia" value={values.datumNarodenia} />
      <TextBox id="telCislo" name="telCislo" label="Telefónne Číslo" value={values.telCislo} />
      <TextBox id="mesto" name="mesto" label="Mesto" value={values.mesto} />
      <TextBox id="ulica" name="ulica" label="Ulica" value={values.ulica} />
      <TextBox id="psc" name="psc" label="PSČ" value={values.psc} />
      <TextBox id="okres" name="okres" label="Okres" value={values.okres} />
      {/* {settings.view === "admin" &&
        <TextBox id="status" name="status" label="Status" value={values.status} />
      } */}
    </div>
  );
}
