/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { Select } from 'antd';
import omit from 'lodash/omit';
import React from 'react';
import { useController } from 'react-hook-form';

export default function SelectForm(props) {
  const { label, name, control, children, ...restProps } = props;
  const {
    field: fieldProps,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className="py-2">
      {label && <label className="ant-form-item-label">{label}</label>}
      <Select
        style={{ width: '100%' }}
        {...omit(restProps, 'value', 'onChange', 'defaultValue')}
        {...fieldProps}
        status={error && 'error'}
      >
        {children}
      </Select>
      {error && <div className="ant-form-item-explain-error">{error?.message}</div>}
    </div>
  );
}

SelectForm.Item = Select.Option;
