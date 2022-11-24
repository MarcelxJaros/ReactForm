import * as React from 'react';
import { useFormikContext } from 'formik';
import { PrimaryButton, DefaultButton, IIconProps } from '@fluentui/react';
import { atom, useAtom } from 'jotai';
import atomStatusShp from '../Stores/StatusStore';
import formSettingsAtom from '../Stores/FormStore';

const ClientSubmitButton = () => {
  const { handleSubmit, values } = useFormikContext();
  const [statusShp, setStatusShp] = useAtom(atomStatusShp);
  const mailIcon: IIconProps = { iconName: 'Mail' };
  const [settings, setSettings] = useAtom(formSettingsAtom);

  const submit = React.useCallback(() => {
    console.log(values);
    setStatusShp("Pošli");
    console.log("ak sú validné, tak volám submitedForm");
    handleSubmit();
  }, [handleSubmit]);

  return <PrimaryButton iconProps={mailIcon} onClick={submit} disabled={settings.view === "display"} >Pošli na kontrolu</PrimaryButton>;
};

export default ClientSubmitButton;
