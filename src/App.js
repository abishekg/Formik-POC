import React from 'react';
import './App.css';
import {Formik, useField, Form, Field, FieldArray} from 'formik';
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
    <div className="">
      <Formik
        initialValues={{
          borrowers: [{borrwerPosision: 1, firstName: '', lastName: ''}, {
            borrwerPosision: 2,
            firstName: '',
            lastName: '',
            ssn: ''
          }],
        }}
        validationSchema={Yup.object().shape({
          borrowers: Yup.array()
            .of(
              Yup.object().shape({
                firstName: Yup.string()
                  .required('Required'), // these constraints take precedence
                lastName: Yup.string()
                  .min(2, 'GO')
                  .required('Required'), // these constraints take precedence
              })

            )

            .required('Must have friends') // these constraints are shown if and only if inner constraints are satisfied

            .min(3, 'Minimum of 3 friends'),

        })}
        onSubmit={((values, {setSubmitting, resetForm}) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            // resetForm();
            setSubmitting(false)
          }, 3000)
        })}
      >
        {formProps => (
          <Form>
            <h1>Sign Up</h1>

            <FieldArray name='borrowers' validateOnChange>
              {fieldArrayProps => {
                console.log('>>>>> fieldArrayProps', fieldArrayProps);
                const removeOnClick = (index) => {
                  console.log('>>>>> fieldArrayProps.form.values.borrowers', fieldArrayProps.form.values.borrowers);

                  for (let idx = index+1; idx < fieldArrayProps.form.values.borrowers.length; idx++) {
                    console.log('>>>> fieldArrayProps.form.values.borrowers[index].borrwerPosision', fieldArrayProps.form.values.borrowers[idx].borrwerPosision);
                    formProps.setFieldValue(`borrowers.${idx}.borrwerPosision`, fieldArrayProps.form.values.borrowers[idx].borrwerPosision - 1, false);
                  }
                  fieldArrayProps.remove(index);
                };

                //

                return (
                  <div>
                    {fieldArrayProps.form.values.borrowers.map((borrower, index) => {
                      return <div className={'parent'}>
                          <div className={'child'}>
                            <Field
                              name={`borrowers.${index}.firstName`}
                              as={CustomTextInput} label={`FirstName`} placeholder="name"/>
                            <br/>
                            <Field name={`borrowers.${index}.lastName`}
                                   as={CustomTextInput} label={`LastName`}
                                   placeholder="Name@org.com"/>
                            <br/>
                          </div>
                          <div>
                            <button type='button' onClick={() => removeOnClick(index)}>Remove</button>
                          </div>
                        </div>
                      })
                    }
                    <button type='button' onClick={() => fieldArrayProps.push({borrwerPosision: fieldArrayProps.form.values.borrowers.length + 1, firstName: '', lastName: ''})}>Add</button>
                  </div>)
              }}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
}


/***
 * when we add we should setFieldValue value for BorrowerPosition.
 * Validation
 */

export default App;
