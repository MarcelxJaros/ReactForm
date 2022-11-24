import * as React from 'react';
import { useFormikContext } from 'formik';
import { IIconProps, PrimaryButton } from '@fluentui/react';

const AddProductButton = () => {
  const { handleSubmit } = useFormikContext();
  const addIcon: IIconProps = { iconName: 'AddNotes' };

  const submitProduct = React.useCallback(() => {
    console.log("klik");
    handleSubmit();
  }, [handleSubmit]);

  return <PrimaryButton iconProps={addIcon} onClick={submitProduct}>Pridať</PrimaryButton>;
};

export default AddProductButton;
