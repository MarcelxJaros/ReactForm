import * as React from 'react';
import { useFormikContext } from 'formik';
import { PrimaryButton, DefaultButton, IIconProps } from '@fluentui/react';
import { atom, useAtom } from 'jotai';
import atomStatusShp from '../Stores/StatusStore';
import formSettingsAtom from '../Stores/FormStore';

const ClientSubmitButton = () => {
  const { handleSubmit, values } = useFormikContext();
  const [statusShp, setStatusShp] = useAtom(atomStatusShp);
  const mailIcon: IIconProps = { iconName: 'Save' };
  const [settings, setSettings] = useAtom(formSettingsAtom);
  
  const submitConcept = React.useCallback(() => {
    setStatusShp("Koncept");
    console.log("ak sú validné, tak volám submitedForm");
    handleSubmit();
  }, [handleSubmit]);

  return <DefaultButton iconProps={mailIcon} onClick={submitConcept} disabled={settings.view === "display"} >Ulož ako koncept</DefaultButton>;
};

export default ClientSubmitButton;
