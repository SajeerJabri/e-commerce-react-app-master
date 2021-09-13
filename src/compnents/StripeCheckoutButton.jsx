import React, { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import firebase from "firebase";
import * as emailjs from "emailjs-com";
import { init } from "emailjs-com";
init("user_sR1LZ07PCdliyJf4jBJqw");

const StripeCheckoutButton = ({ price }) => {
  const dispatch = useDispatch();
  const userEmail = useSelector(state => state.userEmail);
  const history = useHistory();
  const items = useSelector(state => state.items);
  const [user, setUser] = useState();
  const date = new Date();
  const priceForStripe = price * 100;
  const publishableKey = "pk_test_sLUqHXtqXOkwSdPosC8ZikQ800snMatYMb";

  // fetch user in database
  useEffect(() => {
    db.collection("user")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        snapshot.docs.map(doc => {
          if (doc.data().email == auth.currentUser?.email) {
            setUser({
              id: doc.id,
              user: doc.data(),
            });
          }
        });
      });
  }, []);
  // add order details after buy product
  const addUserOrder = event => {
    db.collection("user")
      .doc(user.id)
      .collection("orders")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: date,
        order: items.map(prod => prod.title),
        price: items.map(prod => prod.price),
      });
  };

  var data = {
    to_email: userEmail,
    price: price,
  };

  // after payment successfull
  const onToken = token => {
    console.log(token);
    addUserOrder();
    dispatch({
      type: "EMPTY_ITEMS",
    });
    emailjs
      .send(
        "service_j46017h",
        "template_hti27ho",
        data,
        "user_sR1LZ07PCdliyJf4jBJqw"
      )
      .then(
        function(response) {
          alert("Transaction email sent");
          console.log(response.status, response.text);
        },
        function(err) {
          console.log(err);
        }
      );
    alert("Payment Succesful! ThankYou");
    history.push("/");
  };

  return (
    <StripeCheckout
      label="Pay Now"
      name="E-Commerce Co."
      billingAddress
      shippingAddress
      image="https://www.freakyjolly.com/wp-content/uploads/2020/04/fj-logo.png"
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
