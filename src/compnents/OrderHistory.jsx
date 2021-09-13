import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import "./OrderHistory.css";
import { Table } from "react-bootstrap";

const OrderHistory = () => {
  const [user, setUser] = useState();
  const [orders, setOrders] = useState([]);
  // fetch user in database
  useEffect(() => {
    db.collection("user")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        snapshot.docs.foreach(doc => {
          if (doc.data().email === auth.currentUser?.email) {
            setUser({
              id: doc.id,
              user: doc.data(),
            });
          }
        });
        // snapshot.docs.map(doc => {
        //   if (doc.data().email === auth.currentUser?.email) {
        //     setUser({
        //       id: doc.id,
        //       user: doc.data(),
        //     });
        //   }
        // });
      });
  }, []);

  console.log(user?.id);
  // fetch user order data
  useEffect(() => {
    db.collection("user")
      .doc(user?.id)
      .collection("orders")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
      });
  }, [user]);
  console.log(orders);
  return (
    <div className="order__history">
      {!orders ? (
        <h3>No Orders Yet</h3>
      ) : (
        <>
          <h2>Order History</h2>
          <div className="order__history_table">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((orderVal, ind) => (
                  <tr>
                    <td>{ind}</td>
                    <td>
                      {new Date(orderVal?.date?.seconds * 1000).toString()}
                    </td>
                    <td>
                      {orderVal.order.map(prod => (
                        <>
                          <span>{prod}</span>

                          <br />
                          <hr />
                        </>
                      ))}
                    </td>
                    <td>
                      {orderVal.price.map(prod => (
                        <>
                          <span>{prod} Rs</span> <br />
                          <hr />
                        </>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
