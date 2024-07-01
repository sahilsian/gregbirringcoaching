// Imports
import {
  SubmitHandler,
  useForm,
  useFormContext,
  FormProvider,
} from 'react-hook-form';

// Components
import { InputField } from '../Input/InputField.component';
import Button from '../UI/Button.component';

// Constants
import { INPUT_FIELDS } from '../../../constants/INPUT_FIELDS';
import { ICheckoutDataProps } from '../../../lib/functions/functions';
import { Input } from '../../Core/Input';
import { useEffect, useState } from 'react';
import siteConfig from '../../../site.config';
import BillingForm from './BillingForm.component';

interface IBillingProps {
  handleFormSubmit: SubmitHandler<ICheckoutDataProps>;
}

const OrderButton = () => {
  const { register } = useFormContext();

  return (
    <div className="w-full">
      <input
        placeholder="paymentMethod"
        type="hidden"
        value="stripe"
        checked
        {...register('paymentMethod')}
      />
      <div className="mt-4 flex justify-center">
        <Button>Pay with Stripe</Button>
      </div>
    </div>
  );
};

const Billing = ({ handleFormSubmit }: IBillingProps) => {
  const methods = useForm<ICheckoutDataProps>();

  return (
    <section className="flex-1 minw300">
      <div className='mb-4 mt-2'>Please fill out the following form to place your order</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
          <div className="mx-auto ">
            <BillingForm></BillingForm>
            <OrderButton />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default Billing;
