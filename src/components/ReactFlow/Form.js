import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import InputForm from '../FormElements/Input';
import CheckboxForm from '../FormElements/Checkbox';

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Please input node name'),
  title: Yup.string()
    .trim()
    .required('Please input title name'),
});

const defaultValues = {
  name: '',
  title: '',
  isFallback: false,
};
export default function Form({ onSubmit, initialValue, isEdit }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ...defaultValues,
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...initialValue,
    });
  }, [initialValue, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm name="name" control={control} label="Name" />

      <InputForm name="title" control={control} label="Title" />

      <CheckboxForm
        disabled={isEdit}
        name="isFallback"
        control={control}
        label="Is fallback node"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Submit
      </button>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  initialValue: PropTypes.shape({}),
  isEdit: PropTypes.bool,
};

Form.defaultProps = {
  onSubmit: null,
  initialValue: {},
  isEdit: false,
};
