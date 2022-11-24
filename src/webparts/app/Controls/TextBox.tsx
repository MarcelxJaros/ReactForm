import * as React from 'react';
import { ITextFieldProps, TextField } from '@fluentui/react';
import { useField, useFormikContext } from 'formik';
import { IFormData } from '../Models/IFormData';
import { useAtom } from 'jotai';
import formSettingsAtom from '../Stores/FormStore';
import FormView from '../Controls/TextBox' 
const TextBox = (props: ITextFieldProps) => {
  const { name } = props;
  const { setFieldValue, touched, errors } = useFormikContext<IFormData>();
  const [field, meta] = useField(name);
  const [settings, setSettings] = useAtom(formSettingsAtom);

  const error = React.useMemo(() => {
    return meta && meta.touched && meta.error;
  }, [meta]);

  const handleChange = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setFieldValue(name, newValue);
    },
    [name]
  );

  const config = {
    ...field,
    ...props,
    onChange: handleChange,
  };

  return <TextField {...config} readOnly={settings.view === "display" || settings.view === "edit"} disabled={settings.view === "display" || settings.view === "edit"} errorMessage={touched[name] && errors[name]} />;
};

export default TextBox;
