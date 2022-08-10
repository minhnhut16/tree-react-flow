/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { Input } from 'antd';
import omit from 'lodash/omit';
import React from 'react';
import { useController } from 'react-hook-form';

export default function InputForm(props) {
  const { label, name, control, ...restProps } = props;
  const {
    field: fieldProps,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className="py-2">
      {label && <label className="ant-form-item-label">{label}</label>}
      <Input
        {...omit(restProps, 'value', 'onChange', 'defaultValue')}
        {...fieldProps}
        status={error && 'error'}
      />
      {error && <div className="ant-form-item-explain-error">{error?.message}</div>}
    </div>
  );
}
