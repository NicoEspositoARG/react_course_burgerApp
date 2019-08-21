import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux"
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler"
import * as actions from "../../../store/actions/index"

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your name"
        },
        value: "",
        validation: {
          required: true
        },
        valid:false,
        touched:false
      },

      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street"
        },
        value: "",
        validation: {
          required: true
        },
        valid:false,
        touched:false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your zip code"
        },
        value: "",
        validation: {
          required: true,
          minLength:5,
          maxLength:5
        },
        valid:false,
        touched:false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country"
        },
        value: "",
        validation: {
          required: true
        },
        valid:false,
        touched:false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your E-mail"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" }
          ]
        },
        value: "fastest",
        validation: {},
        valid: true
      }
    },
    formIsValid:false
  };
  orderHandler = event => {
    event.preventDefault();

    const formData = {}
    for (let forElementIdentifier in this.state.orderForm) { //cada input
      formData[forElementIdentifier] = this.state.orderForm[forElementIdentifier].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId
    };

    this.props.onOrderBurger(order, this.props.token)
  };

  checkValidity(value, rules){
    let isValid = true;
    
      if (rules.required) {
        isValid = value.trim() !=="" && isValid;
      }
      if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
      }
      if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
      }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    } 
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier] // value like email, or delivery method
    }
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;

    for (let inputIds in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIds].valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid:formIsValid}); 
  }

  render() {
      const formElementsArray = [];

      for (let key in this.state.orderForm) {
          formElementsArray.push({
              id:key,
              config: this.state.orderForm[key]
          });
      }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }

}

const mapDispatchToProps = dispatch => {  
  return { 
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  }

}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(ContactData, axios));
