import * as React from 'react';
import { useFormikContext } from 'formik';
import { IIconProps, PrimaryButton } from '@fluentui/react';

const EditProductButton = () => {
  const { handleSubmit } = useFormikContext();
  const editIcon: IIconProps = { iconName: 'Edit' };

  const submitProduct = React.useCallback(() => {
    console.log("klik");
    handleSubmit();
  }, [handleSubmit]);

  return <PrimaryButton iconProps={editIcon} onClick={submitProduct}>Editovať</PrimaryButton>;
};

export default EditProductButton;
