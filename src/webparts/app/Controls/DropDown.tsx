import * as React from 'react';
import { ITextFieldProps, IDropdownProps } from '@fluentui/react';
import { Dropdown, Icon, Stack } from 'office-ui-fabric-react';
import { useField, useFormikContext } from 'formik';
import { IFormData } from '../Models/IFormData';
import { useAtom } from 'jotai';
import formSettingsAtom from '../Stores/FormStore';

const DropDownField = (props: any) => {
  const { name, value, options, disabled } = props;

  const { setFieldValue, touched, errors } = useFormikContext();
  const [field, meta] = useField(name);
  const [settings, setSettings] = useAtom(formSettingsAtom);
  const [selected, setSelected] = React.useState({ key: null });

  const error = React.useMemo(() => {
    return meta && meta.touched && meta.error;
  }, [meta]);

  const handleChange = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: { text: string; }
    ) => {
      setFieldValue("productPayment", newValue.text);
    },
    []
  );

  const onClear = (event?: any) => {
    setSelected({ key: null });
    console.log("clicked");
  };

  const config = {
    ...field,
    ...props,
    onChange: handleChange,
  };

  return <Dropdown {...config} options={options} disabled={disabled} errorMessage={touched[name] && errors[name]} defaultSelectedKey={value} 
    onRenderCaretDown={(event) => {
      return (
        <Stack horizontal verticalAlign={"center"}>
          {!!selected.key && (
            <Icon
              iconName={"Cancel"}
              styles={{ root: { color: "rgb(96, 94, 92)", paddingRight: ".7em", } }}
              onClick={(event) => {
                event.stopPropagation();
                onClear(event);
              }}
            />
          )}
          <Icon iconName={"ChevronDown"} styles={{ root: { color: "rgb(96, 94, 92)", } }}
           onClick={(event) => event.currentTarget.parentNode.onClick}
          />
        </Stack>
      );
    }}
  />;
};

export default DropDownField;
