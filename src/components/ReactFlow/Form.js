import { useForm } from 'react-hook-form';
import React from 'react';
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

export default function Form({ onSubmit }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      title: '',
      isFallback: false,
    },
    resolver: yupResolver(validationSchema),
  });

  console.log(onSubmit);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputForm name="name" control={control} label="Name" />

      <InputForm name="title" control={control} label="Title" />

      <CheckboxForm name="isFallback" control={control} label="Is fallback node" />
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
};

Form.defaultProps = {
  onSubmit: null,
};
