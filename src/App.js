import React from 'react';
import './App.css';
import {Formik, useField, Form, Field} from 'formik';
import * as Yup from 'yup';

const CustomTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  )
}



const App = () => {
  const [borrowers, setBorrowers] = React.useState(['borrower1', 'borrower2']);

  const addButton = () => {
    setBorrowers(b => [...b, 'borrower3']);
  };

  const removeButton = async (formProps) => {
    await ['Name', 'Email'].map(async fieldName => {
      formProps.values[`borrower3${fieldName}`] = formProps.values[`borrower2${fieldName}`];
      formProps.values[`borrower2${fieldName}`] = '';
      console.log('>>>> formProps.values', formProps.values);
    })
    console.log('>>>>> END OF MAP');
    await formProps.resetForm(formProps.values);
    await formProps.validateForm().then(values => {
      setBorrowers(b => b.filter(bo => bo !== 'borrower2'));
    });
  };

  return (
    <div className="App">
      <Formik
        initialValues={{
          name: '',
          email: '',
        }}
        validationSchema={Yup.object({
          borrower1Name: Yup.string()
            .min(3, 'Must be atleast 3 characters')
            .max(6, 'Must be 15 characters or less')
            .required('Cannot be empty'),
          borrower2Name: Yup.string()
            .min(3, 'Must be atleast 3 characters')
            .max(6, 'Must be 15 characters or less')
            .required('Cannot be empty'),
          borrower3Name: Yup.string()
            .min(3, 'Must be atleast 3 characters')
            .max(6, 'Must be 15 characters or less')
            .required('Cannot be empty'),
          borrower1Email: Yup.string()
            .email('Invalid email address')
            .required('Cannot be empty'),
          borrower2Email: Yup.string()
            .email('Invalid email address')
            .required('Cannot be empty'),
          borrower3Email: Yup.string()
            .email('Invalid email address')
            .required('Cannot be empty')
        })}
        onSubmit={((values, {setSubmitting, resetForm}) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            resetForm();
            setSubmitting(false)
          }, 3000)
        })}
      >
        {formProps => (
          <Form>
            <h1>Sign Up</h1>
            {borrowers.map(borrower => <>
              <Field name={`${borrower}Name`} as={CustomTextInput} label={`${borrower}Name`} placeholder="name" />
              <br/>
              <Field name={`${borrower}Email`} as={CustomTextInput} label={`${borrower}Email`} placeholder="Name@org.com" />
              <br/>
            </>)}
            <button type='button' onClick={() => addButton()}>Add</button>
            <button type='submit' onClick={async () => await removeButton(formProps)}>Remove</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
