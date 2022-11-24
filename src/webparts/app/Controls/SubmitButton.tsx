import * as React from 'react';
import { useFormikContext } from 'formik';
import { PrimaryButton } from '@fluentui/react';

const SubmitButton = () => {
  const { handleSubmit } = useFormikContext();

  const submit = React.useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return <PrimaryButton onClick={submit}>Submit</PrimaryButton>;
};

export default SubmitButton;
